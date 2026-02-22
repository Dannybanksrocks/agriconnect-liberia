'use client'

import AppShell from '@/components/shared/AppShell'
import AuthGuard from '@/components/shared/AuthGuard'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard requiredRole="farmer">
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
