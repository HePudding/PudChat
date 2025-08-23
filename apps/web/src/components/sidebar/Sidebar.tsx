'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { UseChatReturn } from '../../hooks/useChat'
import AvatarMono from '../common/AvatarMono'
import SettingsDialog from '../settings/SettingsDialog'
import type { Settings } from '../../lib/storage'

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString()
}

export default function Sidebar({
  chat,
  settings,
  setSettings,
}: {
  chat: UseChatReturn
  settings: Settings
  setSettings: (s: Settings) => void
}) {
  const [tab, setTab] = useState<'chat' | 'role'>('chat')
  const [query, setQuery] = useState('')
  const conversations = chat.conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )
  const handleDelete = (id: string) => {
    if (confirm('确定删除该会话吗？')) chat.deleteConversation(id)
  }
  let touchTimer: ReturnType<typeof setTimeout> | null = null
  return (
    <div className="flex h-full w-72 flex-col border-r">
      <div className="p-2 space-y-2">
        <input
          className="w-full rounded border px-2 py-1"
          placeholder="搜索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex space-x-2 text-sm">
          <button
            className={`flex-1 rounded px-2 py-1 ${tab === 'chat' ? 'bg-accent' : ''}`}
            onClick={() => setTab('chat')}
          >
            会话
          </button>
          <button
            className={`flex-1 rounded px-2 py-1 ${tab === 'role' ? 'bg-accent' : ''}`}
            onClick={() => setTab('role')}
          >
            角色
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'chat' && (
          <ul className="space-y-1 p-2">
            {conversations.map((c) => {
              const last = c.messages[c.messages.length - 1]
              return (
                <li
                  key={c.id}
                  className={`group relative cursor-pointer rounded-xl p-2 hover:bg-accent ${c.id === chat.currentId ? 'bg-accent' : ''}`}
                  onClick={() => chat.switchConversation(c.id)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    handleDelete(c.id)
                  }}
                  onTouchStart={() => {
                    touchTimer = setTimeout(() => handleDelete(c.id), 600)
                  }}
                  onTouchEnd={() => touchTimer && clearTimeout(touchTimer)}
                  onTouchMove={() => touchTimer && clearTimeout(touchTimer)}
                  onTouchCancel={() => touchTimer && clearTimeout(touchTimer)}
                >
                  <div className="flex items-center space-x-2">
                    <AvatarMono name={c.title} />
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium">{c.title}</div>
                      {last && (
                        <div className="truncate text-xs text-muted-foreground">
                          {last.content}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(c.updatedAt)}
                    </div>
                  </div>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 translate-x-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(c.id)
                    }}
                    aria-label="删除会话"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {tab === 'role' && (
          <div className="p-4 text-sm text-muted-foreground">暂无角色数据</div>
        )}
      </div>
      <div className="border-t p-2 space-y-2">
        <button
          className="w-full rounded border px-2 py-1"
          onClick={chat.newConversation}
        >
          新建会话
        </button>
        <button className="w-full rounded border px-2 py-1" disabled>
          导入角色
        </button>
        <SettingsDialog settings={settings} setSettings={setSettings} />
      </div>
    </div>
  )
}
