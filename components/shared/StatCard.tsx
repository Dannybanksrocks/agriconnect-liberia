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
  iconBg = 'bg-primary-50',
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
      <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 rounded-xl bg-muted" />
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
        <div className="mt-4 h-8 w-24 rounded bg-muted" />
        <div className="mt-1 h-4 w-32 rounded bg-muted" />
      </div>
    )
  }

  const cardContent = (
    <>
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? 'text-success' : 'text-danger'
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {trend > 0 ? '+' : ''}
              {trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-agri-text dark:text-foreground md:text-3xl">
          {value}
        </p>
        <p className="mt-0.5 text-sm text-agri-muted dark:text-muted-foreground">
          {label}
          {subValue && (
            <span className="ml-1 text-xs opacity-75">{subValue}</span>
          )}
        </p>
        {trendLabel && (
          <p className="mt-1 text-xs text-agri-muted dark:text-muted-foreground">
            {trendLabel}
          </p>
        )}
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        className="w-full rounded-2xl border border-agri-border bg-white p-6 text-left dark:border-border dark:bg-card transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02]"
        onClick={onClick}
        aria-label={`${label}: ${value}`}
      >
        {cardContent}
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card transition-all duration-200">
      {cardContent}
    </div>
  )
}
