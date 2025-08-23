'use client'

import { useEffect, useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import ChatView from '../chat/ChatView'
import RightPanel from '../right/RightPanel'
import { useChat } from '../../hooks/useChat'
import { loadSettings, type Settings, defaultSettings } from '../../lib/storage'

export default function AppShell() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [selectedModel, setSelectedModel] = useState('')
  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    setSelectedModel(s.models[0]?.name || '')
  }, [])

  const chat = useChat(settings, selectedModel)

  const configured = Boolean(
    settings.apiKey && settings.endpoint && settings.models.length > 0,
  )

  return (
    <main className="flex h-screen">
      <Sidebar chat={chat} />
      <ChatView
        chat={chat}
        settings={settings}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        configured={configured}
      />
      <RightPanel conversation={chat.current} />
    </main>
  )
}
