'use client'

import AdminShell from '@/components/shared/AdminShell'
import AuthGuard from '@/components/shared/AuthGuard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="admin">
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  )
}
