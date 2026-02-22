'use client'

import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  type LucideIcon,
} from 'lucide-react'
import type { WeatherForecast } from '@/lib/types'

const conditionIcons: Record<string, LucideIcon> = {
  sunny: Sun,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
}

interface ForecastStripProps {
  daily: WeatherForecast['daily']
}

export default function ForecastStrip({ daily }: ForecastStripProps) {
  return (
    <div className="rounded-2xl border border-agri-border bg-white p-4 shadow-sm dark:border-border dark:bg-card md:p-6">
      <h3 className="mb-4 text-lg font-semibold text-agri-text dark:text-foreground">
        7-Day Forecast
      </h3>

      <div className="flex snap-x gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:gap-3 md:overflow-visible md:pb-0">
        {daily.map((day, i) => {
          const Icon = conditionIcons[day.condition] ?? CloudSun
          const isToday = i === 0

          return (
            <div
              key={day.date}
              className={`flex min-w-[120px] shrink-0 snap-start flex-col items-center gap-2 rounded-xl border p-3 transition-colors md:min-w-0 ${
                isToday
                  ? 'border-primary bg-primary-50 dark:border-primary-light dark:bg-primary-900/20'
                  : 'border-agri-border bg-agri-hover dark:border-border dark:bg-card'
              }`}
            >
              <span className="text-sm font-bold text-agri-text dark:text-foreground">
                {isToday ? 'Today' : day.day}
              </span>
              <span className="text-xs text-agri-muted dark:text-muted-foreground">
                {day.date}
              </span>
              <Icon className="h-7 w-7 text-primary dark:text-primary-light" />
              <div className="flex items-center gap-1.5 text-sm">
                <span className="font-semibold text-agri-text dark:text-foreground">
                  {day.high}°
                </span>
                <span className="text-agri-muted dark:text-muted-foreground">
                  {day.low}°
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent dark:bg-accent-light/20 dark:text-accent-light">
                <Droplets className="h-3 w-3" />
                {day.rainChance}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
