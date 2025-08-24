'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

export default function ProvidersManager() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="rounded-xl border border-white/20 bg-white/5 px-3 py-1 text-sm text-slate-200 transition-colors hover:bg-white/10"
        >
          模型管理
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-slate-200 backdrop-blur-xl focus:outline-none">
          <Dialog.Title className="text-lg font-semibold">
            模型管理
          </Dialog.Title>
          <p className="mt-2 text-sm text-slate-400">功能开发中，敬请期待。</p>
          <button
            type="button"
            className="absolute right-4 top-4 rounded p-1 border border-white/20 hover:bg-white/10"
            onClick={() => setOpen(false)}
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
