'use client'

import Link from 'next/link'
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Droplets } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

type ConditionKey = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy'

const conditionIcons: Record<ConditionKey, typeof Sun> = {
  sunny:           Sun,
  'partly-cloudy': CloudSun,
  cloudy:          Cloud,
  rainy:           CloudRain,
  stormy:          CloudLightning,
}

const conditionColors: Record<ConditionKey, string> = {
  sunny:           'text-secondary',
  'partly-cloudy': 'text-secondary',
  cloudy:          'text-muted-foreground',
  rainy:           'text-accent',
  stormy:          'text-destructive',
}

interface DayForecast {
  day: string
  condition: ConditionKey
  high: number
  low: number
  rain: number
}

const forecast: DayForecast[] = [
  { day: 'Mon', condition: 'partly-cloudy', high: 30, low: 23, rain: 20 },
  { day: 'Tue', condition: 'rainy',         high: 28, low: 22, rain: 70 },
  { day: 'Wed', condition: 'rainy',         high: 27, low: 22, rain: 80 },
  { day: 'Thu', condition: 'cloudy',        high: 28, low: 23, rain: 40 },
  { day: 'Fri', condition: 'partly-cloudy', high: 30, low: 23, rain: 25 },
  { day: 'Sat', condition: 'sunny',         high: 31, low: 24, rain: 10 },
  { day: 'Sun', condition: 'partly-cloudy', high: 30, low: 23, rain: 30 },
]

export default function WeatherWidget() {
  const selectedCounty = useAppStore((s) => s.selectedCounty)
  const currentCondition: ConditionKey = 'partly-cloudy'
  const CurrentIcon = conditionIcons[currentCondition]

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="card-heading">Weather — {selectedCounty}</h2>
        <Link href="/weather" className="body-text font-medium text-primary hover:underline">
          Full forecast →
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <CurrentIcon className={`h-14 w-14 ${conditionColors[currentCondition]}`} />
        <div>
          <p className="stat-value">29°C</p>
          <p className="body-text mt-0.5">Partly Cloudy</p>
        </div>
        <div className="ml-auto flex items-center gap-1 body-text text-accent">
          <Droplets className="h-4 w-4" />
          <span>20%</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {forecast.map((day) => {
          const DayIcon = conditionIcons[day.condition]
          return (
            <div
              key={day.day}
              className="flex min-w-[4.5rem] flex-col items-center gap-1.5 rounded-xl border border-border bg-muted px-3 py-2.5"
            >
              <span className="caption-text font-medium">{day.day}</span>
              <DayIcon className={`h-5 w-5 ${conditionColors[day.condition]}`} />
              <div className="flex gap-1">
                <span className="caption-text font-semibold text-foreground">{day.high}°</span>
                <span className="caption-text text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
