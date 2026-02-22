'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, CloudSun, BookOpen, ShoppingCart } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    tag: 'Market Intelligence',
    title: 'Know Your Prices Before You Travel',
    description:
      'Compare crop prices across all 15 counties in real time. Never leave the farm without knowing exactly where to sell for the highest return.',
    cta: 'View Market Prices',
    href: '/market',
    accent: '#D8F3DC',
    image: '/images/liberia-market-scene.jpg',
  },
  {
    icon: ShoppingCart,
    tag: 'Direct Marketplace',
    title: 'Connect Directly With Buyers',
    description:
      'List your produce and connect with verified buyers across Liberia. No middlemen. Better prices. Mobile money payments go straight to your wallet.',
    cta: 'Browse Marketplace',
    href: '/marketplace',
    accent: '#D8F3DC',
    image: '/images/farmer-checking-phone.jpg',
  },
  {
    icon: CloudSun,
    tag: 'Weather Intelligence',
    title: 'Plan Every Season With Confidence',
    description:
      'County-specific 7-day forecasts with planting windows and rainfall alerts. Know precisely when to sow, irrigate, and harvest.',
    cta: 'Check Weather',
    href: '/weather',
    accent: '#FEF9E7',
    image: null,
  },
  {
    icon: BookOpen,
    tag: 'Agronomy Knowledge',
    title: 'Expert Tips In Your Language',
    description:
      "Step-by-step farming guides for Liberia's most important crops — offline-capable, with audio in local dialects.",
    cta: 'Browse Tips',
    href: '/tips',
    accent: '#D8F3DC',
    image: null,
  },
]

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full py-20 md:py-28 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#2D6A4F] uppercase bg-[#D8F3DC] px-4 py-1.5 rounded-full mb-4">
            Platform Features
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E1A] tracking-tight">
            Everything a Liberian farmer needs
          </h2>
          <p className="mt-3 text-lg text-stone-500 max-w-xl mx-auto">
            Powerful data tools built specifically for the Liberian agricultural context
          </p>
        </div>

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.13 }}
                className="group relative bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top colour accent strip */}
                <div
                  className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full z-10"
                  style={{ backgroundColor: feature.accent === '#FEF9E7' ? '#E9C46A' : '#52B788' }}
                />

                {/* Image if available */}
                {feature.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}

                <div className="p-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: feature.accent }}
                  >
                    <Icon className="w-5 h-5 text-[#1B4332]" />
                  </div>

                  <p className="text-xs font-bold text-[#2D6A4F] tracking-widest uppercase mb-2">
                    {feature.tag}
                  </p>
                  <h3 className="text-lg font-bold text-[#1A2E1A] mb-3 leading-snug">{feature.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-6">{feature.description}</p>

                  <Link
                    href={feature.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D6A4F] group-hover:text-[#1B4332] transition-colors"
                  >
                    {feature.cta}
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
