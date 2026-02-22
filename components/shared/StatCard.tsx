'use client'

import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  label: string
  value: string | number
  subValue?: string
  trend?: number
  trendLabel?: string
  loading?: boolean
  onClick?: () => void
}

export default function StatCard({
  icon: Icon,
  iconColor = 'text-green-600',
  iconBg = 'bg-green-50',
  label,
  value,
  subValue,
  trend,
  trendLabel,
  loading,
  onClick,
}: Readonly<StatCardProps>) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 rounded-lg bg-gray-100" />
          <div className="h-4 w-16 rounded bg-gray-100" />
        </div>
        <div className="mt-4 h-7 w-24 rounded bg-gray-100" />
        <div className="mt-1 h-4 w-32 rounded bg-gray-100" />
      </div>
    )
  }

  const cardContent = (
    <>
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trend >= 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-muted-foreground">
          {label}
          {subValue && <span className="ml-1 text-xs opacity-75">{subValue}</span>}
        </p>
        {trendLabel && (
          <p className="mt-1 text-xs text-gray-400 dark:text-muted-foreground">{trendLabel}</p>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className="w-full rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm dark:border-border dark:bg-card transition-shadow cursor-pointer hover:shadow-md"
        onClick={onClick}
        aria-label={`${label}: ${value}`}
      >
        {cardContent}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
      {cardContent}
    </div>
  )
}
