import { clsx, type ClassValue } from 'clsx'
import { endOfWeek, startOfWeek } from 'date-fns'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const middleOfWeek = (date: Date) => {
  const start = startOfWeek(date).getTime()
  const end = endOfWeek(date).getTime()
  const diff = Math.abs(end - start)
  const mid = diff / 2 + start

  return new Date(mid)
}
