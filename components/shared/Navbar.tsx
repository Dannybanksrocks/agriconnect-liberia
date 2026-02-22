'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Leaf, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DropdownItem {
  label: string
  href: string
}

interface NavItem {
  label: string
  href?: string
  children?: DropdownItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Product',
    children: [
      { label: 'Market Prices', href: '/market' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Shop (Consumer)', href: '/shop' },
      { label: 'Weather Forecasts', href: '/weather' },
      { label: 'Agronomy Tips', href: '/tips' },
      { label: 'AI Crop Advisor', href: '/ai-advisor' },
      { label: 'USSD Guide', href: '/resources/ussd' },
    ],
  },
  {
    label: 'Company',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Mission', href: '/about#mission' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: 'Admin Portal', href: '/admin' },
      { label: 'Farmer Guide', href: '/resources/guide' },
      { label: 'USSD Access', href: '/resources/ussd' },
      { label: 'API Docs', href: '/resources/api' },
    ],
  },
]

function DropdownMenu({
  items,
  isOpen,
  onClose,
}: {
  items: DropdownItem[]
  isOpen: boolean
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg origin-top-left"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between relative">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="block h-0.5 w-full bg-[#1B4332] rounded-full origin-center"
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
        className="block h-0.5 w-full bg-[#1B4332] rounded-full"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="block h-0.5 w-full bg-[#1B4332] rounded-full origin-center"
      />
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev)
    setMobileExpanded(null)
  }

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
            Agri <span className="text-[#2D6A4F]">Hub</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-stone-600 hover:text-[#1B4332] transition-colors rounded-lg"
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.span>
                  </button>
                  <DropdownMenu
                    items={item.children}
                    isOpen={openDropdown === item.label}
                    onClose={() => setOpenDropdown(null)}
                  />
                </>
              ) : (
                <Link
                  href={item.href!}
                  className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-[#1B4332] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
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
          onClick={toggleMobile}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center md:hidden overflow-hidden transition-colors hover:bg-[#D8F3DC]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <motion.div
            animate={mobileOpen ? { backgroundColor: '#D8F3DC' } : { backgroundColor: 'transparent' }}
            className="absolute inset-0 rounded-xl"
          />
          <div className="relative z-10">
            <HamburgerIcon isOpen={mobileOpen} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-stone-200 bg-white md:hidden"
          >
            <div className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#1B4332] hover:bg-[#D8F3DC]/60 transition-colors"
                      >
                        <span>{item.label}</span>
                        <motion.span
                          animate={{ rotate: mobileExpanded === item.label ? 180 : 0 }}
                          transition={{ duration: 0.22 }}
                          className="inline-flex"
                        >
                          <ChevronDown className="w-4 h-4 text-[#2D6A4F]" />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 pl-3 border-l-2 border-[#D8F3DC] mb-1 mt-0.5 flex flex-col gap-0.5">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="px-3 py-2.5 rounded-lg text-sm text-stone-600 hover:bg-[#D8F3DC] hover:text-[#1B4332] transition-colors block"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#1B4332] hover:bg-[#D8F3DC]/60 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-xl bg-[#1B4332] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <Leaf className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
