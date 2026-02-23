'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, TrendingUp, CloudSun, Users, ArrowRight, ArrowUpRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

/* ── Decorative SVG leaf shapes ── */
function LeafBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M 0,100 C 0,44.8 44.8,0 100,0 C 155.2,0 200,44.8 200,100 C 200,155.2 155.2,200 100,200 C 44.8,200 0,155.2 0,100 Z"
        fill="currentColor"
      />
    </svg>
  )
}

function WheatIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M16 28V8M16 8C16 8 10 10 8 16M16 8C16 8 22 10 24 16M16 14C16 14 11 15 9 20M16 14C16 14 21 15 23 20M16 20C16 20 12 20.5 11 24M16 20C16 20 20 20.5 21 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Floating stat card ── */
function FloatStatCard({ icon: Icon, label, value, trend, delay }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  trend?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="flex-1 min-w-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-white"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#D8F3DC]" />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-[#D8F3DC]">
            <ArrowUpRight className="w-3 h-3" />{trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/60 mt-0.5">{label}</p>
    </motion.div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#1B4332] flex flex-col">
      {/* Background decorative blobs */}
      <LeafBlob className="absolute -top-32 -right-32 w-[500px] h-[500px] text-[#2D6A4F]/40 pointer-events-none" />
      <LeafBlob className="absolute -bottom-48 -left-48 w-[600px] h-[600px] text-[#143626]/60 pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Warm radial glow top-left */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(233,196,106,0.08) 0%, transparent 70%)' }}
      />

      <div className="container relative z-10 flex-1 flex flex-col justify-center pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left content */}
          <div className="text-center lg:text-left">

          {/* Headline */}
          <motion.h1
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.06]"
          >
            Empowering women farmers
            <span className="block mt-1 text-[#95D5B2]">
              to lead Liberia&apos;s food future
            </span>
          </motion.h1>

          {/* Wheat decoration */}
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center gap-6 my-6 text-[#52B788]/50"
          >
            <WheatIcon />
            <WheatIcon />
            <WheatIcon />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-base sm:text-lg md:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed"
          >
            Real-time market prices, county-level weather forecasts, and expert agronomy tips —
            a platform built to put knowledge and economic power in the hands of women farmers across Liberia.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={0.45}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
          >
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 bg-[#E9C46A] hover:bg-[#F4D58D] text-[#1B4332] font-bold px-8 py-4 rounded-xl text-base shadow-lg shadow-[#E9C46A]/20 transition-all"
            >
              Join as a Woman Farmer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white hover:bg-white/20 font-semibold px-8 py-4 rounded-xl text-base transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
              Shop Fresh Produce
            </Link>
          </motion.div>

          {/* Trust text and USSD */}
          <motion.p
            custom={0.55}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-5 text-sm text-white/60"
          >
            Trusted by 2,400+ women farmers across all 15 counties
          </motion.p>
          <motion.p
            custom={0.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-2 text-xs text-white/40"
          >
            Access via web, mobile app, or dial <span className="font-mono font-bold text-white/70">*347#</span> on any phone
          </motion.p>
          </div>

          {/* Right image */}
          <motion.div
            custom={0.6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src="/images/liberian-farmer.jpg"
                alt="Liberian farmer using mobile phone in rice field"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/60 to-transparent" />
            </div>
            
            {/* Floating badge on image */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-5 py-3 border border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#95D5B2] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#1B4332]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1B4332]">40%</p>
                  <p className="text-xs text-stone-500">Income Increase</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating stat cards */}
        <motion.div
          custom={0.65}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          <FloatStatCard icon={Users}       label="Women Farmers"     value="2,400+"  trend="+18%"   delay={0.7}  />
          <FloatStatCard icon={TrendingUp}  label="Counties Covered"  value="15"      delay={0.8}  />
          <FloatStatCard icon={Leaf}        label="Crops Tracked"     value="50+"     delay={0.9}  />
          <FloatStatCard icon={CloudSun}    label="Weather Forecasts" value="Daily"   delay={1.0}  />
        </motion.div>
      </div>

      {/* Bottom wave into next section */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 sm:h-14">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F8F3E8" />
        </svg>
      </div>
    </section>
  )
}
