export const snakeCaseToReadable = (str: string) => {
  return str
    .split('_')
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
    .join(' ')
}

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const lastHalf = parts.pop() as string
    if (!lastHalf) return null

    const valueWithRestOfCookies = lastHalf.split(';') as string[]
    if (!valueWithRestOfCookies?.length) return null

    const value = valueWithRestOfCookies.shift() as string
    if (!value) return null

    return decodeURIComponent(value)
  }
  return null
}
