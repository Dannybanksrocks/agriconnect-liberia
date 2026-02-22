'use client'

import Link from 'next/link'
import { User, ShoppingBag, MapPin, Heart, Settings, LogOut, ChevronRight, Leaf } from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'

export default function AccountPage() {
  const consumer = useShopStore((s) => s.consumer)
  const orders = useShopStore((s) => s.orders)
  const savedItems = useShopStore((s) => s.savedItems)
  const addresses = useShopStore((s) => s.addresses)

  if (!consumer) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#D8F3DC] flex items-center justify-center">
        <Leaf className="w-9 h-9 text-[#1B4332]" />
      </div>
      <h2 className="text-xl font-bold text-stone-800">Sign in to your account</h2>
      <p className="text-stone-500 text-sm">Track orders, save addresses, and manage your preferences.</p>
      <div className="flex flex-col gap-3">
        <Link href="/auth/login" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#2D6A4F] transition">
          Sign In
        </Link>
        <Link href="/auth/register" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-stone-200 text-stone-700 font-medium hover:bg-stone-50 transition text-sm">
          Create Account
        </Link>
      </div>
    </div>
  )

  const MENU_ITEMS = [
    { icon: ShoppingBag, label: 'My Orders', sub: `${orders.length} order${orders.length !== 1 ? 's' : ''}`, href: '/shop/orders' },
    { icon: Heart, label: 'Saved Items', sub: `${savedItems.length} item${savedItems.length !== 1 ? 's' : ''}`, href: '/shop/products' },
    { icon: MapPin, label: 'Delivery Addresses', sub: `${addresses.length} saved`, href: '/shop/cart' },
    { icon: Settings, label: 'Account Settings', sub: 'Language, notifications', href: '/dashboard/settings' },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {consumer.fullName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-stone-800 text-lg truncate">{consumer.fullName}</h2>
          <p className="text-sm text-stone-500">+231 {consumer.phone}</p>
          {consumer.county && <p className="text-xs text-[#2D6A4F] mt-0.5">{consumer.county}</p>}
        </div>
        <User className="w-5 h-5 text-stone-300 flex-shrink-0" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Orders', value: orders.length },
          { label: 'Saved', value: savedItems.length },
          { label: 'Addresses', value: addresses.length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-100 p-4 text-center">
            <p className="text-2xl font-extrabold text-[#1B4332]">{s.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition">
              <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#1B4332]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800">{item.label}</p>
                <p className="text-xs text-stone-400">{item.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </Link>
          )
        })}
      </div>

      {/* Sign out */}
      <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-sm font-medium transition">
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  )
}
