'use client'

import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'
import { Facebook, Twitter, Instagram } from 'lucide-react'

const productLinks = [
  { label: 'Market Prices', href: '/market' },
  { label: 'Weather', href: '/weather' },
  { label: 'Tips', href: '/tips' },
  { label: 'My Farm', href: '/farm' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export default function LandingFooter() {
  return (
    <footer className="w-full bg-[#0F1A0F] text-white">
      <div className="container py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Left: Logo + tagline + social */}
          <div className="space-y-6">
            <Logo size="lg" variant="white" linkTo="/" />
            <p className="text-white/60 max-w-xs">
              Empowering Liberian farmers with technology
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary/20 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Center: Link columns */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-secondary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-secondary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: PoweredBy + copyright */}
          <div className="space-y-6">
            <PoweredBy />
            <p className="text-white/60 text-sm">
              &copy; 2025 Tech 231 Liberia Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <span>AgriConnect Liberia v1.0.0</span>
          <span>Innovation + Simplicity</span>
        </div>
      </div>
    </footer>
  )
}
