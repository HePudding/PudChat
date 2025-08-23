import AvatarMono from '../common/AvatarMono'
import MarkdownRenderer from '../common/MarkdownRenderer'
import ThinkingPanel from './ThinkingPanel'
import type { Message } from '../../lib/storage'

export default function MessageBubble({
  message,
  showThinking,
  thinkingDefaultOpen,
}: {
  message: Message
  showThinking: boolean
  thinkingDefaultOpen: boolean
}) {
  const isUser = message.role === 'user'
  return (
    <div
      className={`flex items-start space-x-2 ${
        isUser ? 'flex-row-reverse text-right' : ''
      }`}
    >
      <AvatarMono emoji={isUser ? '👤' : '🤖'} />
      <div className="flex-1 space-y-2">
        <MarkdownRenderer content={message.content} />
        {showThinking && (
          <ThinkingPanel
            content={message.thinking}
            defaultOpen={thinkingDefaultOpen}
          />
        )}
      </div>
    </div>
  )
}
