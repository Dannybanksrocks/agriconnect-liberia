'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Play,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
} from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import CropBadge from '@/components/shared/CropBadge'
import TipCard from '@/components/tips/TipCard'
import { getTipBySlug, getRelatedTips } from '@/lib/api/tips'
import { formatDate } from '@/lib/utils/formatters'
import type { AgronomyTip, CropCategory } from '@/lib/types'

const tipToCropCategory: Record<string, CropCategory> = {
  rice: 'grain',
  cassava: 'root',
  vegetables: 'vegetable',
  soil: 'legume',
  'pest-control': 'cash-crop',
  'post-harvest': 'fruit',
}

const AUDIO_LANGUAGES = ['EN', 'Kpelle', 'Bassa']

export default function TipDetailPage() {
  const params = useParams<{ slug: string }>()
  const [tip, setTip] = useState<AgronomyTip | null>(null)
  const [related, setRelated] = useState<AgronomyTip[]>([])
  const [loading, setLoading] = useState(true)
  const [audioLang, setAudioLang] = useState('EN')

  useEffect(() => {
    if (!params.slug) return
    setLoading(true)
    getTipBySlug(params.slug).then((data) => {
      setTip(data)
      if (data) {
        getRelatedTips(data.slug, data.category, 3).then(setRelated)
      }
      setLoading(false)
    })
  }, [params.slug])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-64 animate-pulse rounded bg-agri-hover dark:bg-muted" />
        <div className="h-[400px] animate-pulse rounded-2xl bg-agri-hover dark:bg-muted" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-agri-hover dark:bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-agri-hover dark:bg-muted" />
          <div className="h-40 animate-pulse rounded-xl bg-agri-hover dark:bg-muted" />
        </div>
      </div>
    )
  }

  if (!tip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-agri-text dark:text-foreground">
          Tip not found
        </p>
        <Link
          href="/tips"
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          ← Back to all tips
        </Link>
      </div>
    )
  }

  const cropCat = tipToCropCategory[tip.category] ?? 'grain'
  const categoryLabel = tip.category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  const paragraphs = tip.content.split('\n\n').filter(Boolean)

  return (
    <div className="space-y-8">
      <PageHeader
        title={tip.title}
        breadcrumb={[
          { label: 'Tips', href: '/tips' },
          { label: categoryLabel, href: `/tips?category=${tip.category}` },
          { label: tip.title },
        ]}
      />

      {/* Hero image */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl sm:h-[400px]">
        <Image
          src={tip.imageUrl}
          alt={tip.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3">
        <CropBadge category={cropCat} label={categoryLabel} size="md" />
        <span className="inline-flex items-center gap-1.5 text-sm text-agri-muted dark:text-muted-foreground">
          <Clock className="h-4 w-4" />
          {tip.readTimeMinutes} min read
        </span>
        <span className="text-sm text-agri-muted dark:text-muted-foreground">
          {formatDate(tip.publishedAt)}
        </span>
      </div>

      {/* Audio player */}
      {tip.audioAvailable && (
        <div className="flex flex-col gap-3 rounded-2xl border border-agri-border bg-white p-4 dark:border-border dark:bg-card sm:flex-row sm:items-center">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90">
            <Play className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-agri-border dark:bg-border">
              <div className="h-full w-0 rounded-full bg-primary" />
            </div>
            <span className="shrink-0 text-xs text-agri-muted dark:text-muted-foreground">
              0:00 / {tip.readTimeMinutes}:00
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {AUDIO_LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setAudioLang(lang)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  audioLang === lang
                    ? 'bg-primary text-white'
                    : 'bg-agri-hover text-agri-muted hover:text-agri-text dark:bg-muted dark:text-muted-foreground dark:hover:text-foreground'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content body */}
      <article className="prose prose-green max-w-none dark:prose-invert">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-base leading-relaxed text-agri-text dark:text-foreground"
          >
            {p}
          </p>
        ))}
      </article>

      {/* Steps */}
      {tip.steps.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-agri-text dark:text-foreground">
            Steps
          </h2>
          <div className="space-y-3">
            {tip.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 rounded-xl border border-agri-border bg-white p-4 dark:border-border dark:bg-card"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-agri-text dark:text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-agri-muted dark:text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tip.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tip.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-agri-hover px-3 py-1 text-xs font-medium text-agri-muted dark:bg-muted dark:text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 border-t border-agri-border pt-4 dark:border-border">
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-agri-border bg-white px-4 py-2.5 text-sm font-medium text-agri-text transition-colors hover:border-primary hover:text-primary dark:border-border dark:bg-card dark:text-foreground dark:hover:border-primary">
          <Bookmark className="h-4 w-4" />
          Save
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-xl border border-agri-border bg-white px-4 py-2.5 text-sm font-medium text-agri-text transition-colors hover:border-primary hover:text-primary dark:border-border dark:bg-card dark:text-foreground dark:hover:border-primary">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {/* Related tips */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-agri-text dark:text-foreground">
            Related Tips
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <TipCard tip={r} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
