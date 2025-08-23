import { Check, X } from 'lucide-react'

export function ToolbarToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      className="flex items-center space-x-1 border rounded px-2 py-1 text-sm"
      onClick={() => onChange(!value)}
      type="button"
    >
      {value ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{label}</span>
    </button>
  )
}
