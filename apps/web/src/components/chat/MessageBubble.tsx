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
            onOpenChange={(o) => {
              if (pending && o) message.thinkingOpened = true
            }}
          />
        )}
        <MarkdownRenderer content={message.content} />
        {typeof message.tokens === 'number' && (
          <div className="text-xs text-muted-foreground text-right">
            <span
              title={
                !isUser && message.tokensPerSecond && message.firstTokenLatency
                  ? `吞吐速度: ${message.tokensPerSecond.toFixed(2)} tokens/s\n首字延迟: ${message.firstTokenLatency} ms`
                  : undefined
              }
            >
              {isUser ? '输入' : '输出'} Tokens: {message.tokens}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
