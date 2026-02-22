'use client'

import { CloudSun, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

const cropWarnings = [
  {
    emoji: '🌾',
    crop: 'Rice',
    severity: 'warning' as const,
    message:
      'Moderate winds may slow drying of harvested rice paddies. Cover drying mats if gusts exceed 30 km/h.',
  },
  {
    emoji: '🥜',
    crop: 'Groundnut',
    severity: 'info' as const,
    message:
      'Conditions are ideal for groundnut harvest this week. Soil moisture levels are low enough for easy pulling.',
  },
]

export default function WeatherImpactPanel() {
  const selectedCounty = useAppStore((s) => s.selectedCounty)

  return (
    <div className="rounded-2xl border border-agri-border bg-white p-5 dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
          <CloudSun className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-semibold text-agri-text dark:text-foreground">
          Weather Impact on Your Crops
        </h3>
      </div>

      <div className="mb-4 rounded-xl bg-agri-bg p-3 dark:bg-muted">
        <p className="text-xs font-medium text-agri-muted dark:text-muted-foreground">
          {selectedCounty} County — 7-day outlook
        </p>
        <p className="mt-1 text-sm text-agri-text dark:text-foreground">
          Mostly sunny with light winds. Temperatures 28–32°C. Low chance of
          rain until midweek.
        </p>
      </div>

      <div className="space-y-3">
        {cropWarnings.map((w) => (
          <div
            key={w.crop}
            className={`rounded-xl border p-3 ${
              w.severity === 'warning'
                ? 'border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-900/10'
                : 'border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-900/10'
            }`}
          >
            <div className="mb-1 flex items-center gap-2">
              <span>{w.emoji}</span>
              <span className="text-sm font-medium text-agri-text dark:text-foreground">
                {w.crop}
              </span>
              {w.severity === 'warning' && (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <p className="text-xs leading-relaxed text-agri-muted dark:text-muted-foreground">
              {w.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
