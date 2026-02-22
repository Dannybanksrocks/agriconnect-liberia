'use client'

import Link from 'next/link'
import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, Droplets } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

type ConditionKey = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy'

const conditionIcons: Record<ConditionKey, typeof Sun> = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
}

const conditionColors: Record<ConditionKey, string> = {
  sunny: 'text-secondary',
  'partly-cloudy': 'text-secondary',
  cloudy: 'text-agri-muted dark:text-muted-foreground',
  rainy: 'text-accent',
  stormy: 'text-danger',
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
  { day: 'Tue', condition: 'rainy', high: 28, low: 22, rain: 70 },
  { day: 'Wed', condition: 'rainy', high: 27, low: 22, rain: 80 },
  { day: 'Thu', condition: 'cloudy', high: 28, low: 23, rain: 40 },
  { day: 'Fri', condition: 'partly-cloudy', high: 30, low: 23, rain: 25 },
  { day: 'Sat', condition: 'sunny', high: 31, low: 24, rain: 10 },
  { day: 'Sun', condition: 'partly-cloudy', high: 30, low: 23, rain: 30 },
]

export default function WeatherWidget() {
  const selectedCounty = useAppStore((s) => s.selectedCounty)

  const currentCondition: ConditionKey = 'partly-cloudy'
  const CurrentIcon = conditionIcons[currentCondition]

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-foreground">
          Weather — {selectedCounty}
        </h2>
        <Link
          href="/weather"
          className="text-sm font-medium text-primary hover:underline"
        >
          Full forecast →
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <CurrentIcon className={`h-14 w-14 ${conditionColors[currentCondition]}`} />
        <div>
          <p className="text-4xl font-bold text-gray-900 dark:text-foreground">
            29°C
          </p>
          <p className="text-sm text-gray-500 dark:text-muted-foreground">
            Partly Cloudy
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-sm text-accent">
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
              className="flex min-w-[4.5rem] flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 dark:border-border dark:bg-muted"
            >
              <span className="text-xs font-medium text-gray-500 dark:text-muted-foreground">
                {day.day}
              </span>
              <DayIcon className={`h-5 w-5 ${conditionColors[day.condition]}`} />
              <div className="flex gap-1 text-xs">
                <span className="font-semibold text-gray-900 dark:text-foreground">
                  {day.high}°
                </span>
                <span className="text-gray-400 dark:text-muted-foreground">
                  {day.low}°
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
