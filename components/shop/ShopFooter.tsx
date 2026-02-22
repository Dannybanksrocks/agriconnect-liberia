import Link from 'next/link'
import { Leaf, Phone, MessageCircle } from 'lucide-react'

export default function ShopFooter() {
  return (
    <footer className="bg-[#1B4332] text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#D8F3DC]" />
              </div>
              <span className="font-bold text-white tracking-tight">Agri <span className="text-[#74C69D]">Hub</span> <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-semibold">Shop</span></span>
            </div>
            <p className="text-[#74C69D]/80 text-sm leading-relaxed">
              Fresh produce from verified Liberian farmers. No middlemen. Better prices. Pay with MTN MoMo or Orange Money.
            </p>
            <div className="flex gap-3 mt-5">
              <div className="px-3 py-1.5 rounded-lg bg-yellow-500 text-black text-xs font-bold">MTN MoMo</div>
              <div className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-bold">Orange Money</div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-[#74C69D]/80">
              {['Rice & Grains', 'Vegetables', 'Root Crops', 'Fruits', 'Cash Crops', 'All Products'].map((c) => (
                <li key={c}>
                  <Link href="/shop/products" className="hover:text-white transition">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-[#74C69D]/80">
              {[
                { label: 'How to Order', href: '/shop' },
                { label: 'Track My Order', href: '/shop/orders' },
                { label: 'Payment Guide', href: '/shop' },
                { label: 'Farmer Marketplace', href: '/marketplace' },
                { label: 'Agronomy Tips', href: '/tips' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-white transition">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact & USSD</h4>
            <div className="space-y-3 text-sm text-[#74C69D]/80">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#74C69D] flex-shrink-0" />
                <span>+231 770 000 001</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#74C69D] flex-shrink-0" />
                <span>WhatsApp support available</span>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-white/10 border border-white/10">
                <p className="text-xs text-white/70 font-medium">Offline Access</p>
                <p className="text-lg font-bold text-[#74C69D] mt-0.5">*347#</p>
                <p className="text-xs text-white/40 mt-0.5">Any Liberian phone · MTN or Orange</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2025 Tech 231 Liberia Limited · Built for the Ministry of Commerce & Industry</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white/70 transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white/70 transition">Privacy</Link>
            <Link href="/about" className="hover:text-white/70 transition">About</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
