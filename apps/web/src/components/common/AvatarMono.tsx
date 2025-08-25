interface AvatarMonoProps {
  name?: string
  emoji?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarMono({ 
  name, 
  emoji = '🤖', 
  size = 'md' 
}: AvatarMonoProps) {
  const initial = (name?.trim()?.[0] || '').toUpperCase()
  
  const sizeClasses = {
    sm: 'size-6 text-xs',
    md: 'size-8 text-sm',
    lg: 'size-10 text-base'
  }
  
  return (
    <div className={`${sizeClasses[size]} rounded-full grid place-items-center font-medium
      bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800
      text-slate-700 dark:text-slate-200`}>
      {initial || emoji}
    </div>
  )
}