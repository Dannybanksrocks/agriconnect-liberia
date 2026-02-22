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
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
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
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="mt-4 h-7 w-24 rounded bg-muted" />
        <div className="mt-1 h-4 w-32 rounded bg-muted" />
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
          <span
            className={`flex items-center gap-1 caption-text font-semibold ${
              trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="stat-value">{value}</p>
        <p className="mt-0.5 body-text">
          {label}
          {subValue && (
            <span className="ml-1 caption-text">{subValue}</span>
          )}
        </p>
        {trendLabel && (
          <p className="mt-1 caption-text">{trendLabel}</p>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className="w-full rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md cursor-pointer"
        onClick={onClick}
        aria-label={`${label}: ${value}`}
      >
        {cardContent}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {cardContent}
    </div>
  )
}
