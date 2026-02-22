'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft, Clock, Calendar, Volume2, Bookmark,
  Share2, Check, Headphones, ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { getTipBySlug, getRelatedTips } from '@/lib/api/tips'
import type { AgronomyTip } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  rice: 'Rice',
  cassava: 'Cassava',
  vegetables: 'Vegetables',
  soil: 'Soil Health',
  'pest-control': 'Pest Control',
  'post-harvest': 'Post-Harvest',
}

const CATEGORY_COLORS: Record<string, string> = {
  rice: 'bg-yellow-100 text-yellow-800',
  cassava: 'bg-orange-100 text-orange-800',
  vegetables: 'bg-green-100 text-green-800',
  soil: 'bg-amber-100 text-amber-800',
  'pest-control': 'bg-red-100 text-red-800',
  'post-harvest': 'bg-purple-100 text-purple-800',
}

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  kpelle: 'Kpelle',
  bassa: 'Bassa',
  mende: 'Mende',
  vai: 'Vai',
}

export default function TipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  const [tip, setTip] = useState<AgronomyTip | null>(null)
  const [relatedTips, setRelatedTips] = useState<AgronomyTip[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [audioLang, setAudioLang] = useState('en')
  const [audioPlaying, setAudioPlaying] = useState(false)

  useEffect(() => {
    getTipBySlug(slug).then((found) => {
      if (!found) { router.push('/tips'); return }
      setTip(found)
      setLoading(false)
      const savedTips = JSON.parse(localStorage.getItem('agrihub_saved_tips') || '[]')
      setSaved(savedTips.includes(found.id))
      getRelatedTips(slug, found.category).then(setRelatedTips)
    })
  }, [slug, router])

  const handleSave = () => {
    if (!tip) return
    const savedTips: string[] = JSON.parse(localStorage.getItem('agrihub_saved_tips') || '[]')
    const updated = saved
      ? savedTips.filter((id) => id !== tip.id)
      : [...savedTips, tip.id]
    localStorage.setItem('agrihub_saved_tips', JSON.stringify(updated))
    setSaved(!saved)
    toast.success(saved ? 'Tip removed from saved' : 'Tip saved!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: tip?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleAudioPlay = () => {
    setAudioPlaying(!audioPlaying)
    if (!audioPlaying) {
      toast.success(`Playing audio in ${LANGUAGE_LABELS[audioLang] ?? audioLang}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!tip) return null

  const categoryLabel = CATEGORY_LABELS[tip.category] ?? tip.category
  const categoryColor = CATEGORY_COLORS[tip.category] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back */}
      <Link
        href="/tips"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Tips
      </Link>

      {/* Hero image */}
      <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden shadow-sm">
        <img
          src={tip.imageUrl}
          alt={tip.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&h=400&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}`}>
            {categoryLabel}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs font-semibold hover:bg-white/30 transition"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & meta */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{tip.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {tip.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(tip.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {tip.audioAvailable && (
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <Volume2 className="w-4 h-4" /> Audio available
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-xl bg-green-50 border border-green-200">
            <p className="text-green-800 text-sm leading-relaxed font-medium">{tip.summary}</p>
          </div>

          {/* Audio player */}
          {tip.audioAvailable && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Headphones className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-700">Audio Version</h3>
              </div>
              <div className="flex items-center gap-3 flex-wrap mb-4">
                <span className="text-xs text-gray-500 font-medium">Language:</span>
                {tip.languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => { setAudioLang(lang); setAudioPlaying(false) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      audioLang === lang
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {LANGUAGE_LABELS[lang] ?? lang}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <button
                  onClick={handleAudioPlay}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 transition ${
                    audioPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {audioPlaying ? (
                    <span className="flex gap-0.5">
                      <span className="w-1 h-3 bg-white rounded-sm" />
                      <span className="w-1 h-3 bg-white rounded-sm" />
                    </span>
                  ) : (
                    <ChevronRight className="w-5 h-5 ml-0.5" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-green-500 rounded-full transition-all duration-1000 ${
                        audioPlaying ? 'w-1/3' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400">{tip.readTimeMinutes}:00</span>
              </div>
            </div>
          )}

          {/* Full content */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Full Guide</h3>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {tip.content}
            </div>
          </div>

          {/* Step-by-step */}
          {tip.steps.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-5">Step-by-Step Guide</h3>
              <div className="space-y-5">
                {tip.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{step.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tip.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tip.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition ${
                saved
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {saved ? (
                <><Check className="w-4 h-4" /> Saved</>
              ) : (
                <><Bookmark className="w-4 h-4" /> Save Tip</>
              )}
            </button>
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Quick Info
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Category</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${categoryColor}`}>
                  {categoryLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Read time</span>
                <span className="font-medium">{tip.readTimeMinutes} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Steps</span>
                <span className="font-medium">{tip.steps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Audio</span>
                <span className={`font-medium ${tip.audioAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                  {tip.audioAvailable ? `${tip.languages.length} language(s)` : 'Not available'}
                </span>
              </div>
            </div>
          </div>

          {/* USSD callout */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-1">Offline Access</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Access agronomy tips offline via{' '}
              <span className="font-bold text-gray-700">*347#</span> on any Liberian phone.
            </p>
          </div>
        </div>
      </div>

      {/* Related tips */}
      {relatedTips.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Related Tips</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTips.map((rel) => (
              <Link
                key={rel.id}
                href={`/tips/${rel.slug}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-green-300 transition group"
              >
                <div className="h-32 overflow-hidden">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=200&fit=crop'
                    }}
                  />
                </div>
                <div className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[rel.category] ?? 'bg-gray-100 text-gray-700'}`}>
                    {CATEGORY_LABELS[rel.category] ?? rel.category}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-800 mt-2 line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rel.readTimeMinutes} min</span>
                    {rel.audioAvailable && (
                      <span className="flex items-center gap-1 text-green-500">
                        <Volume2 className="w-3.5 h-3.5" /> Audio
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
