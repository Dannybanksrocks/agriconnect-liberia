'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, Cloud, BookOpen, User } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'

const navItems = [
  { label: 'Home',    icon: Home,       href: '/dashboard' },
  { label: 'Market',  icon: TrendingUp, href: '/market'    },
  { label: 'Weather', icon: Cloud,      href: '/weather'   },
  { label: 'Tips',    icon: BookOpen,   href: '/tips'      },
  { label: 'Profile', icon: User,       href: '/settings'  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const unreadAlertCount = useAppStore((s) => s.unreadAlertCount)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white dark:border-border dark:bg-card md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-500 dark:text-muted-foreground'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className={isActive ? '' : 'hidden'}>{item.label}</span>
              {item.href === '/dashboard' && unreadAlertCount > 0 && (
                <span className="absolute -top-0.5 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
