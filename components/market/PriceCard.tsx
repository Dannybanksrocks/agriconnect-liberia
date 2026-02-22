'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import CropBadge from '@/components/shared/CropBadge'
import { formatLRD, formatUSD, formatChange } from '@/lib/utils/formatters'
import type { CropCategory } from '@/lib/types'
import { slideUp } from '@/lib/utils/animations'

interface PriceCardProps {
  emoji: string
  cropName: string
  category: CropCategory
  priceLD: number
  priceUSD: number
  change7d: number
  county: string
  unit: string
}

export default function PriceCard({
  emoji,
  cropName,
  category,
  priceLD,
  priceUSD,
  change7d,
  county,
  unit,
}: PriceCardProps) {
  const isPositive = change7d > 0
  const isNeutral = change7d === 0

  return (
    <motion.div
      {...slideUp}
      className="rounded-2xl border border-agri-border bg-white p-4 transition-shadow hover:shadow-md dark:border-border dark:bg-card"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h3 className="font-semibold text-agri-text dark:text-foreground">
              {cropName}
            </h3>
            <CropBadge category={category} />
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isNeutral
              ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              : isPositive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {formatChange(change7d)}
        </div>
      </div>

      <div className="mb-1">
        <span className="text-2xl font-bold text-agri-text dark:text-foreground">
          {formatLRD(priceLD)}
        </span>
        <span className="ml-1 text-sm text-agri-muted dark:text-muted-foreground">
          /{unit}
        </span>
      </div>
      <p className="text-xs text-agri-muted dark:text-muted-foreground">
        {formatUSD(priceUSD)} USD &middot; {county}
      </p>
    </motion.div>
  )
}
