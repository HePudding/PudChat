import type { ChatMessage } from '@pudchat/core'

export interface Message extends ChatMessage {
  id: string
  thinking?: string
  /** token count for this message (approximate) */
  tokens?: number
  /** duration of thinking in milliseconds */
  thinkingDuration?: number
  createdAt: number
}

export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: Message[]
  systemPrompt?: string
}

export interface SettingsModel {
  name: string
  thinking: boolean
}

export interface Settings {
  protocol: 'openai' | 'anthropic'
  endpoint: string
  apiKey: string
  models: SettingsModel[]
  showThinkingByDefault: boolean
  maxContextMessages: number
}

const CONVERSATIONS_KEY = 'pudchat:conversations'
const SETTINGS_KEY = 'pudchat:settings'

export const defaultSettings: Settings = {
  protocol: 'openai',
  endpoint: '',
  apiKey: '',
  models: [],
  showThinkingByDefault: true,
  maxContextMessages: 20,
}

export function loadConversations(): Conversation[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(CONVERSATIONS_KEY)
    return raw ? (JSON.parse(raw) as Conversation[]) : []
  } catch {
    return []
  }
}

export function saveConversations(convs: Conversation[]) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convs))
  } catch {
    /* ignore */
  }
}

export function loadSettings(): Settings {
  if (typeof localStorage === 'undefined') return defaultSettings
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw
      ? { ...defaultSettings, ...(JSON.parse(raw) as Settings) }
      : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettings(s: Settings) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}
