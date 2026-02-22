'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Cloud,
  FileText,
  Users,
  Map,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Logo, { LogoIcon } from './Logo'
import { useState } from 'react'

const adminNav = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Market Prices', icon: TrendingUp, href: '/admin/prices' },
  { label: 'Weather Data', icon: Cloud, href: '/admin/weather' },
  { label: 'Content', icon: FileText, href: '/admin/content' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Counties', icon: Map, href: '/admin/counties' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-agri-border bg-white transition-all duration-300 dark:border-border dark:bg-card ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="flex h-16 items-center border-b border-agri-border px-4 dark:border-border">
        {collapsed ? <LogoIcon size="md" /> : <Logo size="md" linkTo="/admin/dashboard" />}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {adminNav.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-agri-muted hover:bg-agri-hover hover:text-agri-text dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
              aria-label={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-agri-border p-2 dark:border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl p-2 text-agri-muted transition-colors hover:bg-agri-hover dark:text-muted-foreground dark:hover:bg-muted"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="border-t border-agri-border p-3 dark:border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              AJ
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-agri-text dark:text-foreground">
                Abraham Johnson
              </p>
              <p className="truncate text-xs text-agri-muted dark:text-muted-foreground">
                Super Admin
              </p>
            </div>
            <button
              className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-hover hover:text-danger dark:text-muted-foreground"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
