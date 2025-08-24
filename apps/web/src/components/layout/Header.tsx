'use client'

import ProvidersManager from '../settings/ProvidersManager'
import ThemeToggle from '../common/ThemeToggle'
import { Menu, PanelRight } from 'lucide-react'
import type { Settings } from '../../lib/storage'

export default function Header({
  settings,
  selectedModel,
  setSelectedModel,
  onOpenLeft,
  onOpenRight,
}: {
  settings: Settings
  selectedModel: string
  setSelectedModel: (m: string) => void
  onOpenLeft?: () => void
  onOpenRight?: () => void
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-900/40 px-4 py-2 backdrop-blur">
      <div className="flex items-center space-x-2">
        {onOpenLeft && (
          <button
            className="lg:hidden"
            onClick={onOpenLeft}
            aria-label="展开侧栏"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="h-6 w-6 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600" />
        <h1 className="text-sm sm:text-base font-semibold text-slate-100">
          PudChat · 角色扮演
        </h1>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">
          预览
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {onOpenRight && (
          <button
            className="lg:hidden"
            onClick={onOpenRight}
            aria-label="展开设置"
          >
            <PanelRight className="h-5 w-5" />
          </button>
        )}
        <ProvidersManager />
        {settings.models.length > 0 ? (
          <select
            className="max-w-[12rem] truncate rounded-xl border border-white/20 bg-white/5 px-2 py-1 text-sm text-slate-100"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {settings.models.map((m, i) => (
              <option key={i} value={m.name} className="text-black">
                {m.name}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="max-w-[12rem] rounded-xl border border-white/20 bg-white/5 px-2 py-1 text-sm text-slate-400"
            disabled
          >
            <option>无模型</option>
          </select>
        )}
        <ThemeToggle />
        <button
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-sm text-slate-200 opacity-50 cursor-not-allowed"
          aria-label="账户"
          disabled
        >
          账户
        </button>
      </div>
    </header>
  )
}
