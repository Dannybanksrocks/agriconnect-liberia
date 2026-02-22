'use client'

import Link from 'next/link'
import { Sparkles, TrendingUp, AlertTriangle, Sprout, ArrowRight, Brain } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { cropRecommendations, priceForecasts, currentSeasonalInsight } from '@/lib/mock-data/ai-advisor'

function getCurrentSeason(): 'Dry Season' | 'Rainy Season' {
  const month = new Date().getMonth() + 1
  return month >= 5 && month <= 10 ? 'Rainy Season' : 'Dry Season'
}

export default function AIAdvisorWidget() {
  const user = useAppStore((s) => s.user)
  const county = user?.county ?? 'Montserrado'
  const season = getCurrentSeason()

  const topRec = cropRecommendations[0]
  const topForecast = priceForecasts[0]
  const riskAlert = currentSeasonalInsight?.warnings?.[0]

  const insights = [
    {
      icon: Sprout,
      color: 'bg-green-100 text-green-700',
      label: 'Planting Recommendation',
      value: topRec ? `Plant ${topRec.cropName} now` : 'Calculating...',
      sub: topRec ? `${topRec.seasonalFit === 'perfect' ? 'Perfect' : 'Good'} seasonal fit · ${topRec.estimatedPriceRange.low}–${topRec.estimatedPriceRange.high} LRD/kg` : '',
    },
    {
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-700',
      label: 'Price Opportunity',
      value: topForecast ? `${topForecast.cropName} prices rising` : 'Stable market',
      sub: topForecast ? `+${topForecast.changePercent}% forecast · ${topForecast.confidence} confidence` : '',
    },
    {
      icon: AlertTriangle,
      color: 'bg-amber-100 text-amber-700',
      label: 'Risk Alert',
      value: riskAlert ? riskAlert.slice(0, 50) + (riskAlert.length > 50 ? '…' : '') : 'No active alerts',
      sub: `${season} · ${county} County`,
    },
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Your AI Farm Advisor</h3>
            <p className="text-xs text-purple-600 dark:text-purple-400">{season} · {county} County</p>
          </div>
        </div>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3 h-3" /> AI
        </span>
      </div>

      {/* Personalized greeting */}
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        Based on your farm in <span className="font-semibold text-gray-800 dark:text-gray-200">{county} County</span>, here are today&apos;s recommendations:
      </p>

      {/* 3 insight cards */}
      <div className="space-y-2.5">
        {insights.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-800/60 border border-white dark:border-gray-700 shadow-sm"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 truncate">{item.value}</p>
                {item.sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.sub}</p>}
              </div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <Link
        href="/ai-advisor"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
      >
        View Full AI Report <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
