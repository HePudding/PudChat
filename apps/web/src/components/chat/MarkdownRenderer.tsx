'use client'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <div className="whitespace-pre-wrap break-words">{content}</div>
}
