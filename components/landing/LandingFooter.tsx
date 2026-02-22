'use client'

import Link from 'next/link'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'
import { Facebook, Twitter, Instagram } from 'lucide-react'

const productLinks = [
  { label: 'Market Prices', href: '/market' },
  { label: 'Weather', href: '/weather' },
  { label: 'Agronomy Tips', href: '/tips' },
  { label: 'My Farm', href: '/my-farm' },
]

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
]

const resourceLinks = [
  { label: 'USSD Guide (*347#)', href: '#' },
  { label: 'Farmer Handbook', href: '#' },
  { label: 'Admin Portal', href: '/admin/dashboard' },
]

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export default function LandingFooter() {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-5">
            <Logo size="lg" variant="white" linkTo="/" />
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Empowering Liberian farmers with technology — market prices, weather, and expert guidance.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gray-300" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + PoweredBy */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-3">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <PoweredBy />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <span>&copy; 2025 Tech 231 Liberia Limited. All rights reserved.</span>
          <span>AgriConnect Liberia v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
