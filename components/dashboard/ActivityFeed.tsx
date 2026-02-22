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
  description: string
  time: string
}

const activities: Activity[] = [
  {
    id: 'a1',
    icon: TrendingUp,
    description: 'Checked rice prices in Montserrado',
    time: '2h ago',
  },
  {
    id: 'a2',
    icon: Bookmark,
    description: 'Saved tip: Cassava Yield Maximization',
    time: 'Yesterday',
  },
  {
    id: 'a3',
    icon: Sprout,
    description: 'Updated farm profile — added Sweet Potato',
    time: '2d ago',
  },
  {
    id: 'a4',
    icon: CloudSun,
    description: 'Viewed weather forecast for Bong County',
    time: '3d ago',
  },
  {
    id: 'a5',
    icon: BookOpen,
    description: 'Read: Post-Harvest Storage Tips',
    time: '4d ago',
  },
]

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
      <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-foreground">
        Recent Activity
      </h2>

      <ul className="space-y-4">
        {activities.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50">
                <Icon className="h-4 w-4 text-green-600" />
              </div>
              <p className="flex-1 text-sm text-gray-700 dark:text-foreground leading-snug">
                {item.description}
              </p>
              <span className="shrink-0 text-xs text-gray-400 dark:text-muted-foreground">
                {item.time}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
