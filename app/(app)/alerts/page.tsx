'use client'

import { useState, useEffect, useCallback } from 'react'
import { CheckCheck } from 'lucide-react'
import type { Alert } from '@/lib/types'
import { getAlerts, markAlertRead, markAllRead } from '@/lib/api/alerts'
import { useAppStore } from '@/lib/store/useAppStore'
import PageHeader from '@/components/shared/PageHeader'
import PWAInstallBanner from '@/components/shared/PWAInstallBanner'
import AlertItem from '@/components/alerts/AlertItem'
import AlertPreferences from '@/components/alerts/AlertPreferences'

const tabs = ['all', 'weather', 'price', 'agronomy', 'system'] as const
type TabType = (typeof tabs)[number]

const tabLabels: Record<TabType, string> = {
  all: 'All',
  weather: 'Weather',
  price: 'Price',
  agronomy: 'Agronomy',
  system: 'System',
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [loading, setLoading] = useState(true)
  const setUnreadAlertCount = useAppStore((s) => s.setUnreadAlertCount)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    const data = await getAlerts()
    setAlerts(data)
    setUnreadAlertCount(data.filter((a) => !a.read).length)
    setLoading(false)
  }, [setUnreadAlertCount])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const filtered =
    activeTab === 'all'
      ? alerts
      : alerts.filter((a) => a.type === activeTab)

  const tabCounts = (type: TabType) => {
    if (type === 'all') return alerts.filter((a) => !a.read).length
    return alerts.filter((a) => a.type === type && !a.read).length
  }

  async function handleMarkRead(id: string) {
    await markAlertRead(id)
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    )
    setUnreadAlertCount(
      alerts.filter((a) => !a.read && a.id !== id).length
    )
  }

  async function handleMarkAllRead() {
    await markAllRead()
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
    setUnreadAlertCount(0)
  }

  function handleDismiss(id: string) {
    const alert = alerts.find((a) => a.id === id)
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    if (alert && !alert.read) {
      setUnreadAlertCount(
        alerts.filter((a) => !a.read && a.id !== id).length
      )
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts"
        description="Stay informed about weather, prices, and farming updates across Liberia."
        actions={
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-xl border border-agri-border px-4 py-2 text-sm font-medium text-agri-text transition-colors hover:border-primary hover:text-primary dark:border-border dark:text-foreground dark:hover:border-primary dark:hover:text-primary"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        }
      />

      <PWAInstallBanner />

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl bg-agri-bg p-1 dark:bg-muted">
        {tabs.map((tab) => {
          const count = tabCounts(tab)
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-agri-text shadow-sm dark:bg-card dark:text-foreground'
                  : 'text-agri-muted hover:text-agri-text dark:text-muted-foreground dark:hover:text-foreground'
              }`}
            >
              {tabLabels[tab]}
              {count > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-agri-bg dark:bg-muted"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-agri-muted dark:text-muted-foreground">
            No alerts in this category.
          </div>
        ) : (
          filtered.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onMarkRead={handleMarkRead}
              onDismiss={handleDismiss}
            />
          ))
        )}
      </div>

      {/* Preferences */}
      <AlertPreferences />
    </div>
  )
}
