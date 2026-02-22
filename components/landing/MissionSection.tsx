'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const benefits = [
  'Real-time prices across all 15 Liberian counties',
  'County-specific 7-day weather forecasts',
  'Offline-capable agronomy guides in local languages',
  'USSD access on any phone — no internet needed',
  'Personalised alerts for your specific crops',
  'Completely free for all registered farmers',
]

export default function MissionSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full py-20 md:py-28 bg-[#F8F3E8]">
      <div className="container">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — visual */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative bg-[#1B4332] rounded-3xl p-8 shadow-2xl shadow-[#1B4332]/20 overflow-hidden">
              {/* Background pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
                  backgroundSize: '28px 28px',
                }}
              />
              {/* Gold glow */}
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 100% 0%, rgba(233,196,106,0.15) 0%, transparent 70%)' }}
              />

              <div className="relative z-10">
                <p className="text-[#95D5B2] text-xs font-bold uppercase tracking-widest mb-2">Our Mission</p>
                <h3 className="text-2xl font-extrabold text-white leading-snug mb-4">
                  Giving every Liberian farmer the data advantage
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  For too long, large agribusinesses had exclusive access to price data, weather forecasts, and agronomy expertise. 
                  AgriHub puts the same tools in every farmer&apos;s hands — for free.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[#E9C46A]">40%</p>
                    <p className="text-xs text-white/50 mt-0.5">Avg. income increase</p>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[#E9C46A]">3×</p>
                    <p className="text-xs text-white/50 mt-0.5">Better price discovery</p>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[#E9C46A]">15</p>
                    <p className="text-xs text-white/50 mt-0.5">Counties covered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating quote card */}
            <div className="absolute -bottom-12 -right-4 lg:-right-8 bg-white border border-stone-200 rounded-2xl px-5 py-4 shadow-lg max-w-[240px] z-20">
              <p className="text-xs text-stone-600 italic leading-relaxed">
                &ldquo;I earned L$8,000 more on my rice harvest after using AgriHub.&rdquo;
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-6 h-6 rounded-full bg-[#1B4332] text-white text-[9px] font-bold flex items-center justify-center">FK</div>
                <p className="text-[10px] text-stone-500 font-medium">Fatu K. — Bong County</p>
              </div>
            </div>
          </motion.div>

          {/* Right — benefits */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#2D6A4F] uppercase bg-[#D8F3DC] px-4 py-1.5 rounded-full mb-4">
              Why AgriHub
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E1A] tracking-tight leading-snug mb-4">
              Built for Liberia.
              <span className="block text-[#2D6A4F]">Designed for farmers.</span>
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-8">
              Every feature is tailored to the realities of Liberian agriculture — from USSD access on basic phones to county-level pricing that reflects your local market.
            </p>

            <ul className="space-y-3 mb-10">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] mt-0.5 flex-shrink-0" />
                  <span className="text-stone-700 text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold px-7 py-3.5 rounded-xl text-sm shadow-md shadow-[#1B4332]/20 transition-all"
            >
              Join 2,400+ Farmers
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
