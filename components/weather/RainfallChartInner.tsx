'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { WeatherForecast } from '@/lib/types'

interface RainfallChartInnerProps {
  data: WeatherForecast['rainfall30d']
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-agri-border bg-white px-3 py-2 shadow-md dark:border-border dark:bg-card">
      <p className="text-xs font-semibold text-agri-text dark:text-foreground">
        {label}
      </p>
      <p className="text-xs text-accent dark:text-accent-light">
        Rainfall: {payload[0].value} mm
      </p>
    </div>
  )
}

export default function RainfallChartInner({ data }: RainfallChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#E2EAE2"
          opacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#4A5E4A' }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#4A5E4A' }}
          axisLine={false}
          tickLine={false}
          unit="mm"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="mm" radius={[3, 3, 0, 0]} maxBarSize={18}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.mm > 0 ? '#1565C0' : '#D1D5DB'}
              fillOpacity={entry.mm > 0 ? 0.85 : 0.4}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
