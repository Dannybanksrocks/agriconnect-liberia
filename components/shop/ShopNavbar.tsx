'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useShopStore } from '@/lib/store/useShopStore'

export default function ShopNavbar() {
  const cartCount = useShopStore((s) => s.cartCount())
  const consumer = useShopStore((s) => s.consumer)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">AgriHub</span>
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-1.5 py-0.5 rounded ml-1.5">Shop</span>
            </div>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops, farmers..."
                className="w-full pl-9 pr-4 h-10 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/shop/products" className="hover:text-green-700 transition">All Products</Link>
            <Link href="/shop/orders" className="hover:text-green-700 transition">My Orders</Link>
            <Link href="/marketplace" className="hover:text-green-700 transition text-green-600">Farmer View</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition">
              <Search className="w-5 h-5" />
            </button>

            <Link href="/shop/cart" className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <Link
              href={consumer ? '/shop/account' : '/shop/auth/login'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition"
            >
              <User className="w-4 h-4" />
              {consumer ? consumer.fullName.split(' ')[0] : 'Sign In'}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crops..."
                className="w-full pl-9 pr-4 h-10 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-green-500"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
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
                className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-green-700 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
