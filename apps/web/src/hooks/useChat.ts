import { useEffect, useRef, useState } from 'react'
import { createChatModel } from '@pudchat/adapter-unified'
import type { ProviderConfig, ChatMessage } from '@pudchat/core'
import {
  type Conversation,
  type Message,
  type Settings,
  loadConversations,
  saveConversations,
} from '../lib/storage'
import { countTokens } from '../lib/utils'

function uid() {
  return Math.random().toString(36).slice(2)
}

export function useChat(settings: Settings, selectedModel: string) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentId, setCurrentId] = useState<string>('')
  const [showThinking, setShowThinking] = useState(
    settings.showThinkingByDefault,
  )
  const [pending, setPending] = useState<Message | null>(null)
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  const controller = useRef<AbortController | null>(null)

  // load conversations on mount
  useEffect(() => {
    const list = loadConversations()
    if (list.length > 0) {
      setConversations(list.sort((a, b) => b.updatedAt - a.updatedAt))
      setCurrentId(list[0].id)
    } else {
      const c = createConversation()
      setConversations([c])
      setCurrentId(c.id)
    }
  }, [])

  // persist
  useEffect(() => {
    saveConversations(conversations)
  }, [conversations])

  function createConversation(): Conversation {
    const now = Date.now()
    return {
      id: uid(),
      title: '新对话',
      createdAt: now,
      updatedAt: now,
      messages: [],
    }
  }

  const current = conversations.find((c) => c.id === currentId)

  const setCurrentConversation = (conv: Conversation) => {
    setConversations((cs) =>
      cs
        .map((c) => (c.id === conv.id ? conv : c))
        .sort((a, b) => b.updatedAt - a.updatedAt),
    )
  }

  const send = async () => {
    if (!current) return
    const modelConf = settings.models.find((m) => m.name === selectedModel)
    if (!modelConf) {
      setError('Model not found')
      return
    }
    const user: Message = {
      id: uid(),
      role: 'user',
      content: input,
      createdAt: Date.now(),
      tokens: countTokens(input),
    }
    const conv = {
      ...current,
      messages: [...current.messages, user],
      updatedAt: Date.now(),
      title:
        current.messages.length === 0
          ? input.slice(0, 20) || '新对话'
          : current.title,
    }
    setInput('')
    setCurrentConversation(conv)

    await runModel(conv, modelConf.thinking)
  }

  const runModel = async (conv: Conversation, thinking: boolean) => {
    const config: ProviderConfig = {
      protocol: settings.protocol,
      endpoint: settings.endpoint,
      apiKey: settings.apiKey,
      model: selectedModel,
      thinking,
    }
    const model = createChatModel(config)
    const msgs: ChatMessage[] = []
    if (conv.systemPrompt) {
      msgs.push({ role: 'system', content: conv.systemPrompt })
    }
    const recent = conv.messages.slice(-settings.maxContextMessages)
    for (const m of recent) msgs.push({ role: m.role, content: m.content })
    const pendingMsg: Message = {
      id: uid(),
      role: 'assistant',
      content: '',
      thinking: '',
      createdAt: Date.now(),
      tokens: 0,
    }
    setPending(pendingMsg)
    setError('')
    controller.current = new AbortController()
    try {
      for await (const delta of model(msgs, {
        stream: true,
        signal: controller.current.signal,
      })) {
        if (delta.type === 'token') {
          pendingMsg.content += delta.value
          pendingMsg.tokens = countTokens(
            pendingMsg.content + (pendingMsg.thinking || ''),
          )
          setPending({ ...pendingMsg })
        } else if (delta.type === 'thinking') {
          pendingMsg.thinking = (pendingMsg.thinking || '') + delta.value
          pendingMsg.tokens = countTokens(
            pendingMsg.content + (pendingMsg.thinking || ''),
          )
          setPending({ ...pendingMsg })
        } else if (delta.type === 'event') {
          if (delta.event === 'error') setError(delta.value)
          if (delta.event === 'end') {
            pendingMsg.thinkingDuration = Date.now() - pendingMsg.createdAt
            setPending(null)
            const finished: Conversation = {
              ...conv,
              messages: [...conv.messages, pendingMsg],
              updatedAt: Date.now(),
            }
            setCurrentConversation(finished)
          }
        }
      }
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string }
      if (e?.name !== 'AbortError') setError(e?.message || String(err))
    }
  }

  const stop = () => {
    controller.current?.abort()
  }

  const regenerate = async () => {
    if (!current) return
    const msgs = current.messages
    if (msgs.length === 0) return
    const last = msgs[msgs.length - 1]
    if (last.role !== 'assistant') return
    const conv = {
      ...current,
      messages: msgs.slice(0, -1),
      updatedAt: Date.now(),
    }
    setCurrentConversation(conv)
    const modelConf = settings.models.find((m) => m.name === selectedModel)
    if (!modelConf) return
    await runModel(conv, modelConf.thinking)
  }

  const newConversation = () => {
    const c = createConversation()
    setConversations((cs) => [c, ...cs])
    setCurrentId(c.id)
  }

  const deleteConversation = (id: string) => {
    setConversations((cs) => cs.filter((c) => c.id !== id))
    if (currentId === id && conversations.length > 1) {
      const next = conversations.find((c) => c.id !== id)
      setCurrentId(next ? next.id : '')
    }
  }

  const renameConversation = (id: string, title: string) => {
    setConversations((cs) =>
      cs.map((c) => (c.id === id ? { ...c, title, updatedAt: Date.now() } : c)),
    )
  }

  const switchConversation = (id: string) => {
    setCurrentId(id)
  }

  return {
    conversations,
    current,
    currentId,
    showThinking,
    setShowThinking,
    input,
    setInput,
    send,
    stop,
    regenerate,
    error,
    pending,
    newConversation,
    deleteConversation,
    renameConversation,
    switchConversation,
  }
}

export type UseChatReturn = ReturnType<typeof useChat>
