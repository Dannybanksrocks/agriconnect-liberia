'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Leaf, BookOpen, TrendingUp, Cloud, Sprout, Phone,
  ArrowRight, CheckCircle2,
} from 'lucide-react'
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

const steps = [
  {
    icon: Phone,
    title: '1. Create Your Account',
    description:
      'Sign up with your phone number and tell us about your farm. It takes less than 2 minutes. You can also register via USSD by dialing *347#.',
  },
  {
    icon: TrendingUp,
    title: '2. Check Market Prices',
    description:
      'View real-time prices for all major crops across Liberia. Filter by county, crop, and date to find the best market for your harvest.',
  },
  {
    icon: Cloud,
    title: '3. Monitor Weather',
    description:
      'Get county-specific weather forecasts including rain predictions, temperature, and agricultural advisories to plan your planting and harvest.',
  },
  {
    icon: BookOpen,
    title: '4. Learn Agronomy Tips',
    description:
      'Access expert guides on crop management, pest control, soil preparation, and post-harvest techniques written specifically for Liberian conditions.',
  },
  {
    icon: Sprout,
    title: '5. Track Your Farm',
    description:
      'Add your crops, monitor their growth stages, and get personalized price alerts when market conditions change for the crops you grow.',
  },
]

const features = [
  'Real-time market prices for 50+ crops',
  'County-level weather forecasts',
  'Expert agronomy tips in multiple languages',
  'Price change alerts via SMS',
  'USSD access for basic phones (*347#)',
  'Farm tracking and crop management',
  'CSV export of market data',
  'Free for all Liberian farmers',
]

export default function FarmerGuidePage() {
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
              <BookOpen className="w-3.5 h-3.5" />
              Farmer Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Getting Started with FarmPulse
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              A step-by-step guide to help you get the most out of FarmPulse Liberia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center shrink-0">
                    <Icon className="h-6 w-6 text-[#1B4332]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features list */}
      <section className="py-20 bg-[#F8F3E8]">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-[#1B4332] tracking-tight text-center mb-12">
              What You Get with FarmPulse
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-200"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900">Ready to start?</h2>
            <p className="mt-2 text-gray-500">Join 2,400+ farmers already using FarmPulse</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
              >
                <Leaf className="w-4 h-4" />
                Get Started Free
              </Link>
              <Link
                href="/resources/ussd"
                className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition text-sm"
              >
                USSD Guide
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
