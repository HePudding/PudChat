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

const defaultSettings: Settings = {
  protocol: 'openai',
  endpoint: '',
  apiKey: '',
  models: [],
}

export default function Home() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [showSettings, setShowSettings] = useState(false)
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

  const updateModel = (
    index: number,
    field: keyof SettingsModel,
    value: string | boolean,
  ) => {
    setSettings((s) => ({
      ...s,
      models: s.models.map((m, i) =>
        i === index ? { ...m, [field]: value } : m,
      ),
    }))
  }

  const addModel = () => {
    setSettings((s) => ({
      ...s,
      models: [...s.models, { name: '', thinking: false }],
    }))
  }

  const removeModel = (idx: number) => {
    setSettings((s) => ({ ...s, models: s.models.filter((_, i) => i !== idx) }))
  }

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setShowSettings(false)
    setSelectedModel(settings.models[0]?.name ?? '')
  }

  const send = async () => {
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

  const configured =
    settings.apiKey && settings.endpoint && settings.models.length > 0

  return (
    <main className="relative p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">PudChat</h1>
      {!configured && <p>请在左下角设置中配置模型</p>}
      {configured && (
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

      <button
        className="fixed bottom-4 left-4 border px-2 py-1 bg-white"
        onClick={() => setShowSettings((s) => !s)}
      >
        设置
      </button>

      {showSettings && (
        <div className="fixed bottom-16 left-4 w-80 max-h-[80vh] overflow-auto border bg-white p-4 shadow-lg space-y-4">
          <div className="space-y-2">
            <label className="block">
              <span className="mr-2">Protocol</span>
              <select
                value={settings.protocol}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    protocol: e.target.value as Settings['protocol'],
                  })
                }
                className="border p-1"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </label>
            <label className="block">
              <span className="mr-2">Endpoint</span>
              <input
                className="border p-1 w-full"
                value={settings.endpoint}
                onChange={(e) =>
                  setSettings({ ...settings, endpoint: e.target.value })
                }
              />
            </label>
            <label className="block">
              <span className="mr-2">API Key</span>
              <input
                className="border p-1 w-full"
                value={settings.apiKey}
                onChange={(e) =>
                  setSettings({ ...settings, apiKey: e.target.value })
                }
              />
            </label>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Models</h2>
            {settings.models.map((model, idx) => (
              <div key={idx} className="flex space-x-2 items-center">
                <input
                  className="border p-1 flex-1"
                  placeholder="model name"
                  value={model.name}
                  onChange={(e) => updateModel(idx, 'name', e.target.value)}
                />
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={model.thinking}
                    onChange={(e) =>
                      updateModel(idx, 'thinking', e.target.checked)
                    }
                  />
                  <span>thinking</span>
                </label>
                <button
                  className="border px-2"
                  onClick={() => removeModel(idx)}
                >
                  Delete
                </button>
              </div>
            ))}
            <button className="border px-2" onClick={addModel}>
              Add Model
            </button>
          </div>

          <div className="space-x-2">
            <button className="border px-4 py-1" onClick={saveSettings}>
              Save
            </button>
            <button
              className="border px-4 py-1"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
