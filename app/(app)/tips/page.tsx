'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import CategoryGrid from '@/components/tips/CategoryGrid'
import FeaturedTip from '@/components/tips/FeaturedTip'
import TipCard from '@/components/tips/TipCard'
import { getTips, getFeaturedTip } from '@/lib/api/tips'
import type { AgronomyTip, TipCategory } from '@/lib/types'

export default function TipsPage() {
  const [tips, setTips] = useState<AgronomyTip[]>([])
  const [featured, setFeatured] = useState<AgronomyTip | null>(null)
  const [activeCategory, setActiveCategory] = useState<TipCategory | null>(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const filters: { category?: TipCategory; search?: string } = {}
    if (activeCategory) filters.category = activeCategory
    if (search.trim()) filters.search = search.trim()

    Promise.all([
      getTips(filters),
      getFeaturedTip(),
    ]).then(([res, feat]) => {
      setTips(res.data)
      setFeatured(feat)
      setLoading(false)
    })
  }, [activeCategory, search])

  const featuredTip = useMemo(() => {
    if (!featured) return null
    if (activeCategory && featured.category !== activeCategory) return null
    if (search.trim() && !featured.title.toLowerCase().includes(search.toLowerCase())) return null
    return featured
  }, [featured, activeCategory, search])

  const gridTips = useMemo(
    () => tips.filter((t) => t.id !== featuredTip?.id),
    [tips, featuredTip]
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agronomy Tips"
        description="Expert farming guidance for Liberian crops — browse by category or search topics"
      />

      <CategoryGrid activeCategory={activeCategory} onSelect={setActiveCategory} />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tips by keyword, crop, or topic…"
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-[300px] animate-pulse rounded-2xl bg-agri-hover dark:bg-muted" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl bg-agri-hover dark:bg-muted"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {featuredTip && <FeaturedTip tip={featuredTip} />}

          {gridTips.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gridTips.map((tip, i) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <TipCard tip={tip} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-agri-border py-16 text-center dark:border-border">
              <p className="text-lg font-medium text-agri-text dark:text-foreground">
                No tips found
              </p>
              <p className="mt-1 text-sm text-agri-muted dark:text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
