'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'
import { X, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  saveSettings,
  type Settings,
  type SettingsModel,
} from '../../lib/storage'
import { Switch } from '../ui/switch'
import { ScrollArea } from '../ui/scroll-area'

export default function SettingsDialog({
  settings,
  setSettings,
}: {
  settings: Settings
  setSettings: (s: Settings) => void
}) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState<Settings>(settings)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (open) {
      setLocal(settings)
      setShowApiKey(false)
    }
  }, [open, settings])

  const updateModel = (
    idx: number,
    field: keyof SettingsModel,
    value: string | boolean,
  ) => {
    setLocal((s) => ({
      ...s,
      models: s.models.map((m, i) =>
        i === idx ? { ...m, [field]: value } : m,
      ),
    }))
  }

  const addModel = () => {
    setLocal((s) => ({
      ...s,
      models: [...s.models, { name: '', thinking: false }],
    }))
  }

  const removeModel = (idx: number) => {
    setLocal((s) => ({
      ...s,
      models: s.models.filter((_, i) => i !== idx),
    }))
  }

  const onSave = () => {
    saveSettings(local)
    setSettings(local)
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="w-full rounded border px-2 py-1">
          设置
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-[90vw] max-w-sm bg-white dark:bg-zinc-900 p-4 shadow-xl border-l rounded-l-2xl focus:outline-none lg:left-1/2 lg:top-1/2 lg:right-auto lg:h-auto lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl lg:border lg:p-6">
          <button
            type="button"
            className="absolute right-4 top-4 rounded p-1 opacity-70 hover:opacity-100 focus:outline-none"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <Dialog.Title className="text-lg font-semibold">设置</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground">
            接口与模型配置（本地保存，不上传）
          </Dialog.Description>
          <ScrollArea className="mt-4 h-[calc(100vh-8rem)] pr-4 lg:h-[60vh]">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">协议</span>
                  <select
                    className="rounded border px-2 py-1"
                    value={local.protocol}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        protocol: e.target.value as Settings['protocol'],
                      })
                    }
                    autoFocus
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">Endpoint</span>
                  <input
                    className="rounded border px-2 py-1"
                    value={local.endpoint}
                    onChange={(e) =>
                      setLocal({ ...local, endpoint: e.target.value })
                    }
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">API Key</span>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      className="w-full rounded border px-2 py-1 pr-8"
                      value={local.apiKey}
                      onChange={(e) =>
                        setLocal({ ...local, apiKey: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-1 flex items-center"
                      onClick={() => setShowApiKey((v) => !v)}
                      aria-label={showApiKey ? '隐藏 API Key' : '显示 API Key'}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </label>
                <label className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    显示思考默认开启
                  </span>
                  <Switch
                    checked={local.showThinkingByDefault}
                    onCheckedChange={(v) =>
                      setLocal({ ...local, showThinkingByDefault: v })
                    }
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-muted-foreground">最大上下文条数</span>
                  <input
                    type="number"
                    className="rounded border px-2 py-1"
                    value={local.maxContextMessages}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        maxContextMessages: Number(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
              <div className="space-y-2">
                <h2 className="font-semibold">Models</h2>
                {local.models.map((model, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded border px-2 py-1"
                      placeholder="model name"
                      value={model.name}
                      onChange={(e) => updateModel(idx, 'name', e.target.value)}
                    />
                    <label className="flex items-center gap-1 text-sm">
                      <Switch
                        checked={model.thinking}
                        onCheckedChange={(v) => updateModel(idx, 'thinking', v)}
                      />
                      <span>thinking</span>
                    </label>
                    <button
                      type="button"
                      className="rounded border p-1"
                      onClick={() => removeModel(idx)}
                      aria-label="删除模型"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="flex items-center gap-1 rounded border px-2 py-1 text-sm"
                  onClick={addModel}
                >
                  <Plus className="h-4 w-4" /> 新增模型
                </button>
              </div>
            </div>
          </ScrollArea>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded border px-3 py-1 text-sm"
              >
                关闭
              </button>
            </Dialog.Close>
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              onClick={onSave}
            >
              保存
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
