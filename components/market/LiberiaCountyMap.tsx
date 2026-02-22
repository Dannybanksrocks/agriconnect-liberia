'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { formatLRD } from '@/lib/utils/formatters'
import { slideUp } from '@/lib/utils/animations'

interface LiberiaCountyMapProps {
  prices: Record<string, number>
  selectedCrop: string
}

interface CountyPosition {
  id: string
  name: string
  x: number
  y: number
}

const COUNTY_POSITIONS: CountyPosition[] = [
  { id: 'grand-cape-mount', name: 'Grand Cape Mount', x: 8, y: 22 },
  { id: 'bomi', name: 'Bomi', x: 22, y: 28 },
  { id: 'montserrado', name: 'Montserrado', x: 22, y: 42 },
  { id: 'gbarpolu', name: 'Gbarpolu', x: 28, y: 14 },
  { id: 'lofa', name: 'Lofa', x: 42, y: 6 },
  { id: 'bong', name: 'Bong', x: 48, y: 28 },
  { id: 'margibi', name: 'Margibi', x: 36, y: 46 },
  { id: 'grand-bassa', name: 'Grand Bassa', x: 48, y: 54 },
  { id: 'nimba', name: 'Nimba', x: 65, y: 16 },
  { id: 'river-cess', name: 'River Cess', x: 56, y: 62 },
  { id: 'sinoe', name: 'Sinoe', x: 64, y: 72 },
  { id: 'grand-gedeh', name: 'Grand Gedeh', x: 76, y: 40 },
  { id: 'river-gee', name: 'River Gee', x: 78, y: 62 },
  { id: 'grand-kru', name: 'Grand Kru', x: 72, y: 80 },
  { id: 'maryland', name: 'Maryland', x: 86, y: 74 },
]

function getPriceColor(price: number, min: number, max: number): string {
  if (max === min) return 'bg-amber-400 dark:bg-amber-500'
  const ratio = (price - min) / (max - min)
  if (ratio < 0.33) return 'bg-emerald-400 dark:bg-emerald-500'
  if (ratio < 0.66) return 'bg-amber-400 dark:bg-amber-500'
  return 'bg-red-400 dark:bg-red-500'
}

function getBorderColor(price: number, min: number, max: number): string {
  if (max === min) return 'ring-amber-500/30'
  const ratio = (price - min) / (max - min)
  if (ratio < 0.33) return 'ring-emerald-500/30'
  if (ratio < 0.66) return 'ring-amber-500/30'
  return 'ring-red-500/30'
}

export default function LiberiaCountyMap({
  prices,
  selectedCrop,
}: LiberiaCountyMapProps) {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)

  const priceValues = Object.values(prices).filter((v) => v > 0)
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0

  return (
    <motion.div
      {...slideUp}
      className="rounded-2xl border border-agri-border bg-white p-5 dark:border-border dark:bg-card"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-agri-text dark:text-foreground">
          Price Map — {selectedCrop || 'Select a crop'}
        </h3>
        <p className="text-xs text-agri-muted dark:text-muted-foreground">
          County price comparison
        </p>
      </div>

      <div className="relative aspect-[4/3] w-full">
        {COUNTY_POSITIONS.map((county) => {
          const price = prices[county.name] ?? 0
          const colorClass = price
            ? getPriceColor(price, minPrice, maxPrice)
            : 'bg-gray-300 dark:bg-gray-600'
          const ringClass = price
            ? getBorderColor(price, minPrice, maxPrice)
            : 'ring-gray-300/30'
          const isHovered = hoveredCounty === county.id

          return (
            <div
              key={county.id}
              className="absolute"
              style={{
                left: `${county.x}%`,
                top: `${county.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredCounty(county.id)}
              onMouseLeave={() => setHoveredCounty(null)}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ring-4 ${colorClass} ${ringClass} cursor-pointer text-[9px] font-bold text-white shadow-sm transition-transform ${
                  isHovered ? 'scale-125 shadow-lg' : ''
                }`}
              >
                {county.name.split(' ').map((w) => w[0]).join('')}
              </div>

              {isHovered && (
                <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-agri-border bg-white px-3 py-1.5 text-xs shadow-lg dark:border-border dark:bg-card">
                  <p className="font-semibold text-agri-text dark:text-foreground">
                    {county.name}
                  </p>
                  {price > 0 ? (
                    <p className="text-agri-muted dark:text-muted-foreground">
                      {formatLRD(price)}
                    </p>
                  ) : (
                    <p className="text-agri-muted dark:text-muted-foreground">
                      No data
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-agri-muted dark:text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-400 dark:bg-emerald-500" />
          Low
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400 dark:bg-amber-500" />
          Mid
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500" />
          High
        </div>
      </div>
    </motion.div>
  )
}
