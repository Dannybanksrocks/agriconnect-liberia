import type { Crop, CropCategory, MarketPrice } from '@/lib/types'

// ---------------------------------------------------------------------------
// Deterministic pseudo-random helpers (consistent between renders)
// ---------------------------------------------------------------------------

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/** Creates a 7-point trend array with ±5 % fluctuation around `base`. */
export function generateTrend(base: number): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const fluctuation = 1 + Math.sin((base + i) * 2.4) * 0.05
    return Math.round(base * fluctuation * 100) / 100
  })
}

/** Creates a 30-point history array for chart rendering. */
export function generateHistory(base: number): number[] {
  return Array.from({ length: 30 }, (_, i) => {
    const fluctuation = 1 + Math.sin((base + i) * 0.7) * 0.05
    return Math.round(base * fluctuation * 100) / 100
  })
}

// ---------------------------------------------------------------------------
// 35 Liberian Crops
// ---------------------------------------------------------------------------

export const crops: Crop[] = [
  // ── Grains ──────────────────────────────────────────────────────────────
  { id: 'rice', name: 'Rice', category: 'grain', unit: 'kg', emoji: '🌾', priceRange: { min: 280, max: 380 } },
  { id: 'corn', name: 'Corn', category: 'grain', unit: 'kg', emoji: '🌽', priceRange: { min: 120, max: 180 } },
  { id: 'sorghum', name: 'Sorghum', category: 'grain', unit: 'kg', emoji: '🌿', priceRange: { min: 95, max: 140 } },

  // ── Vegetables ──────────────────────────────────────────────────────────
  { id: 'okra', name: 'Okra', category: 'vegetable', unit: 'kg', emoji: '🥬', priceRange: { min: 60, max: 90 } },
  { id: 'hot-pepper', name: 'Hot Pepper', category: 'vegetable', unit: 'kg', emoji: '🌶️', priceRange: { min: 150, max: 220 } },
  { id: 'tomato', name: 'Tomato', category: 'vegetable', unit: 'kg', emoji: '🍅', priceRange: { min: 80, max: 130 } },
  { id: 'eggplant', name: 'Eggplant', category: 'vegetable', unit: 'kg', emoji: '🍆', priceRange: { min: 55, max: 85 } },
  { id: 'cabbage', name: 'Cabbage', category: 'vegetable', unit: 'kg', emoji: '🥬', priceRange: { min: 70, max: 110 } },
  { id: 'onion', name: 'Onion', category: 'vegetable', unit: 'kg', emoji: '🧅', priceRange: { min: 180, max: 250 } },
  { id: 'garden-egg', name: 'Garden Egg', category: 'vegetable', unit: 'kg', emoji: '🥚', priceRange: { min: 50, max: 75 } },
  { id: 'bitter-ball', name: 'Bitter Ball', category: 'vegetable', unit: 'kg', emoji: '🫒', priceRange: { min: 45, max: 70 } },
  { id: 'cucumber', name: 'Cucumber', category: 'vegetable', unit: 'kg', emoji: '🥒', priceRange: { min: 65, max: 100 } },

  // ── Fruits ──────────────────────────────────────────────────────────────
  { id: 'plantain', name: 'Plantain', category: 'fruit', unit: 'bunch', emoji: '🍌', priceRange: { min: 35, max: 55 } },
  { id: 'banana', name: 'Banana', category: 'fruit', unit: 'bunch', emoji: '🍌', priceRange: { min: 30, max: 50 } },
  { id: 'pineapple', name: 'Pineapple', category: 'fruit', unit: 'piece', emoji: '🍍', priceRange: { min: 80, max: 120 } },
  { id: 'mango', name: 'Mango', category: 'fruit', unit: 'piece', emoji: '🥭', priceRange: { min: 25, max: 45 } },
  { id: 'papaya', name: 'Papaya', category: 'fruit', unit: 'piece', emoji: '🍈', priceRange: { min: 60, max: 95 } },
  { id: 'watermelon', name: 'Watermelon', category: 'fruit', unit: 'piece', emoji: '🍉', priceRange: { min: 150, max: 220 } },
  { id: 'coconut', name: 'Coconut', category: 'fruit', unit: 'piece', emoji: '🥥', priceRange: { min: 25, max: 40 } },
  { id: 'avocado', name: 'Avocado', category: 'fruit', unit: 'piece', emoji: '🥑', priceRange: { min: 40, max: 65 } },

  // ── Legumes ─────────────────────────────────────────────────────────────
  { id: 'groundnut', name: 'Groundnut', category: 'legume', unit: 'kg', emoji: '🥜', priceRange: { min: 160, max: 240 } },
  { id: 'cowpea', name: 'Cowpea', category: 'legume', unit: 'kg', emoji: '🫘', priceRange: { min: 130, max: 195 } },
  { id: 'soybeans', name: 'Soybeans', category: 'legume', unit: 'kg', emoji: '🫛', priceRange: { min: 145, max: 210 } },
  { id: 'pigeon-pea', name: 'Pigeon Pea', category: 'legume', unit: 'kg', emoji: '🫛', priceRange: { min: 120, max: 175 } },

  // ── Cash Crops ──────────────────────────────────────────────────────────
  { id: 'rubber', name: 'Rubber', category: 'cash-crop', unit: 'kg', emoji: '🌳', priceRange: { min: 45, max: 65 } },
  { id: 'cocoa', name: 'Cocoa', category: 'cash-crop', unit: 'kg', emoji: '🍫', priceRange: { min: 320, max: 420 } },
  { id: 'coffee', name: 'Coffee', category: 'cash-crop', unit: 'kg', emoji: '☕', priceRange: { min: 280, max: 360 } },
  { id: 'palm-oil', name: 'Palm Oil', category: 'cash-crop', unit: 'liter', emoji: '🫒', priceRange: { min: 180, max: 260 } },
  { id: 'palm-kernel', name: 'Palm Kernel', category: 'cash-crop', unit: 'kg', emoji: '🌴', priceRange: { min: 95, max: 140 } },
  { id: 'sugar-cane', name: 'Sugar Cane', category: 'cash-crop', unit: 'stalk', emoji: '🎋', priceRange: { min: 20, max: 35 } },

  // ── Root Crops ──────────────────────────────────────────────────────────
  { id: 'cassava', name: 'Cassava', category: 'root', unit: 'kg', emoji: '🥔', priceRange: { min: 40, max: 70 } },
  { id: 'sweet-potato', name: 'Sweet Potato', category: 'root', unit: 'kg', emoji: '🍠', priceRange: { min: 65, max: 100 } },
  { id: 'yam', name: 'Yam', category: 'root', unit: 'kg', emoji: '🍠', priceRange: { min: 110, max: 165 } },
  { id: 'cocoyam', name: 'Cocoyam', category: 'root', unit: 'kg', emoji: '🥔', priceRange: { min: 75, max: 115 } },
  { id: 'potato', name: 'Potato', category: 'root', unit: 'kg', emoji: '🥔', priceRange: { min: 130, max: 185 } },
]

