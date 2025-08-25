'use client'

import { useState } from 'react'
import { Menu, PanelRightOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from '@/components/sidebar/Sidebar'
import ChatView from '@/components/chat/ChatView'
import RightPanel from '@/components/right/RightPanel'

export default function AppShell() {
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* 桌面端布局 (≥1024px) */}
      <div className="hidden lg:flex h-full">
        {/* 左侧栏 */}
        <Sidebar />
        
        {/* 中间聊天区域 */}
        <div className="flex-1 flex flex-col">
          <ChatView />
        </div>
        
        {/* 右侧面板 */}
        <div className={`transition-all duration-300 ${rightPanelOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
          {rightPanelOpen && <RightPanel />}
        </div>
        
        {/* 右侧面板切换按钮 */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="rounded-xl shadow-sm"
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 移动端布局 (<1024px) */}
      <div className="lg:hidden h-full flex flex-col">
        {/* 移动端顶部导航栏 */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
          {/* 左侧菜单按钮 */}
          <Sheet open={leftPanelOpen} onOpenChange={setLeftPanelOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="font-semibold">PudChat</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setLeftPanelOpen(false)}
                  className="rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          {/* 中间标题 */}
          <h1 className="font-semibold text-lg">PudChat</h1>
          
          {/* 右侧信息按钮 */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl">
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-80">
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <h2 className="font-semibold">会话信息</h2>
              </div>
              <RightPanel />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* 移动端聊天区域 */}
        <div className="flex-1 flex flex-col">
          <ChatView />
        </div>
      </div>
    </div>
  )
}