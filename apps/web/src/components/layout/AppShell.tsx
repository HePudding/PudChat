'use client'

import { useEffect, useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import ChatView from '../chat/ChatView'
import RightPanel from '../right/RightPanel'
import { useChat } from '../../hooks/useChat'
import { loadSettings, type Settings, defaultSettings } from '../../lib/storage'
import { Menu, PanelRight, X } from 'lucide-react'

export default function AppShell() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [selectedModel, setSelectedModel] = useState('')
  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    setSelectedModel(s.models[0]?.name || '')
  }, [])

  const chat = useChat(settings, selectedModel)

  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)

  return (
    <div className="flex h-screen">
      {/* desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar chat={chat} settings={settings} setSettings={setSettings} />
      </div>
      {/* mobile left drawer */}
      {leftOpen && (
        <div className="fixed inset-0 z-50 bg-background flex">
          <Sidebar chat={chat} settings={settings} setSettings={setSettings} />
          <button
            className="absolute right-4 top-4 rounded border p-1"
            onClick={() => setLeftOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* main chat */}
      <div className="flex flex-1 flex-col">
        {/* mobile top bar */}
        <div className="flex items-center justify-between border-b p-2 lg:hidden">
          <button onClick={() => setLeftOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-semibold">{chat.current?.title}</div>
          <button onClick={() => setRightOpen(true)}>
            <PanelRight className="h-5 w-5" />
          </button>
        </div>
        <ChatView
          chat={chat}
          settings={settings}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      </div>

      {/* desktop right panel */}
      <div className="hidden lg:flex">
        <RightPanel chat={chat} selectedModel={selectedModel} />
      </div>
      {/* mobile right drawer */}
      {rightOpen && (
        <div className="fixed inset-0 z-50 bg-background flex justify-end">
          <RightPanel chat={chat} selectedModel={selectedModel} />
          <button
            className="absolute left-4 top-4 rounded border p-1"
            onClick={() => setRightOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
