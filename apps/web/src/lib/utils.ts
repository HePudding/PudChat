import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// rough token estimation, assumes ~4 characters per token
export function countTokens(text: string): number {
  return Math.ceil([...text].length / 4)
}