// ---------------------------------------------------------------------------
// County pricing configuration
// Montserrado (Monrovia) is the commercial hub — highest prices.
// Interior / rural counties are 15-25 % cheaper.
// ---------------------------------------------------------------------------

interface CountyConfig {
  name: string
  capital: string
  modifier: number
}

const countyConfigs: CountyConfig[] = [
  { name: 'Montserrado', capital: 'Monrovia', modifier: 1.0 },
  { name: 'Margibi', capital: 'Kakata', modifier: 0.88 },
  { name: 'Grand Bassa', capital: 'Buchanan', modifier: 0.85 },
  { name: 'Grand Cape Mount', capital: 'Robertsport', modifier: 0.82 },
  { name: 'Bong', capital: 'Gbarnga', modifier: 0.80 },
  { name: 'Nimba', capital: 'Sanniquellie', modifier: 0.78 },
  { name: 'Lofa', capital: 'Voinjama', modifier: 0.76 },
]

const EXCHANGE_RATE = 192

// ---------------------------------------------------------------------------
// Market Prices — one entry per crop × county (35 × 7 = 245 records)
// ---------------------------------------------------------------------------

export const marketPrices: MarketPrice[] = crops.flatMap((crop) =>
  countyConfigs.map((county): MarketPrice => {
    const seedKey = `${crop.id}-${county.name}`
    const seed = hashCode(seedKey)
    const rand = seededRandom(seed)

    const range = crop.priceRange.max - crop.priceRange.min
    const baseAtMax = crop.priceRange.max - rand * range * 0.1
    const priceLD = Math.round(baseAtMax * county.modifier * 100) / 100

    const change7d = Math.round((seededRandom(seed + 7) * 14 - 6) * 10) / 10

    const countyId = county.name.toLowerCase().replace(/\s+/g, '-')
    const hour = Math.floor(seededRandom(seed + 3) * 12 + 6)
    const minute = Math.floor(seededRandom(seed + 4) * 60)
    const second = Math.floor(seededRandom(seed + 5) * 60)
    const updatedAt = `2024-11-15T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}.000Z`

    return {
      id: `${crop.id}-${countyId}`,
      cropId: crop.id,
      cropName: crop.name,
      category: crop.category,
      emoji: crop.emoji,
      county: county.name,
      market: `${county.capital} Market`,
      priceLD,
      priceUSD: Math.round((priceLD / EXCHANGE_RATE) * 100) / 100,
      unit: crop.unit,
      change7d,
      trend: generateTrend(priceLD),
      history30d: generateHistory(priceLD),
      updatedAt,
    }
  }),
)
