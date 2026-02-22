import { tips } from '@/lib/mock-data/tips'
import type { AgronomyTip, TipCategory } from '@/lib/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getTips(filters?: {
  category?: TipCategory
  search?: string
  featured?: boolean
  page?: number
  limit?: number
}): Promise<{ data: AgronomyTip[]; total: number }> {
  await delay(300)

  let filtered = [...tips]

  if (filters?.category) {
    filtered = filtered.filter((t) => t.category === filters.category)
  }
  if (filters?.featured !== undefined) {
    filtered = filtered.filter((t) => t.featured === filters.featured)
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  }

  const page = filters?.page ?? 1
  const limit = filters?.limit ?? 20
  const start = (page - 1) * limit

  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
  }
}

export async function getTipBySlug(
  slug: string
): Promise<AgronomyTip | null> {
  await delay(200)
  return tips.find((t) => t.slug === slug) ?? null
}

export async function getRelatedTips(
  currentSlug: string,
  category: TipCategory,
  limit = 3
): Promise<AgronomyTip[]> {
  await delay(200)
  return tips
    .filter((t) => t.slug !== currentSlug && t.category === category)
    .slice(0, limit)
}

export async function getFeaturedTip(): Promise<AgronomyTip | null> {
  await delay(200)
  return tips.find((t) => t.featured) ?? null
}
