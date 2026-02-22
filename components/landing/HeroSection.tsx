'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

const tickerItems = [
  '🌾 Rice Montserrado L$320/kg ↑2.4%',
  '🥬 Okra Bong L$75/kg ↓1.2%',
  '🍫 Cocoa Nimba L$385/kg ↑5.1%',
  '🌶️ Hot Pepper Margibi L$195/kg ↑1.8%',
  '🥔 Cassava Lofa L$48/kg ↓0.9%',
  '🥜 Groundnut Grand Bassa L$185/kg ↑3.2%',
  '🌴 Palm Oil Bong L$220/kg ↑2.7%',
  '🍠 Sweet Potato Nimba L$72/kg ↓1.5%',
]

const tickerText = tickerItems.join(' | ')

const floatingElements = [
  { emoji: '🌿', className: 'top-[18%] left-[8%] float-delay-0' },
  { emoji: '🍃', className: 'top-[30%] right-[12%] float-delay-150' },
  { emoji: '💰', className: 'bottom-[28%] left-[15%] float-delay-300' },
  { emoji: '🌱', className: 'top-[55%] right-[8%] float-delay-220' },
]

const headlineWords = ['Farm', 'Smarter.', 'Earn', 'More.']

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-[#1B5E20] via-[#2E7D32] to-[#0D47A1]">
      {/* Dot pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] hero-dot-pattern" />

      {/* Leaf vein SVG overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
        aria-hidden="true"
      >
        <pattern
          id="hero-leaves"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 100C20 100 30 60 60 40C80 28 100 30 100 20"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M60 40C50 55 35 70 20 100"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
            opacity="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#hero-leaves)" />
      </svg>

      {/* Floating decorative elements */}
      {floatingElements.map((el) => (
        <div
          key={el.emoji}
          className={`pointer-events-none absolute animate-float text-3xl md:text-4xl select-none opacity-[0.15] ${el.className}`}
          aria-hidden="true"
        >
          {el.emoji}
        </div>
      ))}

      {/* Radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-20 hero-radial-glow"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 pb-28 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/20 backdrop-blur-md">
            <Globe className="size-4 text-white/70" />
            Supported by Ministry of Commerce &amp; Industry, Republic of
            Liberia
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-5xl font-bold tracking-tight text-white md:text-7xl"
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={word + i}
              variants={wordVariants}
              className={i === 1 ? 'block w-full md:inline md:w-auto' : ''}
            >
              {word}
              {i === 1 && (
                <span className="block md:hidden" aria-hidden="true" />
              )}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          custom={0.9}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
        >
          Real-time market prices, accurate weather forecasts, and expert
          agronomy tips — accessible on any phone, in your language.
        </motion.p>

        {/* CTA row */}
        <motion.div
          custom={1.2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            href="/auth/register"
            className="inline-flex items-center justify-center rounded-xl bg-secondary px-8 py-4 text-base font-semibold text-secondary-foreground shadow-lg shadow-black/20 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started Free
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50 active:scale-[0.98]"
          >
            Watch Demo
          </Link>
        </motion.div>
      </div>

      {/* Scrolling ticker */}
      <div className="relative z-10 w-full border-t border-white/10 bg-black/15 backdrop-blur-sm">
        <div className="overflow-hidden py-3">
          <div className="flex w-max animate-ticker whitespace-nowrap">
            <span className="px-8 text-sm font-medium text-white/70">
              {tickerText}
            </span>
            <span className="px-8 text-sm font-medium text-white/70">
              {tickerText}
            </span>
          </div>
        </div>
      </div>

      {/* Built by Tech 231 */}
      <div className="relative z-10 flex items-center justify-center gap-1.5 bg-black/10 py-2.5">
        <span className="text-xs text-white/50">Built by</span>
        <Image
          src="/logo.png"
          alt="Tech 231 Liberia Ltd"
          width={20}
          height={20}
          className="opacity-60"
        />
        <span className="text-xs font-medium text-white/50">
          Tech 231 Liberia Ltd
        </span>
      </div>
    </section>
  )
}
