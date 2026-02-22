'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Leaf } from 'lucide-react'

const navLinks = [
  { label: 'Market', href: '/market' },
  { label: 'Weather', href: '/weather' },
  { label: 'Tips', href: '/tips' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-stone-200'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#1B4332] flex items-center justify-center group-hover:bg-[#2D6A4F] transition-colors">
            <Leaf className="w-4 h-4 text-[#D8F3DC]" />
          </div>
          <span className="font-bold text-lg text-[#1B4332] tracking-tight">
            Agri<span className="text-[#2D6A4F]">Connect</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-stone-600 hover:text-[#1B4332] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-[#1B4332] hover:text-[#2D6A4F] transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-lg px-5 py-2 text-sm font-semibold transition-colors shadow-sm"
          >
            <Leaf className="w-3.5 h-3.5" />
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-stone-700 md:hidden"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-[#1B4332] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-[#1B4332] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#2D6A4F] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
