import type {
  ChatDelta,
  ChatMessage,
  ChatOptions,
  ProviderConfig,
} from '@pudchat/core'

async function* openaiChat(
  config: ProviderConfig,
  messages: ChatMessage[],
  options: ChatOptions
): AsyncGenerator<ChatDelta> {
  const body = {
    model: config.model,
    messages,
    stream: options.stream ?? true,
  }

  const res = await fetch(`${config.endpoint}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
    signal: options.signal,
  })

  if (!(options.stream ?? true)) {
    const json = await res.json()
    const content = json?.choices?.[0]?.message?.content
    if (content) yield { type: 'token', value: content }
    return
  }

  const reader = res.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        const delta = json.choices?.[0]?.delta?.content
        if (delta) yield { type: 'token', value: delta }
      } catch {
        /* ignore */
      }
    }
  }
}

async function* anthropicChat(
  config: ProviderConfig,
  messages: ChatMessage[],
  options: ChatOptions
): AsyncGenerator<ChatDelta> {
  const body = {
    model: config.model,
    messages,
    stream: options.stream ?? true,
  }

  const res = await fetch(`${config.endpoint}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
    signal: options.signal,
  })

  if (!(options.stream ?? true)) {
    const json = await res.json()
    const blocks = json?.content
    if (Array.isArray(blocks)) {
      for (const block of blocks) {
        if (block.type === 'text') {
          yield { type: 'token', value: block.text }
        } else if (block.type === 'thinking' && config.thinking) {
          yield { type: 'thinking', value: block.text }
        }
      }
    }
    return
  }

  const reader = res.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ''
  let currentEvent: string | undefined
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('event:')) {
        currentEvent = trimmed.slice(6).trim()
        continue
      }
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return
      try {
        const json = JSON.parse(data)
        if (currentEvent === 'content_block_delta') {
          const text = json.delta?.text
          const deltaType = json.delta?.type
          if (text) {
            if (deltaType === 'thinking_delta' && config.thinking) {
              yield { type: 'thinking', value: text }
            } else {
              yield { type: 'token', value: text }
            }
          }
        }
      } catch {
        /* ignore */
      }
    }
  }
}

export function createChatModel(config: ProviderConfig) {
  return async function* (
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): AsyncGenerator<ChatDelta> {
    try {
      yield { type: 'event', event: 'start', value: '' }
      if (config.protocol === 'openai') {
        yield* openaiChat(config, messages, options)
      } else if (config.protocol === 'anthropic') {
        yield* anthropicChat(config, messages, options)
      }
      yield { type: 'event', event: 'end', value: '' }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        yield { type: 'event', event: 'end', value: '' }
      } else {
        yield {
          type: 'event',
          event: 'error',
          value: err?.message || String(err),
        }
      }
    }
  }
}
