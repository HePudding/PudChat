'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useChat } from '../../hooks/useChat'

interface SidebarProps {
  chat: ReturnType<typeof useChat>
}

export default function Sidebar({ chat }: SidebarProps) {
  const [query, setQuery] = useState('')
  const convs = chat.conversations.filter((c) => c.title.includes(query))
  return (
    <div className="w-72 border-r p-2 space-y-2 overflow-y-auto">
      <input
        className="w-full border px-2 py-1"
        placeholder="搜索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="space-y-1">
        {convs.map((c) => (
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
      <div className="flex space-x-2 pt-2">
        <button className="border px-2" onClick={chat.newConversation}>
          新建
        </button>
        <Link href="/settings" className="border px-2 text-center flex-1">
          设置
        </Link>
      </div>
    </div>
  )
}
