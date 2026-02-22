import { marketPrices } from '@/lib/mock-data/crops'
import type { MarketPrice } from '@/lib/types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMarketPrices(filters?: {
  county?: string
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ data: MarketPrice[]; total: number; page: number }> {
  await delay(300)

  let filtered = [...marketPrices]
  const page = filters?.page ?? 1
  const limit = filters?.limit ?? 20

  if (filters?.county) {
    filtered = filtered.filter((p) => p.county === filters.county)
  }
  if (filters?.category) {
    filtered = filtered.filter((p) => p.category === filters.category)
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.cropName.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q) ||
        p.market.toLowerCase().includes(q)
    )
  }

  const total = filtered.length
  const start = (page - 1) * limit
  const paged = filtered.slice(start, start + limit)

  return { data: paged, total, page }
}

export async function getTopMovers(): Promise<{
  gainers: MarketPrice[]
  losers: MarketPrice[]
}> {
  await delay(200)

  const sorted = [...marketPrices].sort((a, b) => b.change7d - a.change7d)
  const seen = new Set<string>()

  const unique = sorted.filter((p) => {
    if (seen.has(p.cropId)) return false
    seen.add(p.cropId)
    return true
  })

  return {
    gainers: unique.slice(0, 3),
    losers: unique.slice(-3).reverse(),
  }
}

export async function getPricesByCrop(
  cropId: string
): Promise<MarketPrice[]> {
  await delay(200)
  return marketPrices.filter((p) => p.cropId === cropId)
}
