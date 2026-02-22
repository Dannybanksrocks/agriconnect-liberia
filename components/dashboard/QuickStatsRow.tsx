'use client'

import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, Cloud, Bell, BookOpen, ShoppingBag, PackageCheck } from 'lucide-react'
import StatCard from '@/components/shared/StatCard'

interface StatEntry {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  label: string
  value: string
  subValue: string
  trend?: number
  trendLabel?: string
  href: string
}

const stats: StatEntry[] = [
  {
    icon: TrendingUp,
    iconBg: 'bg-[#D8F3DC]',
    iconColor: 'text-[#1B4332]',
    label: "Today's Rice Price",
    value: 'L$ 320.00',
    subValue: 'per kg',
    trend: 2.4,
    trendLabel: 'vs last week',
    href: '/market',
  },
  {
    icon: ShoppingBag,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    label: 'Pending Orders',
    value: '3',
    subValue: 'awaiting action',
    href: '/shop/orders',
  },
  {
    icon: PackageCheck,
    iconBg: 'bg-[#D8F3DC]',
    iconColor: 'text-[#2D6A4F]',
    label: 'Revenue (Month)',
    value: 'L$60,200',
    subValue: 'from shop orders',
    trend: 12.5,
    trendLabel: 'vs last month',
    href: '/shop/orders',
  },
  {
    icon: Cloud,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    label: 'Current Weather',
    value: '29°C',
    subValue: 'Partly Cloudy',
    trendLabel: 'Montserrado',
    href: '/weather',
  },
  {
    icon: Bell,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    label: 'Active Alerts',
    value: '3',
    subValue: 'unread',
    href: '/alerts',
  },
  {
    icon: BookOpen,
    iconBg: 'bg-[#D8F3DC]',
    iconColor: 'text-[#1B4332]',
    label: 'Saved Tips',
    value: '7',
    subValue: 'articles',
    href: '/tips',
  },
]

export default function QuickStatsRow() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
          label={stat.label}
          value={stat.value}
          subValue={stat.subValue}
          trend={stat.trend}
          trendLabel={stat.trendLabel}
          onClick={() => router.push(stat.href)}
        />
      ))}
    </div>
  )
}
