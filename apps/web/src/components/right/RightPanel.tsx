'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AvatarMono from '@/components/common/AvatarMono'

export default function RightPanel() {
  return (
    <div className="w-80 h-full bg-background border-l border-border/50 p-4 space-y-4">
      {/* 角色档案卡片 */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">角色档案</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <AvatarMono emoji="🤖" size="lg" />
            <div>
              <h3 className="font-medium">默认助手</h3>
              <p className="text-sm text-muted-foreground">通用AI助手</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">特长标签</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full">💬 对话交流</Badge>
              <Badge variant="secondary" className="rounded-full">📝 文本创作</Badge>
              <Badge variant="secondary" className="rounded-full">💻 编程助手</Badge>
              <Badge variant="secondary" className="rounded-full">🎯 任务规划</Badge>
              <Badge variant="secondary" className="rounded-full">🔍 信息整理</Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="text-sm font-medium">角色描述</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              我是一个友好、专业的AI助手，擅长多领域对话和问题解答。
              无论是日常聊天、学习辅导还是工作协助，我都会尽力提供有价值的帮助。
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* 会话概览卡片 */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">会话概览</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">当前模型</span>
              <span className="text-sm font-medium">GPT-4 Turbo</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">消息数量</span>
              <span className="text-sm font-medium">5 条</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">流式输出</span>
              <Badge variant="outline" className="text-xs rounded-full">
                ✅ 已启用
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">思考模式</span>
              <Badge variant="outline" className="text-xs rounded-full">
                ❌ 已关闭
              </Badge>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <p className="text-sm font-medium">会话统计</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="font-medium">3</div>
                <div className="text-muted-foreground">用户消息</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <div className="font-medium">2</div>
                <div className="text-muted-foreground">助手回复</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 快捷操作卡片 */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <button className="w-full text-left p-2 text-sm hover:bg-muted/60 rounded-lg transition-colors">
            📋 复制会话记录
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-muted/60 rounded-lg transition-colors">
            💾 导出为文件
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-muted/60 rounded-lg transition-colors">
            🔄 重置会话
          </button>
          <button className="w-full text-left p-2 text-sm hover:bg-muted/60 rounded-lg transition-colors">
            ⭐ 收藏会话
          </button>
        </CardContent>
      </Card>
    </div>
  )
}