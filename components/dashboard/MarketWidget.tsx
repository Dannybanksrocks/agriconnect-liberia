'use client'

import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { formatLRD, formatChange } from '@/lib/utils/formatters'

interface CropRow {
  name: string
  emoji: string
  price: number
  change: number
  sparkline: number[]
}

const crops: CropRow[] = [
  {
    name: 'Rice',
    emoji: '🌾',
    price: 320,
    change: 2.4,
    sparkline: [295, 300, 305, 310, 308, 315, 320],
  },
  {
    name: 'Cocoa',
    emoji: '🫘',
    price: 385,
    change: 5.1,
    sparkline: [350, 355, 360, 365, 370, 378, 385],
  },
  {
    name: 'Hot Pepper',
    emoji: '🌶️',
    price: 195,
    change: 1.8,
    sparkline: [185, 188, 186, 190, 188, 192, 195],
  },
  {
    name: 'Cassava',
    emoji: '🥔',
    price: 55,
    change: -0.9,
    sparkline: [58, 57, 56, 56, 55, 55, 55],
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    price: 200,
    change: 3.2,
    sparkline: [185, 188, 190, 192, 195, 198, 200],
  },
]

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const chartData = data.map((v, i) => ({ v, i }))

  return (
    <div className="h-6 w-[60px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? 'var(--color-success)' : 'var(--color-danger)'}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function MarketWidget() {
  return (
    <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-agri-text dark:text-foreground">
          Market Prices
        </h2>
        <Link
          href="/market"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-agri-border text-left text-xs font-medium uppercase tracking-wide text-agri-muted dark:border-border dark:text-muted-foreground">
              <th className="pb-2">Crop</th>
              <th className="pb-2 text-right">Price</th>
              <th className="hidden pb-2 text-right sm:table-cell">Trend</th>
              <th className="pb-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-agri-border dark:divide-border">
            {crops.map((crop) => (
              <tr key={crop.name} className="group">
                <td className="py-3">
                  <span className="flex items-center gap-2 font-medium text-agri-text dark:text-foreground">
                    <span className="text-base">{crop.emoji}</span>
                    {crop.name}
                  </span>
                </td>
                <td className="py-3 text-right font-medium text-agri-text dark:text-foreground">
                  {formatLRD(crop.price)}
                </td>
                <td className="hidden py-3 sm:table-cell">
                  <div className="flex justify-end">
                    <MiniSparkline data={crop.sparkline} positive={crop.change >= 0} />
                  </div>
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      crop.change >= 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {crop.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatChange(crop.change)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
