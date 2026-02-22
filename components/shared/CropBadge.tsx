import type { CropCategory } from '@/lib/types'

const categoryStyles: Record<CropCategory, string> = {
  grain: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  vegetable: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  fruit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  legume: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'cash-crop': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  root: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
}

interface CropBadgeProps {
  category: CropCategory
  label?: string
  size?: 'sm' | 'md'
}

export default function CropBadge({
  category,
  label,
  size = 'sm',
}: CropBadgeProps) {
  const displayLabel =
    label ??
    category
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        categoryStyles[category]
      } ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}`}
    >
      {displayLabel}
    </span>
  )
}
