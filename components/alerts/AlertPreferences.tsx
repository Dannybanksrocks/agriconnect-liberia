'use client'

import { useState } from 'react'
import {
  TrendingUp,
  CloudRain,
  Sprout,
  Lightbulb,
  Smartphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface PrefRow {
  id: string
  icon: LucideIcon
  label: string
  note?: string
  defaultOn: boolean
}

const preferences: PrefRow[] = [
  {
    id: 'price-alerts',
    icon: TrendingUp,
    label: 'Price Alerts (>5%)',
    defaultOn: true,
  },
  {
    id: 'weather-warnings',
    icon: CloudRain,
    label: 'Severe Weather Warnings',
    defaultOn: true,
  },
  {
    id: 'planting-reminders',
    icon: Sprout,
    label: 'Planting Season Reminders',
    defaultOn: true,
  },
  {
    id: 'agronomy-tips',
    icon: Lightbulb,
    label: 'New Agronomy Tips',
    defaultOn: false,
  },
  {
    id: 'sms-notifications',
    icon: Smartphone,
    label: 'SMS Notifications',
    note: 'SMS available on USSD *347#',
    defaultOn: false,
  },
]

export default function AlertPreferences() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(preferences.map((p) => [p.id, p.defaultOn]))
  )

  function toggle(id: string) {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="rounded-2xl border border-agri-border bg-white p-5 dark:border-border dark:bg-card">
      <h3 className="mb-4 font-semibold text-agri-text dark:text-foreground">
        Notification Preferences
      </h3>

      <div className="divide-y divide-agri-border dark:divide-border">
        {preferences.map((pref) => {
          const Icon = pref.icon
          const isOn = enabled[pref.id]

          return (
            <div
              key={pref.id}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4.5 w-4.5 text-agri-muted dark:text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-agri-text dark:text-foreground">
                    {pref.label}
                  </span>
                  {pref.note && (
                    <p className="text-xs text-agri-muted dark:text-muted-foreground">
                      {pref.note}
                    </p>
                  )}
                </div>
              </div>

              <button
                role="switch"
                aria-checked={isOn}
                onClick={() => toggle(pref.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  isOn
                    ? 'bg-primary'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform ${
                    isOn ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
