'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface Stat {
  numericValue: number
  suffix: string
  label: string
  decimals?: number
}

const stats: Stat[] = [
  { numericValue: 2400, suffix: '+',  label: 'Farmers Registered' },
  { numericValue: 15,   suffix: '',   label: 'Counties Covered'         },
  { numericValue: 50,   suffix: '+',  label: 'Crops Tracked'            },
  { numericValue: 99.9, suffix: '%',  label: 'Platform Uptime', decimals: 1 },
  { numericValue: 2.8,  suffix: 'M+', label: 'Farmer Sales',  decimals: 1 },
]

function useCountUp(target: number, isInView: boolean, duration = 1600, decimals = 0) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)
  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true
    const startTime = performance.now()
    const step = (t: number) => {
      const p = Math.min((t - startTime) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCount(e * target)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])
  return decimals ? count.toFixed(decimals) : Math.round(count).toLocaleString('en-US')
}

function StatItem({ stat, index, isInView }: { stat: Stat; index: number; isInView: boolean }) {
  const display = useCountUp(stat.numericValue, isInView, 1600, stat.decimals)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center gap-1.5 px-6 py-6"
    >
      <span className="text-3xl md:text-4xl font-extrabold text-[#1B4332]">
        {display}{stat.suffix}
      </span>
      <span className="text-sm font-medium text-stone-500">{stat.label}</span>
    </motion.div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} className="w-full bg-[#F8F3E8] py-4 md:py-2 border-y border-stone-200">
      <div className="container">
        <div className="hidden md:flex items-stretch justify-center divide-x divide-stone-300">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-0 md:hidden divide-stone-200">
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
