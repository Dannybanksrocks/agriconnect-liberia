'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  TrendingUp,
  Cloud,
  BookOpen,
  Sprout,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import Logo, { LogoIcon } from './Logo'
import MobileBottomNav from './MobileBottomNav'
import { useAppStore } from '@/lib/store/useAppStore'

const sidebarItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Market Prices', icon: TrendingUp, href: '/market' },
  { label: 'Weather', icon: Cloud, href: '/weather' },
  { label: 'Agronomy Tips', icon: BookOpen, href: '/tips' },
  { label: 'My Farm', icon: Sprout, href: '/my-farm' },
  { label: 'Alerts', icon: Bell, href: '/alerts' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, user, unreadAlertCount } =
    useAppStore()

  return (
    <div className="min-h-screen bg-agri-bg dark:bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-agri-border bg-white transition-all duration-300 dark:border-border dark:bg-card md:flex ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-agri-border px-4 dark:border-border">
          {sidebarCollapsed ? (
            <LogoIcon size="md" />
          ) : (
            <Logo size="md" linkTo="/dashboard" />
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-agri-muted hover:bg-agri-hover hover:text-agri-text dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {item.href === '/alerts' &&
                  unreadAlertCount > 0 &&
                  !sidebarCollapsed && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                      {unreadAlertCount}
                    </span>
                  )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-agri-border p-2 dark:border-border">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-xl p-2 text-agri-muted transition-colors hover:bg-agri-hover dark:text-muted-foreground dark:hover:bg-muted"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* User info */}
        {!sidebarCollapsed && user && (
          <div className="border-t border-agri-border p-3 dark:border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium text-agri-text dark:text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-agri-muted dark:text-muted-foreground">
                  {user.county}
                </p>
              </div>
              <button
                className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-hover hover:text-danger dark:text-muted-foreground dark:hover:bg-muted"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-agri-border bg-white/95 px-4 backdrop-blur-md dark:border-border dark:bg-card/95 md:hidden">
        <Logo size="sm" linkTo="/dashboard" />
        <div className="flex items-center gap-2">
          <Link
            href="/alerts"
            className="relative rounded-lg p-2 text-agri-muted transition-colors hover:bg-agri-hover dark:text-muted-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
              </span>
            )}
          </Link>
          {user && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main
        className={`min-h-screen pt-14 pb-20 md:pt-0 md:pb-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  )
}
