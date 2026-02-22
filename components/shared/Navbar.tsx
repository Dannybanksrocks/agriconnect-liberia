'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 shadow-sm backdrop-blur-md dark:bg-card/90'
          : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Logo
          size="md"
          variant={scrolled ? 'default' : 'white'}
        />

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
              scrolled
                ? 'text-agri-text hover:bg-agri-hover dark:text-foreground dark:hover:bg-muted'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary-dark hover:shadow-md"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`rounded-lg p-2 md:hidden ${
            scrolled
              ? 'text-agri-text dark:text-foreground'
              : 'text-white'
          }`}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-agri-border bg-white p-4 shadow-lg dark:border-border dark:bg-card md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-3 text-sm font-medium text-agri-text transition-colors hover:bg-agri-hover dark:text-foreground dark:hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-secondary px-4 py-3 text-center text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary-dark"
              onClick={() => setMobileOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
