'use client'

import {
  TrendingUp,
  Bookmark,
  Sprout,
  CloudSun,
  BookOpen,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Activity {
  id: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  description: string
  time: string
}

const activities: Activity[] = [
  {
    id: 'a1',
    icon: TrendingUp,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary',
    description: 'Checked rice prices in Montserrado',
    time: '2h ago',
  },
  {
    id: 'a2',
    icon: Bookmark,
    iconBg: 'bg-amber-50',
    iconColor: 'text-warning',
    description: 'Saved tip: Cassava Yield Maximization',
    time: 'Yesterday',
  },
  {
    id: 'a3',
    icon: Sprout,
    iconBg: 'bg-green-50',
    iconColor: 'text-success',
    description: 'Updated farm profile — added Sweet Potato',
    time: '2d ago',
  },
  {
    id: 'a4',
    icon: CloudSun,
    iconBg: 'bg-blue-50',
    iconColor: 'text-accent',
    description: 'Viewed weather forecast for Bong County',
    time: '3d ago',
  },
  {
    id: 'a5',
    icon: BookOpen,
    iconBg: 'bg-primary-50',
    iconColor: 'text-primary',
    description: 'Read: Post-Harvest Storage Tips',
    time: '4d ago',
  },
]

export default function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
      <h2 className="mb-4 text-lg font-semibold text-agri-text dark:text-foreground">
        Recent Activity
      </h2>

      <ul className="space-y-4">
        {activities.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
              <p className="flex-1 text-sm text-agri-text dark:text-foreground">
                {item.description}
              </p>
              <span className="shrink-0 text-xs text-agri-muted dark:text-muted-foreground">
                {item.time}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
