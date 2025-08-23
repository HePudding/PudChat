'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Trash2 } from 'lucide-react'
import type { UseChatReturn } from '../../hooks/useChat'
import AvatarMono from '../common/AvatarMono'
import SettingsDialog from '../settings/SettingsDialog'
import type { Settings } from '../../lib/storage'

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
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const conversations = chat.conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )
  const openDelete = (id: string) => setDeleteId(id)
  const confirmDelete = () => {
    if (deleteId) chat.deleteConversation(deleteId)
    setDeleteId(null)
  }
  let touchTimer: ReturnType<typeof setTimeout> | null = null
  return (
    <>
      <div className="flex h-full w-72 flex-col border-r bg-background">
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
                      openDelete(c.id)
                    }}
                    onTouchStart={() => {
                      touchTimer = setTimeout(() => openDelete(c.id), 600)
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
                    </div>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 translate-x-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        openDelete(c.id)
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
            <div className="p-4 text-sm text-muted-foreground">
              暂无角色数据
            </div>
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
      <Dialog.Root
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl focus:outline-none">
          <Dialog.Title className="text-lg font-medium">
            永久删除对话
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            删除后，所有聊天内容将消失，确认删除？
          </Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="rounded border px-4 py-2"
              onClick={() => setDeleteId(null)}
            >
              取消
            </button>
            <button
              type="button"
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={confirmDelete}
            >
              删除
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}
