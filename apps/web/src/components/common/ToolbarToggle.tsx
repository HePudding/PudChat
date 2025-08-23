'use client'

interface ToolbarToggleProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export default function ToolbarToggle({
  label,
  checked,
  onCheckedChange,
}: ToolbarToggleProps) {
  return (
    <label className="flex items-center space-x-1 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  )
}
