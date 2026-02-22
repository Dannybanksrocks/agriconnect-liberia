'use client'

import { Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import { formatLRD, formatDate } from '@/lib/utils/formatters'
import EmptyState from '@/components/shared/EmptyState'

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  growing: {
    label: 'Growing',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
  },
  'ready-soon': {
    label: 'Ready Soon',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-800 dark:text-amber-300',
  },
  harvested: {
    label: 'Harvested',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
  },
  failed: {
    label: 'Failed',
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
  },
}

function daysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  return Math.ceil((target.getTime() - now.getTime()) / 86_400_000)
}

export default function CropTrackerTable() {
  const farmCrops = useAppStore((s) => s.farmCrops)
  const removeFarmCrop = useAppStore((s) => s.removeFarmCrop)

  if (farmCrops.length === 0) {
    return (
      <EmptyState
        title="No crops added yet"
        description="Start tracking your crops by clicking the Add Crop button above."
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-agri-border bg-white dark:border-border dark:bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-agri-border text-left text-xs font-medium uppercase tracking-wider text-agri-muted dark:border-border dark:text-muted-foreground">
            <th className="px-4 py-3">Crop</th>
            <th className="px-4 py-3">Area</th>
            <th className="hidden px-4 py-3 md:table-cell">Planted</th>
            <th className="px-4 py-3">Harvest</th>
            <th className="px-4 py-3">Status</th>
            <th className="hidden px-4 py-3 sm:table-cell">Price</th>
            <th className="hidden px-4 py-3 lg:table-cell">Est. Value</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-agri-border dark:divide-border">
          {farmCrops.map((fc) => {
            const status = statusConfig[fc.status] ?? statusConfig.growing
            const days = daysUntil(fc.expectedHarvestDate)
            const estValue = fc.areaAcres * 1000 * fc.currentPriceLD

            return (
              <tr
                key={fc.id}
                className="text-agri-text transition-colors hover:bg-agri-bg dark:text-foreground dark:hover:bg-muted/40"
              >
                <td className="whitespace-nowrap px-4 py-3 font-medium">
                  <span className="mr-1.5">{fc.emoji}</span>
                  {fc.cropName}
                </td>
                <td className="px-4 py-3">{fc.areaAcres} ac</td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {formatDate(fc.plantedDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span>{formatDate(fc.expectedHarvestDate)}</span>
                    {days > 0 && (
                      <span className="text-xs text-agri-muted dark:text-muted-foreground">
                        In {days} days
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {formatLRD(fc.currentPriceLD)}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {formatLRD(estValue)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeFarmCrop(fc.id)}
                    className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-red-50 hover:text-red-600 dark:text-muted-foreground dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    aria-label={`Remove ${fc.cropName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
