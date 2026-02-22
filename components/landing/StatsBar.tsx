'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  value: string
  suffix: string
  label: string
  numericValue: number
}

const stats: Stat[] = [
  { value: '2,400', suffix: '+', label: 'Farmers', numericValue: 2400 },
  { value: '15', suffix: '', label: 'Counties', numericValue: 15 },
  { value: '50', suffix: '+', label: 'Crops Tracked', numericValue: 50 },
  { value: '99.9', suffix: '%', label: 'Uptime', numericValue: 99.9 },
  { value: '2.8', suffix: 'M+', label: 'Informed Sales', numericValue: 2.8 },
]

function useCountUp(target: number, isInView: boolean, duration = 2000) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * target)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return count
}

function StatItem({ stat, index, isInView }: { stat: Stat; index: number; isInView: boolean }) {
  const count = useCountUp(stat.numericValue, isInView)

  const formatValue = () => {
    if (stat.numericValue === 2400) return count.toLocaleString('en-US', { maximumFractionDigits: 0 })
    if (stat.numericValue === 99.9) return count.toFixed(1)
    if (stat.numericValue === 2.8) return count.toFixed(1)
    return Math.round(count).toString()
  }

  const prefix = stat.numericValue === 2.8 ? 'L$' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center gap-1 px-6 py-4"
    >
      <span className="text-3xl md:text-4xl font-bold text-agri-text">
        {prefix}{formatValue()}{stat.suffix}
      </span>
      <span className="text-sm text-agri-muted">{stat.label}</span>
    </motion.div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="w-full bg-white py-10 md:py-14">
      <div className="container">
        {/* Desktop: flex row with dividers */}
        <div className="hidden md:flex items-center justify-center divide-x divide-agri-border">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Mobile: 2-col grid */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
