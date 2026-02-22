'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Phone, Hash, ArrowRight } from 'lucide-react'
import Navbar from '@/components/shared/Navbar'
import LandingFooter from '@/components/landing/LandingFooter'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const ussdMenu = [
  {
    option: '1',
    label: 'Market Prices',
    description: 'Check the latest crop prices in your county',
    sub: [
      '1.1 - Rice prices',
      '1.2 - Cassava prices',
      '1.3 - All crops',
      '1.4 - Prices by county',
    ],
  },
  {
    option: '2',
    label: 'Weather Forecast',
    description: 'Get today\'s weather for your county',
    sub: [
      '2.1 - Today\'s weather',
      '2.2 - 3-day forecast',
      '2.3 - Rain alert',
    ],
  },
  {
    option: '3',
    label: 'Agronomy Tips',
    description: 'Quick farming tips sent to your phone',
    sub: [
      '3.1 - Tip of the day',
      '3.2 - Crop-specific advice',
      '3.3 - Pest alerts',
    ],
  },
  {
    option: '4',
    label: 'My Account',
    description: 'Manage your AgriHub profile',
    sub: [
      '4.1 - My farm details',
      '4.2 - Alert settings',
      '4.3 - Change language',
    ],
  },
]

export default function USSDGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-[#1B4332] overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Phone className="w-3.5 h-3.5" />
              USSD Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Access AgriHub via USSD
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              No smartphone? No internet? No problem. Dial <span className="text-white font-mono font-bold">*347#</span> from any phone to access AgriHub.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How to dial */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
            <h2 className="text-3xl font-bold text-[#1B4332] tracking-tight">How to Get Started</h2>
            <p className="mt-3 text-gray-500">Three simple steps to access AgriHub on any phone</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { step: '1', title: 'Dial *347#', desc: 'Open your phone dialer and type *347# then press Call' },
                { step: '2', title: 'Select an Option', desc: 'Choose from Market Prices, Weather, Tips, or Account' },
                { step: '3', title: 'Get Information', desc: 'Receive instant agricultural data right on your phone screen' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="rounded-2xl border border-gray-200 p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[#1B4332] flex items-center justify-center mx-auto text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Simulated phone screen */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-sm mx-auto mb-16"
            >
              <div className="rounded-3xl bg-gray-900 p-4 shadow-2xl">
                <div className="rounded-2xl bg-[#1B4332] p-6 text-white font-mono text-sm">
                  <p className="text-green-300 font-bold mb-3">AgriHub Liberia</p>
                  <p className="text-white/70 mb-4">Welcome to AgriHub! Select an option:</p>
                  <div className="space-y-2 text-white/90">
                    <p>1. Market Prices</p>
                    <p>2. Weather Forecast</p>
                    <p>3. Agronomy Tips</p>
                    <p>4. My Account</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-white/50" />
                    <span className="text-white/50">Reply with 1, 2, 3, or 4</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Menu details */}
            <h3 className="text-2xl font-bold text-[#1B4332] text-center mb-8">USSD Menu Options</h3>
            <div className="space-y-6">
              {ussdMenu.map((menu, i) => (
                <motion.div
                  key={menu.option}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="rounded-2xl border border-gray-200 p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#D8F3DC] flex items-center justify-center shrink-0">
                      <span className="text-[#1B4332] font-bold">{menu.option}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900">{menu.label}</h4>
                      <p className="text-xs text-gray-500">{menu.description}</p>
                    </div>
                  </div>
                  <div className="ml-14 space-y-2">
                    {menu.sub.map((sub) => (
                      <p key={sub} className="text-sm text-gray-600 font-mono bg-gray-50 rounded-lg px-3 py-2">
                        {sub}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F8F3E8]">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-[#1B4332]">Prefer the full experience?</h2>
            <p className="mt-2 text-gray-600">Create a free account to access all features</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
              >
                <Leaf className="w-4 h-4" />
                Sign Up Free
              </Link>
              <Link
                href="/resources/guide"
                className="inline-flex items-center gap-2 border border-gray-300 hover:bg-white text-gray-700 font-medium px-6 py-3 rounded-xl transition text-sm"
              >
                Farmer Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
