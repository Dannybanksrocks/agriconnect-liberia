'use client'

import dynamic from 'next/dynamic'
import type { WeatherForecast } from '@/lib/types'

const Chart = dynamic(() => import('./HourlyChartInner'), { ssr: false })

interface HourlyChartProps {
  hourly: WeatherForecast['hourly']
}

export default function HourlyChart({ hourly }: HourlyChartProps) {
  return (
    <div className="rounded-2xl border border-agri-border bg-white p-4 shadow-sm dark:border-border dark:bg-card md:p-6">
      <h3 className="mb-4 text-lg font-semibold text-agri-text dark:text-foreground">
        24-Hour Forecast
      </h3>
      <Chart hourly={hourly} />
    </div>
  )
}
