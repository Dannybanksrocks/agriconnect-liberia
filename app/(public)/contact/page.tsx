'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { toast } from 'sonner'
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

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@tech231liberialtd.com',
    href: 'mailto:info@tech231liberialtd.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+231 888 999 334 / +231 880 209 996',
    href: 'tel:+2318889993334',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Neezoe Community, Paynesville, P.O. Box 1362, Monrovia, Liberia',
    href: undefined,
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon - Fri: 8am - 5pm',
    href: undefined,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setSending(true)

    // Store to localStorage
    const contacts = JSON.parse(localStorage.getItem('agrihub_contacts') || '[]')
    contacts.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('agrihub_contacts', JSON.stringify(contacts))

    setTimeout(() => {
      setSending(false)
      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 800)
  }

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
              Contact Us
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Have questions about AgriHub? Want to partner with us? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Reach out to us through any of these channels or fill the form.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  const content = (
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-[#D8F3DC] flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-[#1B4332]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">{info.label}</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{info.value}</p>
                      </div>
                    </div>
                  )
                  return info.href ? (
                    <a key={info.label} href={info.href}>
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  )
                })}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              className="lg:col-span-3"
            >
              <div className="rounded-2xl border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contactEmail"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData((p) => ({ ...p, subject: e.target.value }))}
                      placeholder="How can we help?"
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Tell us more about your question or feedback..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                  >
                    {sending ? (
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
