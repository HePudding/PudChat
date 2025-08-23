import { useEffect, useRef, useState } from 'react'
import MarkdownRenderer from '../common/MarkdownRenderer'

export default function ThinkingPanel({
  content,
  defaultOpen,
  streaming,
  duration,
}: {
  content?: string
  defaultOpen?: boolean
  streaming?: boolean
  duration?: number
}) {
  const [open, setOpen] = useState(!!defaultOpen)
  const wasOpen = useRef(open)
  const startRef = useRef(Date.now())
  const [time, setTime] = useState<number | undefined>(duration)

  useEffect(() => {
    if (!streaming && time === undefined) {
      const end = Date.now() - startRef.current
      setTime(end)
      if (wasOpen.current) setOpen(false)
    }
  }, [streaming, time])

  useEffect(() => {
    wasOpen.current = open
  }, [open])

  if (!content && !streaming) return null

  const summary = streaming
    ? '思考中'
    : time !== undefined
      ? `思考完成${(time / 1000).toFixed(1)}秒`
      : '思考'

  return (
    <details
      className="border bg-muted rounded-2xl p-3 text-sm text-muted-foreground"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer">{summary}</summary>
      {content && <MarkdownRenderer content={content} />}
    </details>
  )
}
