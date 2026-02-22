'use client'

import { CloudRain, TrendingUp, Sprout, Bell, Check, X } from 'lucide-react'
import type { Alert } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

const severityBorder: Record<Alert['severity'], string> = {
  critical: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
}

const typeIcon: Record<Alert['type'], typeof CloudRain> = {
  weather: CloudRain,
  price: TrendingUp,
  agronomy: Sprout,
  system: Bell,
}

const typeIconBg: Record<Alert['type'], string> = {
  weather: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  price: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  agronomy: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  system: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

interface AlertItemProps {
  alert: Alert
  onMarkRead?: (id: string) => void
  onDismiss?: (id: string) => void
}

export default function AlertItem({
  alert,
  onMarkRead,
  onDismiss,
}: AlertItemProps) {
  const Icon = typeIcon[alert.type]

  return (
    <div
      className={`group relative rounded-xl border-l-4 border border-agri-border bg-white p-4 transition-colors hover:bg-agri-bg dark:border-border dark:bg-card dark:hover:bg-muted/40 ${
        severityBorder[alert.severity]
      } ${!alert.read ? 'ring-1 ring-primary/10' : ''}`}
    >
      <div className="flex gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${typeIconBg[alert.type]}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4
            className={`text-sm leading-snug text-agri-text dark:text-foreground ${
              !alert.read ? 'font-bold' : 'font-medium'
            }`}
          >
            {alert.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-agri-muted dark:text-muted-foreground">
            {alert.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {alert.county && (
              <span className="inline-flex rounded-full bg-agri-bg px-2 py-0.5 text-[11px] font-medium text-agri-muted dark:bg-muted dark:text-muted-foreground">
                {alert.county}
              </span>
            )}
            {alert.crop && (
              <span className="inline-flex rounded-full bg-agri-bg px-2 py-0.5 text-[11px] font-medium text-agri-muted dark:bg-muted dark:text-muted-foreground">
                {alert.crop}
              </span>
            )}
            <span className="text-[11px] text-agri-muted dark:text-muted-foreground">
              {formatRelativeTime(alert.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!alert.read && onMarkRead && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-green-50 hover:text-green-600 dark:text-muted-foreground dark:hover:bg-green-900/20 dark:hover:text-green-400"
              aria-label="Mark as read"
              title="Mark read"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={() => onDismiss(alert.id)}
              className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:text-muted-foreground dark:hover:bg-red-900/20 dark:hover:text-red-400"
              aria-label="Dismiss alert"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
