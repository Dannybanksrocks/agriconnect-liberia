'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { UserPlus, LayoutDashboard, TrendingUp } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your farm profile',
    description:
      'Select your county, crops, and farm size. FarmPulse personalises prices and forecasts to your exact location in minutes.',
    cta: 'Get started free',
    href: '/auth/register',
  },
  {
    number: '02',
    icon: LayoutDashboard,
    title: 'Access your dashboard',
    description:
      'See today\'s crop prices, a 7-day weather forecast, and the latest agronomy tips — on any device, even without internet.',
    cta: null,
    href: null,
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Make smarter decisions',
    description:
      'Sell at the right market, plant at the right time, and protect your harvest with data that used to be available only to large agribusinesses.',
    cta: null,
    href: null,
  },
]

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="w-full py-20 md:py-28 bg-[#F8F3E8]">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#2D6A4F] uppercase bg-[#D8F3DC] px-4 py-1.5 rounded-full mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E1A] tracking-tight">
            Up and running in minutes
          </h2>
          <p className="mt-3 text-lg text-stone-500">Three steps to a smarter farm</p>
        </div>

        {/* Steps */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector line — desktop only */}
          <div className="absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-stone-300 hidden md:block pointer-events-none" />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.18 }}
                className="relative flex flex-col items-start md:items-center md:text-center"
              >
                {/* Number circle */}
                <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20 mb-6">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-[10px] font-bold text-[#95D5B2] tracking-widest">{step.number}</span>
                    <Icon className="w-6 h-6 mt-0.5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#1A2E1A] mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>

                {step.cta && step.href && (
                  <Link
                    href={step.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
                  >
                    {step.cta} →
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
