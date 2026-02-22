'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import { getWeatherForecast } from '@/lib/api/weather'
import type { WeatherForecast } from '@/lib/types'
import PageHeader from '@/components/shared/PageHeader'
import CountySelector from '@/components/shared/CountySelector'
import { Skeleton } from '@/components/shared/LoadingSkeleton'
import CurrentConditionsCard from '@/components/weather/CurrentConditionsCard'
import ForecastStrip from '@/components/weather/ForecastStrip'
import HourlyChart from '@/components/weather/HourlyChart'
import AgriculturalAlerts from '@/components/weather/AgriculturalAlerts'
import RainfallChart from '@/components/weather/RainfallChart'

export default function WeatherPage() {
  const { selectedCounty, setSelectedCounty } = useAppStore()
  const [forecast, setForecast] = useState<WeatherForecast | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getWeatherForecast(selectedCounty).then((data) => {
      if (!cancelled) { setForecast(data); setLoading(false) }
    })
    return () => { cancelled = true }
  }, [selectedCounty])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Weather Forecast"
        description="Real-time weather data and agricultural advisories for your county"
        actions={
          <CountySelector value={selectedCounty} onChange={setSelectedCounty} size="lg" />
        }
      />

      {loading ? (
        <WeatherSkeleton />
      ) : forecast ? (
        <>
          <CurrentConditionsCard current={forecast.current} />
          <ForecastStrip daily={forecast.daily} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HourlyChart hourly={forecast.hourly} />
            </div>
            <div>
              <AgriculturalAlerts agricultural={forecast.agricultural} />
            </div>
          </div>
          <RainfallChart data={forecast.rainfall30d} />
        </>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="body-text">No weather data available for {selectedCounty}.</p>
        </div>
      )}
    </div>
  )
}

function WeatherSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-12 w-36" />
            <Skeleton className="mt-2 h-4 w-28" />
            <Skeleton className="mt-3 h-5 w-40" />
          </div>
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div>
                <Skeleton className="h-3 w-14" />
                <Skeleton className="mt-1 h-4 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <Skeleton className="mb-4 h-6 w-44" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="mt-3 h-5 w-full" />
            <Skeleton className="mt-4 h-16 rounded-lg" />
            <Skeleton className="mt-2 h-16 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <Skeleton className="h-[250px] rounded-lg" />
      </div>
    </div>
  )
}
