export type ChatDelta =
  | { type: 'token'; value: string }
  | { type: 'thinking'; value: string }
  | { type: 'event'; event: 'start' | 'end' | 'error'; value: string }

export interface ProviderConfig {
  protocol: 'openai' | 'anthropic'
  endpoint: string
  apiKey: string
  model: string
  thinking?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatOptions {
  stream?: boolean
  signal?: AbortSignal
}
