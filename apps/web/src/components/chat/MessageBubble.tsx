'use client'

import { type Message } from '../../lib/storage'
import Avatar from '../common/Avatar'
import MarkdownRenderer from './MarkdownRenderer'

interface MessageBubbleProps {
  message: Message
  showThinking: boolean
}

export default function MessageBubble({
  message,
  showThinking,
}: MessageBubbleProps) {
  const align = message.role === 'user' ? 'justify-end' : 'justify-start'
  return (
    <div className={`flex ${align} gap-2`}>
      {message.role === 'assistant' && <Avatar alt={message.role} size={32} />}
      <div className="max-w-[80%] border rounded-lg p-2">
        <MarkdownRenderer content={message.content} />
        {showThinking && message.thinking && (
          <details className="text-muted-foreground text-sm mt-1">
            <summary>思考</summary>
            <MarkdownRenderer content={message.thinking} />
          </details>
        )}
      </div>
      {message.role === 'user' && <Avatar alt={message.role} size={32} />}
    </div>
  )
}
