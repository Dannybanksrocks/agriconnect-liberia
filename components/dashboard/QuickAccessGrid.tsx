'use client'

import Link from 'next/link'
import { TrendingUp, Cloud, Sprout, BookOpen, Sparkles, ShoppingBasket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Tile {
  label: string
  subtitle: string
  icon: LucideIcon
  href: string
}

const tiles: Tile[] = [
  {
    label: 'Market Prices',
    subtitle: 'Track crop prices & trends',
    icon: TrendingUp,
    href: '/market',
  },
  {
    label: 'Weather',
    subtitle: 'Forecasts & rain alerts',
    icon: Cloud,
    href: '/weather',
  },
  {
    label: 'My Farm',
    subtitle: 'Manage crops & harvest',
    icon: Sprout,
    href: '/my-farm',
  },
  {
    label: 'Agronomy Tips',
    subtitle: 'Guides & best practices',
    icon: BookOpen,
    href: '/tips',
  },
  {
    label: 'Marketplace',
    subtitle: 'Buy & sell produce',
    icon: ShoppingBasket,
    href: '/marketplace',
  },
  {
    label: 'AI Advisor',
    subtitle: 'Smart crop recommendations',
    icon: Sparkles,
    href: '/ai-advisor',
  },
]

export default function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {tiles.map((tile) => {
        const Icon = tile.icon
        return (
          <Link
            key={tile.label}
            href={tile.href}
            className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Icon className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{tile.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{tile.subtitle}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
