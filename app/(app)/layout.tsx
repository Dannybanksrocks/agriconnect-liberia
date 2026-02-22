'use client'

import AppShell from '@/components/shared/AppShell'

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AppShell>{children}</AppShell>
}
