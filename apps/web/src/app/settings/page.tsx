'use client'

import { useEffect, useState } from 'react'
import type { ProviderConfig } from '@pudchat/core'

const STORAGE_KEY = 'pudchat:settings'

interface ModelConf {
  name: string
  thinking: boolean
}

interface Settings {
  protocol: ProviderConfig['protocol']
  endpoint: string
  apiKey: string
  models: ModelConf[]
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Settings>({
    protocol: 'openai',
    endpoint: '',
    apiKey: '',
    models: [{ name: '', thinking: false }],
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setConfig({
          protocol: parsed.protocol || 'openai',
          endpoint: parsed.endpoint || '',
          apiKey: parsed.apiKey || '',
          models:
            Array.isArray(parsed.models) && parsed.models.length
              ? parsed.models
              : [{ name: '', thinking: false }],
        })
      } catch {}
    }
  }, [])

  const updateModel = (idx: number, partial: Partial<ModelConf>) => {
    setConfig((prev) => {
      const models = [...prev.models]
      models[idx] = { ...models[idx], ...partial }
      return { ...prev, models }
    })
  }

  const addModel = () => {
    setConfig((prev) => ({
      ...prev,
      models: [...prev.models, { name: '', thinking: false }],
    }))
  }

  const removeModel = (idx: number) => {
    setConfig((prev) => {
      const models = prev.models.filter((_, i) => i !== idx)
      return {
        ...prev,
        models: models.length ? models : [{ name: '', thinking: false }],
      }
    })
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    alert('已保存')
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">设置</h1>
      <p className="text-sm text-red-600">
        密钥仅保存在本地，不会上传；使用者自担风险。
      </p>
      <div className="space-y-2">
        <div>
          <label className="mr-2">协议</label>
          <select
            className="border p-1"
            value={config.protocol}
            onChange={(e) =>
              setConfig({
                ...config,
                protocol: e.target.value as ProviderConfig['protocol'],
              })
            }
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Endpoint</label>
          <input
            className="border p-1 w-full"
            value={config.endpoint}
            onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
          />
        </div>
        <div>
          <label className="mr-2">API Key</label>
          <input
            type="password"
            className="border p-1 w-full"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          />
        </div>
        <div>
          <label className="mr-2">模型列表</label>
          <div className="space-y-2 mt-2">
            {config.models.map((m, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  className="border p-1 flex-1"
                  value={m.name}
                  onChange={(e) => updateModel(i, { name: e.target.value })}
                />
                <label className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={m.thinking}
                    onChange={(e) =>
                      updateModel(i, { thinking: e.target.checked })
                    }
                  />
                  <span>思考</span>
                </label>
                <button className="border px-2" onClick={() => removeModel(i)}>
                  删除
                </button>
              </div>
            ))}
            <button className="border px-2" onClick={addModel}>
              添加模型
            </button>
          </div>
        </div>
      </div>
      <button className="border px-4 py-1" onClick={save}>
        保存
      </button>
    </main>
  )
}
