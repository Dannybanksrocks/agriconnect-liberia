'use client'

import { motion } from 'framer-motion'
import { Leaf, Target, Heart, Users, BarChart3, Globe } from 'lucide-react'
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

const values = [
  {
    icon: Target,
    title: 'Data-Driven Farming',
    description:
      'We believe every farmer deserves access to accurate market data, weather forecasts, and agronomic intelligence to make informed decisions.',
  },
  {
    icon: Heart,
    title: 'Farmer-First Design',
    description:
      'Everything we build starts with the Liberian smallholder farmer. Our platform works on low-bandwidth connections and supports USSD access.',
  },
  {
    icon: Users,
    title: 'Community Impact',
    description:
      'We partner with county agricultural offices, farmer cooperatives, and extension officers to ensure AgriHub reaches every community.',
  },
  {
    icon: BarChart3,
    title: 'Transparent Markets',
    description:
      'By making price data accessible to all, we level the playing field between smallholder farmers and large agribusinesses.',
  },
]

const stats = [
  { value: '2,400+', label: 'Active Farmers' },
  { value: '15', label: 'Counties Covered' },
  { value: '50+', label: 'Crops Tracked' },
  { value: '40%', label: 'Avg. Income Increase' },
]

const team = [
  { name: 'Abraham Johnson', role: 'Founder & CEO', initials: 'AJ' },
  { name: 'Grace Doe', role: 'Head of Content', initials: 'GD' },
  { name: 'Samuel Weah', role: 'Lead Engineer', initials: 'SW' },
  { name: 'Martha Kpangbah', role: 'County Operations', initials: 'MK' },
]

export default function AboutPage() {
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
                <Leaf className="w-3.5 h-3.5" />
                About AgriHub
              </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Empowering Liberian Farmers with Data
            </h1>
              <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                AgriHub is a platform built by Liberians, for Liberians. We provide smallholder farmers with the same market intelligence, weather data, and agronomic expertise once reserved for large agribusinesses.
              </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-[#0D2818]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="text-center"
              >
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 bg-[#F8F3E8]">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-[#1B4332] tracking-tight">Our Mission</h2>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              For too long, large agribusinesses had exclusive access to price data, weather forecasts, and agronomy expertise. AgriHub puts the same tools in every farmer&apos;s hands &mdash; for free. Our mission is to close the information gap in Liberian agriculture and help every farmer earn a fair price for their harvest.
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <Globe className="h-8 w-8 text-[#2D6A4F] mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Vision</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                A Liberia where every farmer has equal access to market data and agricultural intelligence, enabling food security and economic prosperity across all 15 counties.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <Target className="h-8 w-8 text-[#E9C46A] mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Goal</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Reach 10,000 active farmers by 2025 and expand coverage to all major markets in every county, including USSD access for farmers without smartphones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#1B4332] tracking-tight text-center"
          >
            Our Values
          </motion.h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.1}
                  className="rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
                    <Icon className="h-5 w-5 text-[#1B4332]" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{v.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{v.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#1B4332] tracking-tight">Our Team</h2>
            <p className="mt-3 text-gray-500">The people behind AgriHub Liberia</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.1}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#1B4332] flex items-center justify-center mx-auto text-white font-bold text-lg">
                  {member.initials}
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
