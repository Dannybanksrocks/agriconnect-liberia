'use client'

import Link from 'next/link'
import { TrendingUp, Cloud, Sprout, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Tile {
  label: string
  subtitle: string
  icon: LucideIcon
  href: string
  bg: string
  text: string
}

const tiles: Tile[] = [
  {
    label: 'Market Prices',
    subtitle: 'Track crop prices & trends',
    icon: TrendingUp,
    href: '/market',
    bg: 'bg-primary',
    text: 'text-white',
  },
  {
    label: 'Weather',
    subtitle: 'Forecasts & rain alerts',
    icon: Cloud,
    href: '/weather',
    bg: 'bg-accent',
    text: 'text-white',
  },
  {
    label: 'My Farm',
    subtitle: 'Manage crops & harvest',
    icon: Sprout,
    href: '/my-farm',
    bg: 'bg-secondary',
    text: 'text-secondary-foreground',
  },
  {
    label: 'Agronomy Tips',
    subtitle: 'Guides & best practices',
    icon: BookOpen,
    href: '/tips',
    bg: 'bg-primary-50',
    text: 'text-primary',
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
            className={`flex flex-col gap-2 rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${tile.bg} ${tile.text}`}
          >
            <Icon className="h-7 w-7" />
            <div>
              <p className="font-semibold">{tile.label}</p>
              <p className="text-xs opacity-80">{tile.subtitle}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
