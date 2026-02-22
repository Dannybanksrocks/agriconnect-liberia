'use client'

import dynamic from 'next/dynamic'
import type { WeatherForecast } from '@/lib/types'

const Chart = dynamic(() => import('./RainfallChartInner'), { ssr: false })

interface RainfallChartProps {
  data: WeatherForecast['rainfall30d']
}

export default function RainfallChart({ data }: RainfallChartProps) {
  return (
    <div className="rounded-2xl border border-agri-border bg-white p-4 shadow-sm dark:border-border dark:bg-card md:p-6">
      <h3 className="mb-4 text-lg font-semibold text-agri-text dark:text-foreground">
        30-Day Rainfall History
      </h3>
      <Chart data={data} />
    </div>
  )
}
