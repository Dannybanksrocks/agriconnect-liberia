'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'farmer' | 'admin' | 'extension-officer'
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Wait for auth to hydrate from localStorage
    const timer = setTimeout(() => {
      setChecked(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!checked) return

    if (!isAuthenticated || !user) {
      router.replace(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // Role-based redirects
    if (requiredRole === 'admin' && user.role !== 'admin') {
      router.replace('/dashboard')
      return
    }

    if (requiredRole === 'farmer' && user.role === 'admin') {
      router.replace('/admin/dashboard')
      return
    }
  }, [checked, isAuthenticated, user, requiredRole, router, pathname])

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-green-600" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return null
  }

  if (requiredRole === 'farmer' && user.role === 'admin') {
    return null
  }

  return <>{children}</>
}
