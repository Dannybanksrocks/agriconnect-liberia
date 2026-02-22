import type { ConsumerUser } from '@/lib/types/shop'

export const SEED_ACCOUNTS_PUBLIC = [
  { id: 'consumer-1', name: 'Mary Johnson', phone: '+231770123456', email: 'consumer@agrihub.lr', password: 'Consumer@2024', county: 'Montserrado', landmark: 'Near Total Gas Station, Sinkor', role: 'consumer' as const, joinedAt: '2024-04-01T08:00:00Z' },
  { id: 'consumer-2', name: 'Emmanuel Dolo', phone: '+231550987654', email: 'emmanuel.dolo@agrihub.lr', password: 'Consumer@2024', county: 'Margibi County', landmark: 'Near Kakata Market', role: 'consumer' as const, joinedAt: '2024-05-10T10:00:00Z' },
]

export function registerConsumer(data: { fullName: string; phone: string; email?: string; password: string; county: string; landmark: string }): { success: boolean; user?: ConsumerUser; error?: string } {
  const existing = JSON.parse(localStorage.getItem('agrihub_consumers') || '[]') as ConsumerUser[]
  const conflict = existing.find((u) => u.phone === data.phone || (data.email && u.email === data.email))
  if (conflict) return { success: false, error: 'An account with this phone or email already exists' }
  const user: ConsumerUser = { id: `consumer-${Date.now()}`, ...data, role: 'consumer', joinedAt: new Date().toISOString() }
  localStorage.setItem('agrihub_consumers', JSON.stringify([...existing, user]))
  return { success: true, user }
}

export function loginConsumer(identifier: string, password: string): { success: boolean; user?: ConsumerUser; error?: string } {
  const seeded = SEED_ACCOUNTS_PUBLIC.find((u) => (u.email === identifier || u.phone === identifier) && u.password === password)
  if (seeded) return { success: true, user: { id: seeded.id, fullName: seeded.name, phone: seeded.phone, email: seeded.email, password: seeded.password, county: seeded.county, landmark: seeded.landmark, role: 'consumer', joinedAt: seeded.joinedAt } }
  const existing = JSON.parse(localStorage.getItem('agrihub_consumers') || '[]') as ConsumerUser[]
  const found = existing.find((u) => (u.email === identifier || u.phone === identifier) && u.password === password)
  if (found) return { success: true, user: found }
  return { success: false, error: 'Invalid email/phone or password' }
}
