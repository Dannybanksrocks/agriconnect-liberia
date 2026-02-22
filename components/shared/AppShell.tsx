'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  ShoppingCart,
  Sparkles,
  Package,
} from 'lucide-react'
import Logo, { LogoIcon } from './Logo'
import MobileBottomNav from './MobileBottomNav'
import { useAppStore } from '@/lib/store/useAppStore'
import { useAuth } from '@/lib/auth'

const sidebarItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'AI Advisor', icon: Sparkles, href: '/ai-advisor' },
  { label: 'Marketplace', icon: ShoppingCart, href: '/marketplace' },
  { label: 'Inventory', icon: Package, href: '/inventory' },
  { label: 'Market Prices', icon: TrendingUp, href: '/market' },
  { label: 'Weather', icon: Cloud, href: '/weather' },
  { label: 'Agronomy Tips', icon: BookOpen, href: '/tips' },
  { label: 'My Farm', icon: Sprout, href: '/my-farm' },
  { label: 'Alerts', icon: Bell, href: '/alerts' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar, user, unreadAlertCount } = useAppStore()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-gray-100 bg-white transition-all duration-300 dark:border-border dark:bg-card md:flex ${
          sidebarCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-4 dark:border-border">
          {sidebarCollapsed ? (
            <LogoIcon size="md" />
          ) : (
            <Logo size="md" linkTo="/dashboard" />
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5 px-2 py-4">
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
                {item.href === '/alerts' && unreadAlertCount > 0 && !sidebarCollapsed && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadAlertCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="border-t border-gray-100 p-2 dark:border-border">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 dark:text-muted-foreground dark:hover:bg-muted"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* User info */}
        {!sidebarCollapsed && user && (
          <div className="border-t border-gray-100 p-3 dark:border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                {user.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-muted-foreground">
                  {user.county}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-500 dark:text-muted-foreground dark:hover:bg-muted"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 dark:border-border dark:bg-card md:hidden">
        <Logo size="sm" linkTo="/dashboard" />
        <div className="flex items-center gap-2">
          <Link
            href="/alerts"
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-50 dark:text-muted-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
              </span>
            )}
          </Link>
          {user && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
              {user.name.split(' ').map((n) => n[0]).join('')}
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
