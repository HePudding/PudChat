'use client'

import { useEffect, useState } from 'react'
import type { ProviderConfig } from '@pudchat/core'

const STORAGE_KEY = 'pudchat:settings'

export default function SettingsPage() {
  const [config, setConfig] = useState<ProviderConfig>({
    protocol: 'openai',
    endpoint: '',
    apiKey: '',
    model: '',
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setConfig((prev) => ({ ...prev, ...parsed }))
      } catch {}
    }
  }, [])

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
          <label className="mr-2">Model</label>
          <input
            className="border p-1 w-full"
            value={config.model}
            onChange={(e) => setConfig({ ...config, model: e.target.value })}
          />
        </div>
      </div>
      <button className="border px-4 py-1" onClick={save}>
        保存
      </button>
    </main>
  )
}
