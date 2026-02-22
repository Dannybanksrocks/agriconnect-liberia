'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, Headphones } from 'lucide-react'
import type { AgronomyTip, CropCategory } from '@/lib/types'
import CropBadge from '@/components/shared/CropBadge'

const tipToCropCategory: Record<string, CropCategory> = {
  rice: 'grain',
  cassava: 'root',
  vegetables: 'vegetable',
  soil: 'legume',
  'pest-control': 'cash-crop',
  'post-harvest': 'fruit',
}

interface FeaturedTipProps {
  tip: AgronomyTip
}

export default function FeaturedTip({ tip }: FeaturedTipProps) {
  return (
    <Link href={`/tips/${tip.slug}`} className="block group">
      <div className="relative min-h-[300px] rounded-2xl overflow-hidden">
        <Image
          src={tip.imageUrl}
          alt={tip.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col gap-3">
          <div>
            <CropBadge
              category={tipToCropCategory[tip.category] ?? 'grain'}
              label={tip.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              size="sm"
            />
          </div>

          <h2 className="text-xl font-bold text-white sm:text-2xl leading-snug">
            {tip.title}
          </h2>

          <p className="text-sm text-white/75 sm:text-base line-clamp-2 max-w-2xl leading-relaxed">
            {tip.summary}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" />
              {tip.readTimeMinutes} min read
            </span>

            <span className="inline-flex items-center rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary/90">
              Read Article
            </span>

            {tip.audioAvailable && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                <Headphones className="h-4 w-4" />
                Listen (Audio)
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
