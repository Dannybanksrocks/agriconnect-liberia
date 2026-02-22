'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingCart, CheckCircle, Truck } from 'lucide-react'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import ProductCard from '@/components/shop/ProductCard'

const CATEGORIES = [
  { label: 'Rice & Grains', emoji: '🌾', filter: ['Rice', 'Maize', 'Corn'] },
  { label: 'Root Crops', emoji: '🥔', filter: ['Cassava', 'Yam', 'Sweet Potato', 'Cocoyam'] },
  { label: 'Vegetables', emoji: '🥦', filter: ['Tomato', 'Okra', 'Cabbage', 'Eggplant', 'Hot Pepper', 'Pepper', 'Onion'] },
  { label: 'Fruits', emoji: '🍌', filter: ['Plantain', 'Banana', 'Watermelon', 'Pineapple'] },
  { label: 'Cash Crops', emoji: '🌿', filter: ['Rubber', 'Cocoa', 'Coffee', 'Palm Oil'] },
  { label: 'All Products', emoji: '🛒', filter: [] },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Browse Fresh Produce', desc: 'Browse listings from verified Liberian farmers. Filter by crop, county, or price.', icon: '🔍' },
  { step: '2', title: 'Add to Cart & Choose Fulfillment', desc: 'Select delivery, pickup, bulk order, or a recurring weekly box.', icon: '🛒' },
  { step: '3', title: 'Pay with Mobile Money', desc: 'Checkout securely with MTN MoMo (Lonestar) or Orange Money. Payment goes directly to the farmer.', icon: '📱' },
]

export default function ShopHomePage() {
  const featured = marketplaceListings.filter((l) => l.status === 'available').slice(0, 4)
  const newest = marketplaceListings.filter((l) => l.status === 'available').slice(4, 10)

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B4332] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-[#D8F3DC] text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" /> Verified Liberian Farmers · No Middlemen
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Fresh Produce<br />
            <span className="text-[#74C69D]">Delivered to Your Door</span>
          </h1>
          <p className="text-lg text-[#D8F3DC]/80 max-w-xl mx-auto mb-8">
            Buy directly from farmers across all 15 Liberian counties. Better prices. Pay with MTN MoMo or Orange Money.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop/products" className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#1B4332] font-bold text-base hover:bg-[#D8F3DC] transition shadow-lg">
              <ShoppingCart className="w-5 h-5" /> Shop Now
            </Link>
            <Link href="/marketplace" className="flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition text-sm">
              Farmer View <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-[#74C69D]">
            <div className="flex items-center gap-2"><span className="text-yellow-400 font-bold">MTN</span> MoMo Accepted</div>
            <span className="text-[#52B788]">·</span>
            <div className="flex items-center gap-2"><span className="text-orange-400 font-bold">Orange</span> Money Accepted</div>
            <span className="text-[#52B788]">·</span>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4" /> Nationwide Delivery</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href="/shop/products"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-stone-100 hover:border-[#52B788]/50 hover:shadow-md transition group text-center"
            >
              <span className="text-4xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-xs font-semibold text-stone-700 group-hover:text-[#1B4332]">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">Featured Listings</h2>
          <Link href="/shop/products" className="text-sm text-[#1B4332] font-semibold hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((l) => <ProductCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-stone-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">How It Works</h2>
          <p className="text-stone-500 mb-10">Order fresh produce from your phone in 3 easy steps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#D8F3DC] border border-[#52B788]/30 flex items-center justify-center text-3xl mb-4">{s.icon}</div>
                <div className="w-6 h-6 rounded-full bg-[#1B4332] text-white text-xs font-bold flex items-center justify-center mb-3">{s.step}</div>
                <h3 className="font-bold text-stone-800 mb-2">{s.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
            <span className="text-base">📱</span> No smartphone? Dial <strong className="mx-1">*347#</strong> on any Liberian phone to order via USSD
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">New Arrivals</h2>
          <Link href="/shop/products" className="text-sm text-[#1B4332] font-semibold hover:underline flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newest.map((l) => <ProductCard key={l.id} listing={l} />)}
        </div>
      </section>

      {/* Register CTA */}
      <section className="bg-[#1B4332] text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Are you a farmer? List your produce here</h2>
          <p className="text-[#D8F3DC]/80 mb-7">Join AgriHub Liberia and reach buyers across all 15 counties. Free to list. Pay when you sell.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="px-7 py-3 rounded-full bg-white text-[#1B4332] font-bold hover:bg-[#D8F3DC] transition">
              Register as Farmer
            </Link>
            <Link href="/auth/register" className="px-7 py-3 rounded-full border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition">
              Create Consumer Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
