import AvatarMono from '@/components/common/AvatarMono'

interface MessageBubbleProps {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user'
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <AvatarMono 
        name={isUser ? 'U' : undefined} 
        emoji={isUser ? '👤' : '🤖'} 
      />
      
      <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-4 py-3 rounded-2xl shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white dark:bg-blue-600' 
            : 'bg-muted text-foreground'
        }`}>
          <div className="whitespace-pre-wrap break-words">
            {content}
          </div>
        </div>
      </div>
    </div>
  )
}