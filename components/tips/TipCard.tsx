'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Volume2 } from 'lucide-react'
import type { AgronomyTip, CropCategory } from '@/lib/types'
import CropBadge from '@/components/shared/CropBadge'
import { getCategoryImage } from '@/lib/constants/cropImages'

const tipToCropCategory: Record<string, CropCategory> = {
  rice: 'grain',
  cassava: 'root',
  vegetables: 'vegetable',
  soil: 'legume',
  'pest-control': 'cash-crop',
  'post-harvest': 'fruit',
}

const CATEGORY_COLORS: Record<string, string> = {
  rice: 'bg-yellow-100 text-yellow-800',
  cassava: 'bg-orange-100 text-orange-800',
  vegetables: 'bg-green-100 text-green-800',
  soil: 'bg-amber-100 text-amber-800',
  'pest-control': 'bg-red-100 text-red-800',
  'post-harvest': 'bg-purple-100 text-purple-800',
}

interface TipCardProps {
  tip: AgronomyTip
}

export default function TipCard({ tip }: TipCardProps) {
  const cropCat = tipToCropCategory[tip.category] ?? 'grain'
  const categoryLabel = tip.category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  const badgeColor = CATEGORY_COLORS[tip.category] ?? 'bg-gray-100 text-gray-700'
  const fallback = getCategoryImage(tip.category)
  const [imgSrc, setImgSrc] = useState(tip.imageUrl || fallback)

  return (
    <Link
      href={`/tips/${tip.slug}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all hover:shadow-md hover:border-green-300 dark:hover:border-green-700"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={imgSrc}
          alt={tip.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(fallback)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
          {categoryLabel}
        </span>
        {tip.audioAvailable && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
            <Volume2 className="w-3 h-3" /> Audio
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
          {tip.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {tip.summary}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tip.readTimeMinutes} min read
            </span>
          </div>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 group-hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  )
}
