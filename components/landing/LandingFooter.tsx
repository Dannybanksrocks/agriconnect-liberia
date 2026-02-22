'use client'

import Link from 'next/link'
import { Leaf, Facebook, Twitter, Instagram } from 'lucide-react'
import PoweredBy from '@/components/shared/PoweredBy'

const productLinks = [
  { label: 'Market Prices', href: '/market' },
  { label: 'Marketplace (Farmers)', href: '/marketplace' },
  { label: 'Shop Fresh Produce', href: '/shop' },
  { label: 'Weather Forecasts', href: '/weather' },
  { label: 'Agronomy Tips', href: '/tips' },
  { label: 'AI Crop Advisor', href: '/ai-advisor' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

const resourceLinks = [
  { label: 'USSD Guide (*347#)', href: '/resources/ussd' },
  { label: 'Farmer Guide', href: '/resources/guide' },
  { label: 'Admin Portal', href: '/admin/dashboard' },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export default function LandingFooter() {
  return (
    <footer className="w-full bg-[#0D2818] text-white">
      <div className="container py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-5">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#95D5B2]" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Agri<span className="text-[#95D5B2]">Hub</span>
              </span>
            </Link>

            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              Empowering Liberian farmers with real-time data — market prices, weather forecasts, and expert guidance.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white/60" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Powered by */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-5">Resources</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="opacity-60 hover:opacity-100 transition-opacity">
              <PoweredBy />
            </div>
          </div>
        </div>

        {/* USSD mini callout */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="font-mono text-2xl font-extrabold text-[#E9C46A]">*347#</div>
            <p className="text-xs text-white/40">
              Dial from any phone · No smartphone or internet required<br />
              Available on MTN, Orange &amp; Lonestar
            </p>
          </div>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors border border-[#2D6A4F]"
          >
            <Leaf className="w-3.5 h-3.5 text-[#95D5B2]" />
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div className="flex flex-col gap-2">
            <span>&copy; 2026 Tech 231 Liberia Limited. All rights reserved.</span>
            <div className="flex items-center gap-2 text-white/40">
              <img src="/images/ministry-commerce-liberia.jpg" alt="Ministry" className="w-4 h-4 rounded-full" />
              <span>Supported by Ministry of Commerce & Industry, Republic of Liberia</span>
            </div>
          </div>
          <span>AgriHub Liberia v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
