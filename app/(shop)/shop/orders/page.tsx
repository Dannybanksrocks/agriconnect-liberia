'use client'

import Link from 'next/link'
import { ShoppingBag, ChevronRight, Clock, CheckCircle, Truck, Package } from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:    { label: 'Pending',    color: 'text-amber-600 bg-amber-50 border-amber-200',      icon: Clock },
  confirmed:  { label: 'Confirmed',  color: 'text-blue-600 bg-blue-50 border-blue-200',         icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-purple-600 bg-purple-50 border-purple-200',   icon: Package },
  shipped:    { label: 'Shipped',    color: 'text-[#2D6A4F] bg-[#D8F3DC] border-[#52B788]/40', icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-[#1B4332] bg-[#D8F3DC] border-[#52B788]/50', icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'text-red-600 bg-red-50 border-red-200',            icon: Package },
}

export default function OrdersPage() {
  const orders = useShopStore((s) => s.orders)

  if (orders.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center">
        <ShoppingBag className="w-9 h-9 text-stone-400" />
      </div>
      <h2 className="text-xl font-bold text-stone-800">No orders yet</h2>
      <p className="text-stone-500 text-sm">Start shopping to see your orders here.</p>
      <Link href="/shop/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#2D6A4F] transition">
        Browse Products
      </Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
          const StatusIcon = cfg.icon
          const total = order.items.reduce((s: number, i: any) => s + i.pricePerUnitLRD * i.quantity, 0)

          return (
            <div key={order.id} className="bg-white rounded-2xl border border-stone-200 hover:shadow-md transition overflow-hidden">
              <div className="p-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-stone-400 mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString('en-LR', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                </span>
              </div>

              <div className="px-5 pb-4 flex gap-3 overflow-x-auto scrollbar-none">
                {order.items.map((item: any) => (
                  <div key={item.listingId} className="flex-shrink-0 flex items-center gap-2 bg-stone-50 rounded-xl px-3 py-2 border border-stone-100">
                    <span className="text-xl">{item.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold text-stone-700">{item.cropName}</p>
                      <p className="text-xs text-stone-400">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-sm font-bold text-[#1B4332]">L${total.toLocaleString()}</span>
                <Link href={`/shop/orders/${order.id}`} className="flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-[#1B4332] transition">
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
