'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sprout, Smartphone, Coins } from 'lucide-react'

const steps = [
  {
    icon: Sprout,
    number: 1,
    title: 'Create your farm profile',
    description:
      'Select your county, crops, and farm size to get personalized market prices and weather alerts tailored to your location.',
  },
  {
    icon: Smartphone,
    number: 2,
    title: 'Access your dashboard',
    description:
      'View real-time prices, 7-day weather forecasts, and expert agronomy tips — on any device, even offline.',
  },
  {
    icon: Coins,
    number: 3,
    title: 'Make informed decisions',
    description:
      'Sell at the right time, plan your planting season, and maximize your income with data-backed insights.',
  },
]

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="w-full py-20 md:py-28 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest text-green-600 uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Get started in three simple steps
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-start"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-base">
                    {step.number}
                  </div>
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
