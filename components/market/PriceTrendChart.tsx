'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { formatLRD, convertToUSD, formatUSD } from '@/lib/utils/formatters'

interface PriceTrendChartProps {
  data: number[]
  cropName: string
  unit: string
}

interface ChartPayload {
  day: string
  price: number
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: ChartPayload }>
}) {
  if (!active || !payload?.length) return null
  const { day, price } = payload[0].payload
  const usd = convertToUSD(price)

  return (
    <div className="rounded-lg border border-agri-border bg-white px-3 py-2 shadow-lg dark:border-border dark:bg-card">
      <p className="text-xs text-agri-muted dark:text-muted-foreground">
        {day}
      </p>
      <p className="font-semibold text-agri-text dark:text-foreground">
        {formatLRD(price)}
      </p>
      <p className="text-xs text-agri-muted dark:text-muted-foreground">
        {formatUSD(usd)}
      </p>
    </div>
  )
}

export default function PriceTrendChart({
  data,
  cropName,
  unit,
}: PriceTrendChartProps) {
  const chartData: ChartPayload[] = data.map((price, i) => ({
    day: `Day ${i + 1}`,
    price,
  }))

  return (
    <div className="rounded-2xl border border-agri-border bg-white p-5 dark:border-border dark:bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-agri-text dark:text-foreground">
          {cropName} — 30-Day Price Trend
        </h3>
        <p className="text-sm text-agri-muted dark:text-muted-foreground">
          LRD per {unit}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-agri-border dark:text-border"
            opacity={0.3}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11 }}
            stroke="currentColor"
            className="text-agri-muted dark:text-muted-foreground"
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11 }}
            stroke="currentColor"
            className="text-agri-muted dark:text-muted-foreground"
            tickLine={false}
            tickFormatter={(v: number) => `L$${v}`}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
