import type { Metadata } from 'next'
import './globals.css'
import AmbientBackground from '../components/layout/AmbientBackground'

export const metadata: Metadata = {
  title: 'PudChat',
  description: 'PudChat AI companion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-cn" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100">
        <AmbientBackground />
        {children}
      </body>
    </html>
  )
}
