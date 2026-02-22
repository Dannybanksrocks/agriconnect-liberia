'use client'

import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  Droplets,
  Wind,
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

interface CurrentConditionsCardProps {
  current: WeatherForecast['current']
}

export default function CurrentConditionsCard({
  current,
}: CurrentConditionsCardProps) {
  const ConditionIcon = conditionIcons[current.condition] ?? CloudSun

  return (
    <div className="rounded-2xl border border-agri-border bg-white p-6 shadow-sm dark:border-border dark:bg-card md:p-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-agri-text dark:text-foreground">
              {current.temp}°C
            </span>
          </div>
          <p className="mt-1 text-sm text-agri-muted dark:text-muted-foreground">
            Feels like {current.feelsLike}°C
          </p>
          <p className="mt-2 text-base font-medium capitalize text-agri-text dark:text-foreground">
            {current.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ConditionIcon className="h-20 w-20 text-primary dark:text-primary-light" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-agri-border pt-6 dark:border-border sm:grid-cols-4">
        <Metric
          icon={Droplets}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <Metric
          icon={Wind}
          label="Wind"
          value={`${current.windSpeed} km/h ${current.windDirection}`}
        />
        <Metric icon={Sun} label="UV Index" value={String(current.uvIndex)} />
        <Metric
          icon={CloudRain}
          label="Rain Chance"
          value={`${current.rainChance}%`}
        />
      </div>

      <p className="mt-4 text-xs text-agri-muted dark:text-muted-foreground">
        Updated 5 minutes ago
      </p>
    </div>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
        <Icon className="h-4.5 w-4.5 text-primary dark:text-primary-light" />
      </div>
      <div>
        <p className="text-xs text-agri-muted dark:text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-agri-text dark:text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
