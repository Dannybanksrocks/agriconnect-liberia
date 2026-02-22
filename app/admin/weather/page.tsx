'use client'

import { useState } from 'react'
import {
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  Save,
} from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { counties } from '@/lib/mock-data/counties'

type Condition = 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'stormy'

interface WeatherEntry {
  county: string
  condition: Condition
  temp: number
  humidity: number
  windSpeed: number
  updatedAt: string
}

const conditionIcons: Record<Condition, typeof Sun> = {
  sunny: Sun,
  'partly-cloudy': Cloud,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
}

const conditionLabels: Record<Condition, string> = {
  sunny: 'Sunny',
  'partly-cloudy': 'Partly Cloudy',
  cloudy: 'Cloudy',
  rainy: 'Rainy',
  stormy: 'Stormy',
}

const initialWeather: WeatherEntry[] = [
  { county: 'Montserrado', condition: 'partly-cloudy', temp: 29, humidity: 78, windSpeed: 12, updatedAt: '2026-02-22 08:30' },
  { county: 'Nimba', condition: 'sunny', temp: 31, humidity: 65, windSpeed: 8, updatedAt: '2026-02-22 07:45' },
  { county: 'Bong', condition: 'rainy', temp: 26, humidity: 88, windSpeed: 15, updatedAt: '2026-02-22 09:00' },
  { county: 'Lofa', condition: 'cloudy', temp: 27, humidity: 82, windSpeed: 10, updatedAt: '2026-02-22 06:30' },
  { county: 'Margibi', condition: 'partly-cloudy', temp: 30, humidity: 74, windSpeed: 14, updatedAt: '2026-02-22 08:00' },
  { county: 'Grand Bassa', condition: 'rainy', temp: 25, humidity: 91, windSpeed: 18, updatedAt: '2026-02-21 22:15' },
  { county: 'Grand Cape Mount', condition: 'stormy', temp: 24, humidity: 95, windSpeed: 25, updatedAt: '2026-02-21 21:00' },
  { county: 'Grand Gedeh', condition: 'sunny', temp: 32, humidity: 60, windSpeed: 7, updatedAt: '2026-02-22 07:00' },
  { county: 'Sinoe', condition: 'cloudy', temp: 28, humidity: 80, windSpeed: 11, updatedAt: '2026-02-22 06:00' },
  { county: 'Maryland', condition: 'partly-cloudy', temp: 29, humidity: 76, windSpeed: 13, updatedAt: '2026-02-22 05:30' },
]

