'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '@pudchat/core'
import { createChatModel } from '@pudchat/adapter-unified'

const STORAGE_KEY = 'pudchat:settings'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [pending, setPending] = useState('')
  const pendingRef = useRef('')
  const [controller, setController] = useState<AbortController | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState(true)
  const [thinking, setThinking] = useState('')

  useEffect(() => {
    pendingRef.current = pending
  }, [pending])

  const send = async () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setError('请先在设置页配置接口')
      return
    }
    let config
    try {
      config = JSON.parse(raw)
    } catch {
      setError('配置解析失败')
      return
    }
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: Date.now(),
    }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setPending('')
    setError(null)

    const abort = new AbortController()
    setController(abort)
    const model = createChatModel(config)

    try {
      for await (const delta of model.stream([...messages, userMsg], {
        abortSignal: abort.signal,
        stream,
      })) {
        if (delta.type === 'token') {
          setPending((p) => p + delta.value)
        } else if (delta.type === 'thinking') {
          setThinking((t) => t + delta.value)
        } else if (delta.type === 'event' && delta.event === 'error') {
          setError(delta.value || '请求出错')
        }
      }
      if (pendingRef.current) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: pendingRef.current,
          createdAt: Date.now(),
        }
        setMessages((m) => [...m, assistantMsg])
        setPending('')
        setThinking('')
      }
    } catch {
      setError('网络错误')
    } finally {
      setController(null)
    }
  }

  const stop = () => {
    controller?.abort()
  }

  return (
    <main className="p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
            <span className="font-bold">
              {m.role === 'user' ? '你' : '助手'}:{' '}
            </span>
            {m.content}
          </div>
        ))}
        {thinking && (
          <div className="text-left text-gray-500">
            <span className="font-bold">思考: </span>
            {thinking}
          </div>
        )}
        {pending && (
          <div className="text-left">
            <span className="font-bold">助手: </span>
            {pending}
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex space-x-2">
        <input
          className="border flex-1 p-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="border px-2" onClick={send}>
          发送
        </button>
        <button className="border px-2" onClick={stop}>
          停止
        </button>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={stream}
            onChange={(e) => setStream(e.target.checked)}
          />
          <span>流式</span>
        </label>
      </div>
    </main>
  )
}
