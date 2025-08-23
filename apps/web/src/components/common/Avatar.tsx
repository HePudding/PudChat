'use client'

interface AvatarProps {
  src?: string
  alt: string
  size?: number
}

export default function Avatar({ src, alt, size = 40 }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    )
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-300 flex items-center justify-center text-sm"
    >
      {alt.slice(0, 1).toUpperCase()}
    </div>
  )
}