export default function AdminWeatherPage() {
  const [weatherData, setWeatherData] = useState(initialWeather)
  const [selectedCounty, setSelectedCounty] = useState('Montserrado')

  const [overrideCounty, setOverrideCounty] = useState('')
  const [overrideTemp, setOverrideTemp] = useState('')
  const [overrideHumidity, setOverrideHumidity] = useState('')
  const [overrideWind, setOverrideWind] = useState('')
  const [overrideCondition, setOverrideCondition] = useState<Condition>('sunny')

  const currentWeather = weatherData.find((w) => w.county === selectedCounty) ?? weatherData[0]
  const ConditionIcon = conditionIcons[currentWeather.condition]

  const handleOverrideSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!overrideCounty || !overrideTemp) {
      alert('Please fill in all required fields')
      return
    }

    const now = new Date()
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`

    const updated: WeatherEntry = {
      county: counties.find((c) => c.id === overrideCounty)?.name ?? overrideCounty,
      condition: overrideCondition,
      temp: parseInt(overrideTemp),
      humidity: parseInt(overrideHumidity) || 70,
      windSpeed: parseInt(overrideWind) || 10,
      updatedAt: timestamp,
    }

    setWeatherData((prev) => {
      const existing = prev.findIndex((w) => w.county === updated.county)
      if (existing >= 0) {
        const copy = [...prev]
        copy[existing] = updated
        return copy
      }
      return [updated, ...prev]
    })

    setOverrideCounty('')
    setOverrideTemp('')
    setOverrideHumidity('')
    setOverrideWind('')
    setOverrideCondition('sunny')
    alert('Weather data updated successfully!')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weather Management"
        description="View and manage weather data for all 15 counties"
      />

      {/* County Selector */}
      <div className="rounded-2xl border border-agri-border bg-white p-4 dark:border-border dark:bg-card">
        <label className="mb-2 block text-sm font-medium text-agri-text dark:text-foreground">
          Select County to View
        </label>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:w-64"
        >
          {counties.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Weather Display + Override Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Weather Card */}
        <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
          <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
            Current Weather — {currentWeather.county}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
              <ConditionIcon className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-4xl font-bold text-agri-text dark:text-foreground">
                {currentWeather.temp}°C
              </p>
              <p className="text-sm font-medium text-agri-muted dark:text-muted-foreground">
                {conditionLabels[currentWeather.condition]}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-agri-bg p-3 dark:bg-muted">
              <div className="flex items-center gap-1.5 text-xs text-agri-muted dark:text-muted-foreground">
                <Thermometer className="h-3.5 w-3.5" />
                Temperature
              </div>
              <p className="mt-1 text-lg font-bold text-agri-text dark:text-foreground">
                {currentWeather.temp}°C
              </p>
            </div>
            <div className="rounded-xl bg-agri-bg p-3 dark:bg-muted">
              <div className="flex items-center gap-1.5 text-xs text-agri-muted dark:text-muted-foreground">
                <Droplets className="h-3.5 w-3.5" />
                Humidity
              </div>
              <p className="mt-1 text-lg font-bold text-agri-text dark:text-foreground">
                {currentWeather.humidity}%
              </p>
            </div>
            <div className="rounded-xl bg-agri-bg p-3 dark:bg-muted">
              <div className="flex items-center gap-1.5 text-xs text-agri-muted dark:text-muted-foreground">
                <Wind className="h-3.5 w-3.5" />
                Wind
              </div>
              <p className="mt-1 text-lg font-bold text-agri-text dark:text-foreground">
                {currentWeather.windSpeed} km/h
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-agri-muted dark:text-muted-foreground">
            Last updated: {currentWeather.updatedAt}
          </p>
        </div>

        {/* Manual Override Form */}
        <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
          <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
            Manual Override
          </h2>
          <form onSubmit={handleOverrideSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                County
              </label>
              <select
                value={overrideCounty}
                onChange={(e) => setOverrideCounty(e.target.value)}
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select county...</option>
                {counties.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={overrideTemp}
                  onChange={(e) => setOverrideTemp(e.target.value)}
                  placeholder="28"
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={overrideHumidity}
                  onChange={(e) => setOverrideHumidity(e.target.value)}
                  placeholder="75"
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                Wind Speed (km/h)
              </label>
              <input
                type="number"
                value={overrideWind}
                onChange={(e) => setOverrideWind(e.target.value)}
                placeholder="12"
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                Condition
              </label>
              <select
                value={overrideCondition}
                onChange={(e) => setOverrideCondition(e.target.value as Condition)}
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.entries(conditionLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              <Save className="h-4 w-4" />
              Save Override
            </button>
          </form>
        </div>
      </div>

      {/* Recent Weather Updates Table */}
      <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
        <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
          Recent Weather Updates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-agri-border dark:border-border">
                <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  County
                </th>
                <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  Condition
                </th>
                <th className="py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                  Temp
                </th>
                <th className="hidden py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground sm:table-cell">
                  Humidity
                </th>
                <th className="hidden py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground md:table-cell">
                  Wind
                </th>
                <th className="py-3 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((entry) => {
                const Icon = conditionIcons[entry.condition]
                return (
                  <tr
                    key={entry.county}
                    className="border-b border-agri-border/50 transition-colors hover:bg-agri-hover dark:border-border/50 dark:hover:bg-muted"
                  >
                    <td className="py-3 pr-4 font-medium text-agri-text dark:text-foreground">
                      {entry.county}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-2 text-agri-text dark:text-foreground">
                        <Icon className="h-4 w-4 text-primary" />
                        {conditionLabels[entry.condition]}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-agri-text dark:text-foreground">
                      {entry.temp}°C
                    </td>
                    <td className="hidden py-3 pr-4 text-right text-agri-muted dark:text-muted-foreground sm:table-cell">
                      {entry.humidity}%
                    </td>
                    <td className="hidden py-3 pr-4 text-right text-agri-muted dark:text-muted-foreground md:table-cell">
                      {entry.windSpeed} km/h
                    </td>
                    <td className="py-3 text-right text-xs text-agri-muted dark:text-muted-foreground">
                      {entry.updatedAt}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
