'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Cloud, BookOpen } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    title: 'Market Prices',
    subtitle: 'Know the price before you sell',
    description:
      'Compare crop prices across all 15 counties in real time. Never undersell your harvest again.',
    cta: 'View Prices →',
    href: '/market',
  },
  {
    icon: Cloud,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    title: 'Weather Forecasts',
    subtitle: 'Plan your season with confidence',
    description:
      'County-specific 7-day forecasts with agricultural alerts. Know when to plant, when to harvest.',
    cta: 'Check Weather →',
    href: '/weather',
  },
  {
    icon: BookOpen,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary-dark',
    title: 'Agronomy Tips',
    subtitle: 'Expert guidance in your language',
    description:
      'Step-by-step farming guides for Liberia\'s most important crops — available offline, with audio.',
    cta: 'Browse Tips →',
    href: '/tips',
  },
]

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full py-20 md:py-28 bg-agri-bg">
      <div className="container">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-text mb-3">
            Everything you need to farm smarter
          </h2>
          <p className="text-lg text-agri-muted max-w-xl mx-auto">
            Powerful tools designed specifically for Liberian farmers
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group rounded-2xl p-8 bg-white shadow-sm border border-agri-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-full ${feature.iconBg} flex items-center justify-center mb-5`}
                >
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                <h3 className="text-xl font-bold text-agri-text mb-1">{feature.title}</h3>
                <p className="text-sm font-medium text-primary mb-3">{feature.subtitle}</p>
                <p className="text-agri-muted leading-relaxed mb-6">{feature.description}</p>

                <Link
                  href={feature.href}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                >
                  {feature.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
