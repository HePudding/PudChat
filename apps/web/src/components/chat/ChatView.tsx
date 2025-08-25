'use client'

import { useState } from 'react'
import { Send, Square, RotateCcw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import MessageBubble from './MessageBubble'

// 示例消息数据
const demoMessages = [
  { id: 'm1', role: 'assistant' as const, content: '你好，我是默认助手～欢迎使用 PudChat！有什么我可以帮助你的吗？' },
  { id: 'm2', role: 'user' as const, content: '你好！请介绍一下你的功能。' },
  { id: 'm3', role: 'assistant' as const, content: '我是一个AI助手，可以帮助你进行对话、回答问题、协助写作、编程指导等多种任务。\n\n主要功能包括：\n• 💬 智能对话交流\n• 📝 文本创作与编辑\n• 💻 编程问题解答\n• 🎯 任务规划建议\n• 🔍 信息查询整理\n\n你可以随时向我提问或寻求帮助！' },
  { id: 'm4', role: 'user' as const, content: '很棒！那我们开始聊天吧。' },
  { id: 'm5', role: 'assistant' as const, content: '太好了！我很期待与你的对话。请随时告诉我你想聊什么话题，或者有什么需要帮助的地方。😊' }
]

const modelOptions = [
  'GPT-4 Turbo',
  'GPT-4',
  'GPT-3.5 Turbo',
  'Claude-3 Sonnet',
  'Claude-3 Haiku'
]

export default function ChatView() {
  const [message, setMessage] = useState('')
  const [selectedModel, setSelectedModel] = useState('GPT-4 Turbo')
  const [streamMode, setStreamMode] = useState(true)
  const [thinkingMode, setThinkingMode] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      console.log('send placeholder:', message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background">
      {/* 顶部工具栏 */}
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">默认会话</h1>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-xl">
                  {selectedModel}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {modelOptions.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className="cursor-pointer"
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                checked={streamMode} 
                onCheckedChange={setStreamMode}
                id="stream-mode"
              />
              <label htmlFor="stream-mode" className="text-sm cursor-pointer">
                流式
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch 
                checked={thinkingMode} 
                onCheckedChange={setThinkingMode}
                id="thinking-mode"
              />
              <label htmlFor="thinking-mode" className="text-sm cursor-pointer">
                思考
              </label>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-xl"
              onClick={() => console.log('停止生成')}
            >
              <Square className="h-4 w-4" />
              停止
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 rounded-xl"
              onClick={() => console.log('重新生成')}
            >
              <RotateCcw className="h-4 w-4" />
              重试
            </Button>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <ScrollArea className="flex-1 px-4">
        <div className="py-4 space-y-4 max-w-4xl mx-auto">
          {demoMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              id={msg.id}
              role={msg.role}
              content={msg.content}
            />
          ))}
        </div>
      </ScrollArea>

      {/* 输入区域 */}
      <div className="border-t border-border/50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Textarea
                placeholder="输入消息... (Shift+Enter 换行，Enter 发送)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] max-h-[200px] resize-none rounded-2xl"
                rows={3}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="rounded-2xl px-6 py-3 h-auto"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}