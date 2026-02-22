'use client'

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { WeatherForecast } from '@/lib/types'

interface HourlyChartInnerProps {
  hourly: WeatherForecast['hourly']
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  const temp = payload.find((p) => p.dataKey === 'temp')
  const rain = payload.find((p) => p.dataKey === 'rainChance')

  return (
    <div className="rounded-lg border border-agri-border bg-white px-3 py-2 shadow-md dark:border-border dark:bg-card">
      <p className="text-xs font-semibold text-agri-text dark:text-foreground">
        {label}
      </p>
      {temp && (
        <p className="text-xs text-primary dark:text-primary-light">
          Temperature: {temp.value}°C
        </p>
      )}
      {rain && (
        <p className="text-xs text-accent dark:text-accent-light">
          Rain chance: {rain.value}%
        </p>
      )}
    </div>
  )
}

export default function HourlyChartInner({ hourly }: HourlyChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={hourly} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1565C0" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#1565C0" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2EAE2" opacity={0.5} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 11, fill: '#4A5E4A' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#4A5E4A' }}
          axisLine={false}
          tickLine={false}
          unit="°"
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="rainChance"
          stroke="#1565C0"
          fill="url(#rainGradient)"
          strokeWidth={1.5}
          name="Rain %"
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="#2E7D32"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#2E7D32' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
