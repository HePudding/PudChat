import AvatarMono from '../common/AvatarMono'
import MarkdownRenderer from '../common/MarkdownRenderer'
import ThinkingPanel from './ThinkingPanel'
import type { Message } from '../../lib/storage'

export default function MessageBubble({
  message,
  showThinking,
  thinkingDefaultOpen,
  pending = false,
}: {
  message: Message
  showThinking: boolean
  thinkingDefaultOpen: boolean
  pending?: boolean
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
        {showThinking && (message.thinking || pending) && (
          <ThinkingPanel
            content={message.thinking}
            defaultOpen={thinkingDefaultOpen}
            streaming={pending}
            duration={message.thinkingDuration}
          />
        )}
        <MarkdownRenderer content={message.content} />
        {typeof message.tokens === 'number' && (
          <div className="text-xs text-muted-foreground text-right">
            Tokens: {message.tokens}
          </div>
        )}
      </div>
    </div>
  )
}
