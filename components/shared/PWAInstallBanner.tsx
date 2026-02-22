'use client'

import { useState } from 'react'
import { Smartphone, X } from 'lucide-react'

export default function PWAInstallBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary-50 p-4 dark:border-primary/30 dark:bg-primary-900/20">
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 rounded-lg p-1 text-agri-muted hover:bg-white/50 dark:text-muted-foreground dark:hover:bg-white/10"
        aria-label="Dismiss install banner"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-agri-text dark:text-foreground">
            Add AgriConnect to your home screen
          </h3>
          <p className="mt-0.5 text-sm text-agri-muted dark:text-muted-foreground">
            Get instant notifications for price changes and weather alerts
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
              aria-label="Install AgriConnect app"
            >
              Install App
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-agri-muted transition-colors hover:bg-white/50 dark:text-muted-foreground"
              aria-label="Dismiss install prompt"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
