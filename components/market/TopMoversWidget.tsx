'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { getTopMovers } from '@/lib/api/market'
import { formatLRD, formatChange } from '@/lib/utils/formatters'
import { slideUp, staggerContainer } from '@/lib/utils/animations'
import type { MarketPrice } from '@/lib/types'
import { Skeleton } from '@/components/shared/LoadingSkeleton'

export default function TopMoversWidget() {
  const [gainers, setGainers] = useState<MarketPrice[]>([])
  const [losers, setLosers] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTopMovers().then(({ gainers, losers }) => {
      setGainers(gainers)
      setLosers(losers)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-agri-border bg-white p-5 dark:border-border dark:bg-card">
        <Skeleton className="mb-4 h-5 w-32" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-10 w-full" />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      {...slideUp}
      className="rounded-2xl border border-agri-border bg-white p-5 dark:border-border dark:bg-card"
    >
      <section className="mb-5">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <h3 className="font-semibold text-emerald-600 dark:text-emerald-400">
            Top Gainers
          </h3>
        </div>
        <motion.ul {...staggerContainer} className="space-y-2">
          {gainers.map((item) => (
            <motion.li
              key={item.id}
              {...slideUp}
              className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-3 py-2.5 dark:bg-emerald-900/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-medium text-agri-text dark:text-foreground">
                  {item.cropName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatChange(item.change7d)}
                </span>
                <span className="text-xs text-agri-muted dark:text-muted-foreground">
                  {formatLRD(item.priceLD)}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" />
          <h3 className="font-semibold text-red-600 dark:text-red-400">
            Top Losers
          </h3>
        </div>
        <motion.ul {...staggerContainer} className="space-y-2">
          {losers.map((item) => (
            <motion.li
              key={item.id}
              {...slideUp}
              className="flex items-center justify-between rounded-xl bg-red-50/60 px-3 py-2.5 dark:bg-red-900/10"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.emoji}</span>
                <span className="text-sm font-medium text-agri-text dark:text-foreground">
                  {item.cropName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {formatChange(item.change7d)}
                </span>
                <span className="text-xs text-agri-muted dark:text-muted-foreground">
                  {formatLRD(item.priceLD)}
                </span>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </motion.div>
  )
}
