'use client'

import { CloudOff, RefreshCw, Clock, Phone } from 'lucide-react'
import Logo from '@/components/shared/Logo'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-agri-bg px-4 dark:bg-background">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo size="lg" linkTo="" />
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-muted">
            <CloudOff className="h-10 w-10 text-gray-400 dark:text-muted-foreground" />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold text-agri-text dark:text-foreground">
          You&rsquo;re Offline
        </h1>
        <p className="mt-2 text-sm text-agri-muted dark:text-muted-foreground">
          No internet connection detected. Your cached data is still
          available below.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-agri-border bg-white p-4 dark:border-border dark:bg-card">
            <Clock className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-xs font-medium text-agri-text dark:text-foreground">
              Last prices synced
            </p>
            <p className="mt-0.5 text-sm font-semibold text-primary">
              2 hours ago
            </p>
          </div>
          <div className="rounded-xl border border-agri-border bg-white p-4 dark:border-border dark:bg-card">
            <Clock className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-xs font-medium text-agri-text dark:text-foreground">
              Last weather update
            </p>
            <p className="mt-0.5 text-sm font-semibold text-primary">
              45 mins ago
            </p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary-50 p-4 dark:border-primary/30 dark:bg-primary-900/20">
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-primary">*347#</span>
          </div>
          <p className="mt-1 text-xs text-agri-muted dark:text-muted-foreground">
            Need live data? Dial *347# from any phone
          </p>
        </div>
      </div>
    </div>
  )
}
