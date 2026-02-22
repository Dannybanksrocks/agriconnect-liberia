export const formatLRD = (amount: number): string =>
  `L$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatUSD = (amount: number): string =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatChange = (pct: number): string =>
  `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export const formatShortDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })

export function formatRelativeTime(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return formatDate(date)
}

export const formatWeight = (amount: number, unit = 'kg'): string =>
  `${amount} ${unit}`

export const LRD_TO_USD = 192

export const convertToUSD = (lrd: number): number =>
  Number((lrd / LRD_TO_USD).toFixed(2))

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatDateFull(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
