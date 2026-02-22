'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Download } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import PricesTable from '@/components/market/PricesTable'
import PriceTrendChart from '@/components/market/PriceTrendChart'
import TopMoversWidget from '@/components/market/TopMoversWidget'
import LiberiaCountyMap from '@/components/market/LiberiaCountyMap'
import HotDeals from '@/components/market/HotDeals'
import { getMarketPrices } from '@/lib/api/market'
import { formatRelativeTime } from '@/lib/utils/formatters'
import type { MarketPrice } from '@/lib/types'

export default function MarketPage() {
  const [selectedPrice, setSelectedPrice] = useState<MarketPrice | null>(null)
  const [allPrices, setAllPrices] = useState<MarketPrice[]>([])
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    getMarketPrices({ limit: 300 }).then((res) => {
      setAllPrices(res.data)
      if (res.data.length > 0) {
        const latest = res.data.reduce((a, b) =>
          new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b
        )
        setLastUpdated(latest.updatedAt)
      }
    })
  }, [])

  const countyPrices = useMemo(() => {
    if (!selectedPrice) return {}
    const map: Record<string, number> = {}
    allPrices
      .filter((p) => p.cropId === selectedPrice.cropId)
      .forEach((p) => {
        map[p.county] = p.priceLD
      })
    return map
  }, [selectedPrice, allPrices])

  const handleExportAll = useCallback(() => {
    const headers = [
      'Crop',
      'Category',
      'County',
      'Market',
      'Price LRD',
      'Price USD',
      'Unit',
      '7d Change',
      'Updated',
    ].join(',')
    const rows = allPrices.map((p) =>
      [
        `"${p.cropName}"`,
        `"${p.category}"`,
        `"${p.county}"`,
        `"${p.market}"`,
        p.priceLD,
        p.priceUSD,
        `"${p.unit}"`,
        p.change7d,
        `"${p.updatedAt}"`,
      ].join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'agriconnect-market-prices.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [allPrices])

  return (
    <div className="space-y-6">
      <HotDeals />
      <PageHeader
        title="Market Prices"
        description={
          lastUpdated
            ? `Live commodity prices across Liberia \u00B7 Last updated ${formatRelativeTime(lastUpdated)}`
            : 'Live commodity prices across Liberia'
        }
        actions={
          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 rounded-xl border border-agri-border bg-white px-4 py-2.5 text-sm font-medium text-agri-text transition-colors hover:border-primary hover:text-primary dark:border-border dark:bg-card dark:text-foreground dark:hover:border-primary"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <PricesTable onRowSelect={setSelectedPrice} />

          {selectedPrice && (
            <PriceTrendChart
              data={selectedPrice.history30d}
              cropName={selectedPrice.cropName}
              unit={selectedPrice.unit}
            />
          )}
        </div>

        <div className="space-y-6">
          <TopMoversWidget />
          <LiberiaCountyMap
            prices={countyPrices}
            selectedCrop={selectedPrice?.cropName ?? ''}
          />
        </div>
      </div>
    </div>
  )
}
