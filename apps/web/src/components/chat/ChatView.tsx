'use client'

import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import { ToolbarToggle } from '../common/ToolbarToggle'
import { RefreshCcw, Square } from 'lucide-react'
import type { Settings } from '../../lib/storage'
import type { UseChatReturn } from '../../hooks/useChat'

export default function ChatView({
  chat,
  settings,
  selectedModel,
  setSelectedModel,
}: {
  chat: UseChatReturn
  settings: Settings
  selectedModel: string
  setSelectedModel: (m: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.current?.messages, chat.pending])

  const [streaming, setStreaming] = useState(true)

  return (
    <div className="flex h-full flex-col">
      {/* toolbar */}
      <div className="flex items-center justify-between border-b p-2 space-x-2">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold truncate max-w-[12rem]">
            {chat.current?.title}
          </h1>
          {settings.models.length > 0 && (
            <select
              className="border p-1 rounded"
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
        </div>
        <div className="flex items-center space-x-2">
          <ToolbarToggle
            label="流式"
            value={streaming}
            onChange={setStreaming}
          />
          <ToolbarToggle
            label="思考"
            value={chat.showThinking}
            onChange={chat.setShowThinking}
          />
          <button
            className="border rounded p-1"
            onClick={chat.stop}
            title="停止"
            type="button"
          >
            <Square className="h-4 w-4" />
          </button>
          <button
            className="border rounded p-1"
            onClick={chat.regenerate}
            title="重试"
            type="button"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chat.current?.messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            showThinking={chat.showThinking}
            thinkingDefaultOpen={settings.showThinkingByDefault}
          />
        ))}
        {chat.pending && (
          <div>
            <MessageBubble
              message={chat.pending}
              showThinking={chat.showThinking}
              thinkingDefaultOpen={true}
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="border-t p-2 space-y-2">
        <textarea
          className="w-full resize-none border p-2 rounded-2xl h-24"
          value={chat.input}
          onChange={(e) => chat.setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              chat.send()
            }
          }}
        />
        <div className="flex justify-end">
          <button className="border rounded px-4 py-1" onClick={chat.send}>
            发送
          </button>
        </div>
        {chat.error && <div className="text-red-500">Error: {chat.error}</div>}
      </div>
    </div>
  )
}
