'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, CloudSun, BookOpen } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Market Prices',
    description:
      'Compare crop prices across all 15 counties in real time. Know the best market before you travel — never undersell your harvest again.',
    cta: 'View Prices',
    href: '/market',
  },
  {
    icon: CloudSun,
    title: 'Weather Forecasts',
    description:
      'County-specific 7-day forecasts with agricultural alerts. Know exactly when to plant, irrigate, and harvest for maximum yield.',
    cta: 'Check Weather',
    href: '/weather',
  },
  {
    icon: BookOpen,
    title: 'Agronomy Tips',
    description:
      "Step-by-step farming guides for Liberia's most important crops — available offline, with audio support in local languages.",
    cta: 'Browse Tips',
    href: '/tips',
  },
]

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full py-20 md:py-28 bg-white">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest text-green-600 uppercase mb-4">
            Platform Features
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Everything a Liberian farmer needs
          </h2>
          <p className="mt-3 text-lg text-gray-500 max-w-xl mx-auto">
            Powerful tools designed specifically for the Liberian agricultural context
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="rounded-xl bg-green-50 p-3 w-12 h-12 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 text-sm">{feature.description}</p>
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  {feature.cta} →
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
