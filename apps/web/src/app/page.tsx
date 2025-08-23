'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useChat } from '../hooks/useChat'
import { loadSettings, type Settings, defaultSettings } from '../lib/storage'

export default function Home() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [selectedModel, setSelectedModel] = useState('')
  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    setSelectedModel(s.models[0]?.name || '')
  }, [])

  const chat = useChat(settings, selectedModel)

  const configured =
    settings.apiKey && settings.endpoint && settings.models.length > 0

  return (
    <main className="flex h-screen">
      {/* sidebar */}
      <div className="w-72 border-r p-2 space-y-2 overflow-y-auto">
        <div className="flex space-x-2">
          <button className="border px-2" onClick={chat.newConversation}>
            新建
          </button>
          <Link href="/settings" className="border px-2 text-center flex-1">
            设置
          </Link>
        </div>
        <ul className="space-y-1">
          {chat.conversations.map((c) => (
            <li
              key={c.id}
              className={`p-2 border cursor-pointer rounded flex justify-between items-center ${c.id === chat.currentId ? 'bg-gray-200' : ''}`}
              onClick={() => chat.switchConversation(c.id)}
            >
              <span className="flex-1 truncate">{c.title}</span>
              <div className="space-x-1 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const title = prompt('重命名', c.title)
                    if (title) chat.renameConversation(c.id, title)
                  }}
                >
                  重命名
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    chat.deleteConversation(c.id)
                  }}
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b flex items-center space-x-2">
          {settings.models.length > 0 && (
            <select
              className="border p-1"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {settings.models.map((m, i) => (
                <option key={i} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={chat.showThinking}
              onChange={(e) => chat.setShowThinking(e.target.checked)}
            />
            <span>显示思考</span>
          </label>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chat.current?.messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
              <div className="whitespace-pre-wrap inline-block max-w-full">
                {m.content}
              </div>
              {chat.showThinking && m.thinking && (
                <details className="text-gray-500 text-sm">
                  <summary>思考</summary>
                  <div className="whitespace-pre-wrap">{m.thinking}</div>
                </details>
              )}
            </div>
          ))}
          {chat.pending && (
            <div className="text-left">
              <div className="whitespace-pre-wrap inline-block max-w-full">
                {chat.pending.content}
              </div>
              {chat.showThinking && chat.pending.thinking && (
                <details className="text-gray-500 text-sm" open>
                  <summary>思考</summary>
                  <div className="whitespace-pre-wrap">
                    {chat.pending.thinking}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
        {configured && (
          <div className="p-2 space-y-2 border-t">
            <textarea
              className="border w-full p-2 h-24"
              value={chat.input}
              onChange={(e) => chat.setInput(e.target.value)}
            />
            <div className="space-x-2">
              <button className="border px-3" onClick={chat.send}>
                发送
              </button>
              <button className="border px-3" onClick={chat.stop}>
                停止
              </button>
              <button className="border px-3" onClick={chat.regenerate}>
                重新生成
              </button>
            </div>
            {chat.error && (
              <div className="text-red-500">Error: {chat.error}</div>
            )}
          </div>
        )}
        {!configured && <div className="p-4">请先在设置中配置模型信息</div>}
      </div>
    </main>
  )
}
