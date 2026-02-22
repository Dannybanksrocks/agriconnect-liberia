'use client'

import { Edit2, MapPin, Ruler } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { crops } from '@/lib/mock-data/crops'
import CropBadge from '@/components/shared/CropBadge'

export default function FarmProfileCard() {
  const user = useAppStore((s) => s.user)

  if (!user) return null

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const userCrops = user.primaryCrops
    .map((name) => crops.find((c) => c.name === name))
    .filter(Boolean)

  return (
    <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
          {initials}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-agri-text dark:text-foreground">
            {user.name}
          </h2>

          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 text-sm text-agri-muted dark:text-muted-foreground sm:justify-start">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.county} County
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" />
              {user.farmSizeAcres} acres
            </span>
          </div>

          {userCrops.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              {userCrops.map((crop) => (
                <CropBadge
                  key={crop!.id}
                  category={crop!.category}
                  label={`${crop!.emoji} ${crop!.name}`}
                />
              ))}
            </div>
          )}
        </div>

        <button className="inline-flex items-center gap-1.5 rounded-xl border border-agri-border px-4 py-2 text-sm font-medium text-agri-text transition-colors hover:border-primary hover:text-primary dark:border-border dark:text-foreground dark:hover:border-primary dark:hover:text-primary">
          <Edit2 className="h-3.5 w-3.5" />
          Edit Profile
        </button>
      </div>
    </div>
  )
}
