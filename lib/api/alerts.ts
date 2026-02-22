import { alerts } from '@/lib/mock-data/alerts'
import type { Alert } from '@/lib/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getAlerts(filters?: {
  type?: Alert['type']
  severity?: Alert['severity']
  read?: boolean
}): Promise<Alert[]> {
  await delay(300)

  let filtered = [...alerts]

  if (filters?.type) {
    filtered = filtered.filter((a) => a.type === filters.type)
  }
  if (filters?.severity) {
    filtered = filtered.filter((a) => a.severity === filters.severity)
  }
  if (filters?.read !== undefined) {
    filtered = filtered.filter((a) => a.read === filters.read)
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getUnreadCount(): Promise<number> {
  await delay(100)
  return alerts.filter((a) => !a.read).length
}

export async function markAlertRead(id: string): Promise<void> {
  await delay(200)
  const alert = alerts.find((a) => a.id === id)
  if (alert) alert.read = true
}

export async function markAllRead(): Promise<void> {
  await delay(200)
  alerts.forEach((a) => {
    a.read = true
  })
}
