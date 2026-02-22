'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Globe, TrendingUp, CloudSun, ArrowUpRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
}

function DashboardMockup() {
  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
      {/* Mock browser bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-300" />
          <div className="w-3 h-3 rounded-full bg-yellow-300" />
          <div className="w-3 h-3 rounded-full bg-green-300" />
        </div>
        <div className="flex-1 mx-4 h-6 rounded-md bg-gray-200 flex items-center px-3">
          <span className="text-xs text-gray-400">app.agriconnect.lr/dashboard</span>
        </div>
      </div>
      {/* Dashboard content */}
      <div className="p-5 bg-white">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Rice Price', value: 'L$320/kg', trend: '+2.4%', positive: true },
            { label: 'Weather', value: '29°C', trend: 'Partly Cloudy', positive: true },
            { label: 'Active Alerts', value: '3', trend: 'Unread', positive: false },
            { label: 'Saved Tips', value: '7', trend: 'Articles', positive: true },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-gray-100 p-3 bg-white">
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-base font-bold text-gray-900">{s.value}</p>
              <p className={`text-xs mt-0.5 flex items-center gap-0.5 ${s.positive ? 'text-green-600' : 'text-amber-600'}`}>
                {s.positive && <ArrowUpRight className="h-3 w-3" />}
                {s.trend}
              </p>
            </div>
          ))}
        </div>
        {/* Charts row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-700">Market Prices</p>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex items-end gap-1 h-14">
              {[40, 55, 45, 70, 65, 80, 75, 90, 85, 100, 88, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-green-100" style={{ height: `${h}%` }}>
                  <div className="w-full rounded-sm bg-green-500" style={{ height: `${Math.min(h, 55)}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-700">Weather</p>
              <CloudSun className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex flex-col gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu'].map((d, i) => (
                <div key={d} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 w-7">{d}</span>
                  <div className="flex-1 mx-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-green-400" style={{ width: `${[70, 40, 85, 60][i]}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700">{[29, 27, 30, 28][i]}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="w-full bg-white pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-1.5 text-sm font-medium text-green-700">
              <Globe className="h-3.5 w-3.5" />
              Supported by Ministry of Commerce &amp; Industry
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={0.1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.08] max-w-4xl"
          >
            The Smart Farming
            <br />
            Platform for Liberia
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            custom={0.25}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed"
          >
            Real-time market prices, accurate weather forecasts, and expert
            agronomy tips — accessible on any phone, in your language.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={0.4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/auth/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-sm transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="#how-it-works"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Trust text */}
          <motion.p
            custom={0.5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-5 text-sm text-gray-400"
          >
            Trusted by 2,400+ farmers across Liberia
          </motion.p>

          {/* Dashboard mockup */}
          <motion.div
            custom={0.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 w-full"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
