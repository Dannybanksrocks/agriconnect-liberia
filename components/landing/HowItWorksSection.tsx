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
      'Select your county, crops, and farm size to get personalized insights.',
  },
  {
    icon: Smartphone,
    number: 2,
    title: 'Access your dashboard',
    description:
      'View real-time prices, weather forecasts, and expert tips tailored to your farm.',
  },
  {
    icon: Coins,
    number: 3,
    title: 'Make informed decisions',
    description:
      'Sell at the right time, plan your planting season, and maximize your income.',
  },
]

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="w-full py-20 md:py-28 bg-primary-50/50 dark:bg-primary-900/10">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-text mb-3">
            How It Works
          </h2>
          <p className="text-lg text-agri-muted">
            Get started in three simple steps
          </p>
        </div>

        <div ref={ref} className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-primary/20 hidden md:block" />

            <div className="space-y-12 md:space-y-16">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Number circle */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>

                    <div className="pt-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold text-agri-text">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-agri-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
