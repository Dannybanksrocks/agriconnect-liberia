'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Leaf, ChevronDown } from 'lucide-react'

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
      { label: 'AI Crop Advisor', href: '/ai-advisor' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Market Prices', href: '/market' },
      { label: 'Inventory', href: '/inventory' },
      { label: 'Weather Forecasts', href: '/weather' },
      { label: 'Agronomy Tips', href: '/tips' },
      { label: 'My Farm', href: '/my-farm' },
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
      { label: 'USSD Guide', href: '/resources/ussd' },
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

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1B4332] transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

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
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`}
                    />
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
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="space-y-1">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-[#1B4332] transition-colors block"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href!}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-[#1B4332] transition-colors block"
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
