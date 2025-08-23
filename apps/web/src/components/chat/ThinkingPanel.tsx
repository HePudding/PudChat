import MarkdownRenderer from '../common/MarkdownRenderer'

export default function ThinkingPanel({
  content,
  defaultOpen,
}: {
  content?: string
  defaultOpen?: boolean
}) {
  if (!content) return null
  return (
    <details
      className="bg-muted rounded-2xl p-3 text-sm text-muted-foreground"
      open={defaultOpen}
    >
      <summary className="cursor-pointer">思考</summary>
      <MarkdownRenderer content={content} />
    </details>
  )
}
