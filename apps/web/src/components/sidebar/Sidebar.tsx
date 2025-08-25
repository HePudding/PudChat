'use client'

import { useState } from 'react'
import { Search, Plus, Upload, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import AvatarMono from '@/components/common/AvatarMono'

// 示例数据
const demoConversations = [
  { id: 'c1', title: '默认话题', snippet: '你好呀～', time: '16:27' },
  { id: 'c2', title: '你好友助理', snippet: '欢迎使用 PudChat', time: '昨天' },
  { id: 'c3', title: 'AI 编程助手', snippet: '帮我写个函数', time: '昨天' },
  { id: 'c4', title: '学习计划', snippet: '制定学习路线', time: '2天前' },
  { id: 'c5', title: '旅行规划', snippet: '推荐景点', time: '3天前' },
  { id: 'c6', title: '健身指导', snippet: '运动建议', time: '1周前' },
  { id: 'c7', title: '美食推荐', snippet: '今天吃什么', time: '1周前' },
  { id: 'c8', title: '技术讨论', snippet: 'React vs Vue', time: '2周前' },
  { id: 'c9', title: '读书笔记', snippet: '好书分享', time: '2周前' },
  { id: 'c10', title: '工作效率', snippet: '时间管理', time: '1个月前' }
]

const demoRoles = [
  { id: 'r1', name: '默认助手', description: '通用AI助手', avatar: '🤖' },
  { id: 'r2', name: '编程专家', description: '代码编写与调试', avatar: '💻' },
  { id: 'r3', name: '写作助手', description: '文案创作与润色', avatar: '✍️' },
  { id: 'r4', name: '学习导师', description: '知识答疑与指导', avatar: '📚' },
  { id: 'r5', name: '创意伙伴', description: '头脑风暴与创意', avatar: '💡' },
  { id: 'r6', name: '生活顾问', description: '日常生活建议', avatar: '🏠' },
  { id: 'r7', name: '健康专家', description: '健康与养生', avatar: '🏥' },
  { id: 'r8', name: '旅行向导', description: '旅游规划建议', avatar: '🗺️' },
  { id: 'r9', name: '美食家', description: '烹饪与美食', avatar: '👨‍🍳' },
  { id: 'r10', name: '心理咨询师', description: '情感支持与建议', avatar: '💭' }
]

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('conversations')
  const [settingsOpen, setSettingsOpen] = useState(false)

  const filteredConversations = demoConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRoles = demoRoles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-72 h-full bg-background border-r border-border/50 flex flex-col">
      {/* 搜索区域 */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索会话或角色..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Tabs 区域 */}
      <div className="px-4 pt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl">
            <TabsTrigger value="conversations" className="rounded-lg">会话</TabsTrigger>
            <TabsTrigger value="roles" className="rounded-lg">角色</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 cursor-pointer transition-colors"
                  >
                    <AvatarMono name={conv.title} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{conv.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{conv.snippet}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{conv.time}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="roles" className="mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-2">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/60 cursor-pointer transition-colors"
                  >
                    <AvatarMono emoji={role.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{role.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{role.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* 底部按钮区域 */}
      <div className="mt-auto p-4 border-t border-border/50">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 rounded-xl"
            onClick={() => console.log('新建会话')}
          >
            <Plus className="h-4 w-4" />
            新建会话
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 rounded-xl"
            onClick={() => console.log('导入角色')}
          >
            <Upload className="h-4 w-4" />
            导入角色
          </Button>
          
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 rounded-xl"
              >
                <Settings className="h-4 w-4" />
                设置
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Endpoint</label>
                  <Input placeholder="https://api.openai.com/v1" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input type="password" placeholder="sk-..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">模型列表</label>
                  <Input placeholder="gpt-4,gpt-3.5-turbo" />
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSettingsOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={() => {
                    console.log('保存设置（占位）')
                    setSettingsOpen(false)
                  }}>
                    保存
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}