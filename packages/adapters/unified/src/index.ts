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
    const msg = json?.choices?.[0]?.message ?? {}
    let reasoning = ''
    const rawReasoning = (msg as any).reasoning ?? (msg as any).reasoning_content
    if (typeof rawReasoning === 'string') reasoning = rawReasoning
    else if (Array.isArray(rawReasoning))
      reasoning = rawReasoning.map((r: any) => r?.text ?? '').join('')
    if (reasoning) yield { type: 'thinking', value: reasoning }

    let content = msg.content
    if (typeof content !== 'string') {
      content = Array.isArray(content)
        ? content.map((c: any) => c?.text ?? '').join('')
        : ''
    }
    if (content) {
      let mode: 'normal' | 'think' = 'normal'
      let rest = content as string
      while (rest.length > 0) {
        if (mode === 'normal') {
          const idx = rest.indexOf('<think>')
          if (idx === -1) {
            if (rest) yield { type: 'token', value: rest }
            rest = ''
          } else {
            if (idx > 0) yield { type: 'token', value: rest.slice(0, idx) }
            rest = rest.slice(idx + 7)
            mode = 'think'
          }
        } else {
          const idx = rest.indexOf('</think>')
          if (idx === -1) {
            if (rest) yield { type: 'thinking', value: rest }
            rest = ''
          } else {
            if (idx > 0) yield { type: 'thinking', value: rest.slice(0, idx) }
            rest = rest.slice(idx + 8)
            mode = 'normal'
          }
        }
      }
    }
    return
  }

  const reader = res.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  let buffer = ''
  let tail = ''
  let mode: 'normal' | 'think' = 'normal'
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
        const delta = json.choices?.[0]?.delta ?? {}

        // reasoning chunk
        let reasoningChunk = ''
        const rawReason = (delta as any).reasoning ?? (delta as any).reasoning_content
        if (typeof rawReason === 'string') reasoningChunk = rawReason
        else if (Array.isArray(rawReason))
          reasoningChunk = rawReason.map((r: any) => r?.text ?? '').join('')
        if (reasoningChunk) yield { type: 'thinking', value: reasoningChunk }

        // normal content chunk
        const raw = (delta as any).content
        let chunk = ''
        if (typeof raw === 'string') chunk = raw
        else if (Array.isArray(raw))
          chunk = raw.map((c: any) => c?.text ?? '').join('')
        if (!chunk) continue
        tail += chunk
        while (tail) {
          if (mode === 'normal') {
            const idx = tail.indexOf('<think>')
            if (idx === -1) {
              if (tail.length > 10) {
                yield { type: 'token', value: tail.slice(0, tail.length - 10) }
                tail = tail.slice(tail.length - 10)
              }
              break
            } else {
              if (idx > 0) yield { type: 'token', value: tail.slice(0, idx) }
              tail = tail.slice(idx + 7)
              mode = 'think'
            }
          } else {
            const idx = tail.indexOf('</think>')
            if (idx === -1) {
              if (tail.length > 10) {
                yield { type: 'thinking', value: tail.slice(0, tail.length - 10) }
                tail = tail.slice(tail.length - 10)
              }
              break
            } else {
              if (idx > 0) yield { type: 'thinking', value: tail.slice(0, idx) }
              tail = tail.slice(idx + 8)
              mode = 'normal'
            }
          }
        }
      } catch {
        /* ignore */
      }
    }
  }
  if (tail) {
    if (mode === 'think') {
      yield { type: 'thinking', value: tail }
    } else {
      yield { type: 'token', value: tail }
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
