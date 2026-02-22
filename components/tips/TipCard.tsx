import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
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

interface TipCardProps {
  tip: AgronomyTip
}

export default function TipCard({ tip }: TipCardProps) {
  const cropCat = tipToCropCategory[tip.category] ?? 'grain'
  const categoryLabel = tip.category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <Link
      href={`/tips/${tip.slug}`}
      className="group block rounded-2xl border border-agri-border bg-white p-4 transition-all hover:shadow-md dark:border-border dark:bg-card"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={tip.imageUrl}
          alt={tip.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="mt-3 space-y-2">
        <CropBadge category={cropCat} label={categoryLabel} size="sm" />

        <h3 className="text-base font-semibold text-agri-text line-clamp-2 leading-snug dark:text-foreground">
          {tip.title}
        </h3>

        <p className="text-sm text-agri-muted line-clamp-3 dark:text-muted-foreground">
          {tip.summary}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-agri-muted dark:text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tip.readTimeMinutes} min
            </span>
            {tip.audioAvailable && <span>🎧 Audio</span>}
          </div>

          <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  )
}
