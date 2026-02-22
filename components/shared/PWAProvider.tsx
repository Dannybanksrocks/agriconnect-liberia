'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAContextValue {
  canInstall: boolean
  isIOS: boolean
  isStandalone: boolean
  install: () => Promise<void>
  dismissed: boolean
  dismiss: () => void
}

const PWAContext = createContext<PWAContextValue>({
  canInstall: false,
  isIOS: false,
  isStandalone: false,
  install: async () => {},
  dismissed: false,
  dismiss: () => {},
})

export function usePWA() {
  return useContext(PWAContext)
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }

    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream
    setIsIOS(ios)

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    setIsStandalone(standalone)

    const wasDismissed = sessionStorage.getItem('pwa-banner-dismissed') === '1'
    setDismissed(wasDismissed)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    sessionStorage.setItem('pwa-banner-dismissed', '1')
    setDismissed(true)
  }, [])

  return (
    <PWAContext.Provider
      value={{
        canInstall: !!deferredPrompt,
        isIOS,
        isStandalone,
        install,
        dismissed,
        dismiss,
      }}
    >
      {children}
    </PWAContext.Provider>
  )
}
