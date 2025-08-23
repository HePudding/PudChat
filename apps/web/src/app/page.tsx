'use client'

import { useEffect, useRef, useState } from 'react'
import { createChatModel } from '@pudchat/adapter-unified'
import type { ProviderConfig, ChatMessage } from '@pudchat/core'

interface SettingsModel {
  name: string
  thinking: boolean
}
interface Settings {
  protocol: 'openai' | 'anthropic'
  endpoint: string
  apiKey: string
  models: SettingsModel[]
}

const STORAGE_KEY = 'pudchat:settings'

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [thinking, setThinking] = useState('')
  const [error, setError] = useState('')
  const [stream, setStream] = useState(true)
  const controller = useRef<AbortController | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const s: Settings = JSON.parse(raw)
        setSettings(s)
        setSelectedModel(s.models[0]?.name ?? '')
      } catch {
        /* ignore */
      }
    }
  }, [])

  const send = async () => {
    if (!settings) return
    const modelConf = settings.models.find((m) => m.name === selectedModel)
    if (!modelConf) {
      setError('Model not found')
      return
    }
    const config: ProviderConfig = {
      protocol: settings.protocol,
      endpoint: settings.endpoint,
      apiKey: settings.apiKey,
      model: modelConf.name,
      thinking: modelConf.thinking,
    }
    const model = createChatModel(config)
    const messages: ChatMessage[] = [{ role: 'user', content: input }]
    setResponse('')
    setThinking('')
    setError('')
    controller.current = new AbortController()
    try {
      for await (const delta of model(messages, {
        stream,
        signal: controller.current.signal,
      })) {
        if (delta.type === 'token') {
          setResponse((r) => r + delta.value)
        } else if (delta.type === 'thinking') {
          setThinking((t) => t + delta.value)
        } else if (delta.type === 'event' && delta.event === 'error') {
          setError(delta.value)
        }
      }
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string }
      if (e?.name !== 'AbortError') {
        setError(e?.message || String(err))
      }
    }
  }

  const stop = () => {
    controller.current?.abort()
  }

  return (
    <main className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">PudChat</h1>
      {!settings && <p>Configure settings first on /settings</p>}
      {settings && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <select
              className="border p-1"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {settings.models.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={stream}
                onChange={(e) => setStream(e.target.checked)}
              />
              <span>stream</span>
            </label>
          </div>
          <textarea
            className="border w-full p-2 h-24"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="space-x-2">
            <button className="border px-3" onClick={send}>
              Send
            </button>
            <button className="border px-3" onClick={stop}>
              Stop
            </button>
          </div>
          {thinking && (
            <div className="text-gray-500 whitespace-pre-wrap">{thinking}</div>
          )}
          {response && <div className="whitespace-pre-wrap">{response}</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
        </div>
      )}
    </main>
  )
}
