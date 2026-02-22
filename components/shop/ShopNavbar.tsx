'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useShopStore } from '@/lib/store/useShopStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function ShopNavbar() {
  const cartCount = useShopStore((s) => s.cartCount())
  const consumer = useShopStore((s) => s.consumer)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#1B4332] group-hover:bg-[#2D6A4F] flex items-center justify-center transition-colors">
              <Leaf className="w-4 h-4 text-[#D8F3DC]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#1B4332] tracking-tight">Agri <span className="text-[#2D6A4F]">Hub</span></span>
              <span className="text-xs bg-[#D8F3DC] text-[#1B4332] font-semibold px-1.5 py-0.5 rounded">Shop</span>
            </div>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search crops, farmers..."
                className="w-full pl-9 pr-4 h-10 rounded-full border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <Link href="/shop/products" className="hover:text-[#1B4332] transition">All Products</Link>
            <Link href="/shop/orders" className="hover:text-[#1B4332] transition">My Orders</Link>
            <Link href="/marketplace" className="hover:text-[#1B4332] transition text-[#2D6A4F]">Farmer View</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link href="/shop/cart" className="relative p-2 rounded-lg hover:bg-[#D8F3DC]/60 text-stone-700 transition">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#1B4332] text-white text-xs flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <Link
              href={consumer ? '/shop/account' : '/auth/login'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-medium transition"
            >
              <User className="w-4 h-4" />
              {consumer ? consumer.fullName.split(' ')[0] : 'Sign In'}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#D8F3DC]/60 text-stone-700 transition"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden pb-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  className="w-full pl-9 pr-4 h-10 rounded-full border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:border-[#2D6A4F]"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-stone-100"
            >
              <div className="py-3 space-y-0.5">
                {[
                  { label: 'All Products', href: '/shop/products' },
                  { label: 'My Orders', href: '/shop/orders' },
                  { label: 'My Account', href: '/shop/account' },
                  { label: 'Farmer View', href: '/marketplace' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-[#D8F3DC]/60 hover:text-[#1B4332] transition"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 px-4 pb-2">
                  <Link
                    href={consumer ? '/shop/account' : '/auth/login'}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition"
                  >
                    <User className="w-4 h-4" />
                    {consumer ? consumer.fullName.split(' ')[0] : 'Sign In'}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
