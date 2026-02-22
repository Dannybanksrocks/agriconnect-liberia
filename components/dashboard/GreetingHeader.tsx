'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { getGreeting, formatDateFull } from '@/lib/utils/formatters'
import CountySelector from '@/components/shared/CountySelector'

export default function GreetingHeader() {
  const user = useAppStore((s) => s.user)
  const selectedCounty = useAppStore((s) => s.selectedCounty)
  const setSelectedCounty = useAppStore((s) => s.setSelectedCounty)
  const unreadAlertCount = useAppStore((s) => s.unreadAlertCount)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground tracking-tight">
          {getGreeting()}, {user?.name ?? 'Farmer'}
        </h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-muted-foreground">
          {formatDateFull()}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <CountySelector value={selectedCounty} onChange={setSelectedCounty} />

        <Link
          href="/alerts"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-green-500 hover:text-green-600 dark:border-border dark:bg-card dark:text-muted-foreground"
          aria-label={`Alerts — ${unreadAlertCount} unread`}
        >
          <Bell className="h-5 w-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadAlertCount > 99 ? '99+' : unreadAlertCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  )
}
