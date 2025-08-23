'use client'

import { useEffect, useState } from 'react'

interface ModelItem {
  name: string
  thinking: boolean
}

interface Settings {
  protocol: 'openai' | 'anthropic'
  endpoint: string
  apiKey: string
  models: ModelItem[]
}

const STORAGE_KEY = 'pudchat:settings'

const defaultSettings: Settings = {
  protocol: 'openai',
  endpoint: '',
  apiKey: '',
  models: [],
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  useEffect(() => {
    const raw =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (raw) {
      try {
        setSettings(JSON.parse(raw))
      } catch {
        /* ignore */
      }
    }
  }, [])

  const updateModel = (
    index: number,
    field: keyof ModelItem,
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

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    alert('Saved!')
  }

  return (
    <main className="p-4 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold">Settings</h1>
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
                onChange={(e) => updateModel(idx, 'thinking', e.target.checked)}
              />
              <span>thinking</span>
            </label>
            <button className="border px-2" onClick={() => removeModel(idx)}>
              Delete
            </button>
          </div>
        ))}
        <button className="border px-2" onClick={addModel}>
          Add Model
        </button>
      </div>

      <button className="border px-4 py-1" onClick={save}>
        Save
      </button>
    </main>
  )
}
