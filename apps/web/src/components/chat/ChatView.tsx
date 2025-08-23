'use client'

import MessageBubble from './MessageBubble'
import ToolbarToggle from '../common/ToolbarToggle'
import { type Settings } from '../../lib/storage'
import { useChat } from '../../hooks/useChat'

interface ChatViewProps {
  chat: ReturnType<typeof useChat>
  settings: Settings
  selectedModel: string
  setSelectedModel: (m: string) => void
  configured: boolean
}

export default function ChatView({
  chat,
  settings,
  selectedModel,
  setSelectedModel,
  configured,
}: ChatViewProps) {
  return (
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
        <ToolbarToggle
          label="显示思考"
          checked={chat.showThinking}
          onCheckedChange={(v) => chat.setShowThinking(v)}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.current?.messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            showThinking={chat.showThinking}
          />
        ))}
        {chat.pending && (
          <MessageBubble
            message={chat.pending}
            showThinking={chat.showThinking}
          />
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
  )
}
