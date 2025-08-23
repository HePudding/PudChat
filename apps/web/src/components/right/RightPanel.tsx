'use client'

import { type Conversation } from '../../lib/storage'

interface RightPanelProps {
  conversation: Conversation | undefined
}

export default function RightPanel({ conversation }: RightPanelProps) {
  if (!conversation) {
    return (
      <aside className="w-80 border-l p-4 text-sm text-muted-foreground">
        暂无会话
      </aside>
    )
  }
  return (
    <aside className="w-80 border-l p-4 space-y-2 overflow-y-auto">
      <h2 className="text-lg">会话信息</h2>
      <div className="text-sm text-muted-foreground">
        消息数量: {conversation.messages.length}
      </div>
    </aside>
  )
}
