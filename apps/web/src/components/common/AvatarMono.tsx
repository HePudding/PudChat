export default function AvatarMono({
  name,
  emoji = '🤖',
}: {
  name?: string
  emoji?: string
}) {
  const initial = (name?.trim()?.[0] || '').toUpperCase()
  return (
    <div className="size-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 grid place-items-center text-sm">
      {initial || emoji}
    </div>
  )
}
