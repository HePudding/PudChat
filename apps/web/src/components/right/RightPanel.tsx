'use client'

import AvatarMono from '../common/AvatarMono'
import type { UseChatReturn } from '../../hooks/useChat'

export default function RightPanel({
  chat,
  selectedModel,
}: {
  chat: UseChatReturn
  selectedModel: string
}) {
  const roleName = chat.current?.title || '角色'
  return (
    <div className="flex h-full w-80 flex-col border-l p-4 space-y-4">
      <div className="rounded-2xl border p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <AvatarMono name={roleName} />
          <div className="text-lg font-semibold">{roleName}</div>
        </div>
        <div className="text-sm text-muted-foreground">暂无角色描述</div>
      </div>
      <div className="rounded-2xl border p-4 space-y-2 text-sm">
        <div>当前模型：{selectedModel}</div>
        <div>显示思考：{chat.showThinking ? '是' : '否'}</div>
      </div>
    </div>
  )
}
