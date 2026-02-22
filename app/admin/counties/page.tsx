'use client'

import PageHeader from '@/components/shared/PageHeader'
import { counties } from '@/lib/mock-data/counties'
import { MapPin, Users } from 'lucide-react'

const regionColors: Record<string, { badge: string; dot: string }> = {
  coastal: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  central: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    dot: 'bg-green-500',
  },
  interior: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
}

const countyMeta: Record<string, { activeUsers: number; topCrop: string }> = {
  Bomi: { activeUsers: 89, topCrop: 'Cassava' },
  Bong: { activeUsers: 312, topCrop: 'Rice' },
  Gbarpolu: { activeUsers: 52, topCrop: 'Cassava' },
  'Grand Bassa': { activeUsers: 198, topCrop: 'Plantain' },
  'Grand Cape Mount': { activeUsers: 167, topCrop: 'Coconut' },
  'Grand Gedeh': { activeUsers: 142, topCrop: 'Cocoa' },
  'Grand Kru': { activeUsers: 50, topCrop: 'Rice' },
  Lofa: { activeUsers: 278, topCrop: 'Coffee' },
  Margibi: { activeUsers: 245, topCrop: 'Rubber' },
  Maryland: { activeUsers: 105, topCrop: 'Rice' },
  Montserrado: { activeUsers: 612, topCrop: 'Rice' },
  Nimba: { activeUsers: 387, topCrop: 'Hot Pepper' },
  'River Cess': { activeUsers: 72, topCrop: 'Palm Oil' },
  'River Gee': { activeUsers: 58, topCrop: 'Cassava' },
  Sinoe: { activeUsers: 118, topCrop: 'Rubber' },
}

export default function AdminCountiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Counties"
        description="Overview of all 15 counties in Liberia"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {counties.map((county) => {
          const meta = countyMeta[county.name] ?? { activeUsers: 0, topCrop: 'N/A' }
          const colors = regionColors[county.region]
          return (
            <div
              key={county.id}
              className="rounded-2xl border border-agri-border bg-white p-6 transition-all duration-200 hover:shadow-md hover:scale-[1.01] dark:border-border dark:bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-agri-text dark:text-foreground">
                    {county.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1 text-sm text-agri-muted dark:text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {county.capital}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${colors.badge}`}>
                  {county.region}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-agri-text dark:text-foreground">
                  <Users className="h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                  Active users: <span className="font-semibold">{meta.activeUsers}</span>
                </div>
                <div className="text-sm text-agri-text dark:text-foreground">
                  Top crop: <span className="font-semibold">{meta.topCrop}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-success">Active</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
