'use client'

import { TrendingUp, Bookmark, Sprout, CloudSun, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Activity {
  id: string
  icon: LucideIcon
  description: string
  time: string
}

const activities: Activity[] = [
  { id: 'a1', icon: TrendingUp, description: 'Checked rice prices in Montserrado',       time: '2h ago'    },
  { id: 'a2', icon: Bookmark,   description: 'Saved tip: Cassava Yield Maximization',    time: 'Yesterday' },
  { id: 'a3', icon: Sprout,     description: 'Updated farm profile — added Sweet Potato', time: '2d ago'   },
  { id: 'a4', icon: CloudSun,   description: 'Viewed weather forecast for Bong County',  time: '3d ago'    },
  { id: 'a5', icon: BookOpen,   description: 'Read: Post-Harvest Storage Tips',           time: '4d ago'   },
]

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="card-heading mb-4">Recent Activity</h2>

      <ul className="space-y-4">
        {activities.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="flex-1 body-text-strong leading-snug">{item.description}</p>
              <span className="shrink-0 caption-text">{item.time}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
