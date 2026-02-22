'use client'

import Link from 'next/link'
import { ShoppingBag, ChevronRight, Clock, CheckCircle, Truck, PackageCheck, TrendingUp } from 'lucide-react'

const MOCK_ORDERS = [
  { id: 'ORD-8821', buyer: 'Mary Kollie', crop: '🌾 Rice', qty: '50 kg', totalLRD: 16000, status: 'pending',   time: '2h ago'      },
  { id: 'ORD-8817', buyer: 'John Dolo',   crop: '🥔 Cassava', qty: '80 kg', totalLRD: 9600,  status: 'confirmed', time: '5h ago'      },
  { id: 'ORD-8809', buyer: 'Sia Kamara',  crop: '🌶️ Pepper', qty: '20 kg', totalLRD: 7000,  status: 'shipped',   time: 'Yesterday'   },
  { id: 'ORD-8800', buyer: 'George Wolo', crop: '🍌 Plantain', qty: '100 kg', totalLRD: 18000, status: 'delivered', time: '2 days ago' },
  { id: 'ORD-8795', buyer: 'Fatu Barclay',crop: '🌾 Rice', qty: '30 kg', totalLRD: 9600,  status: 'delivered', time: '3 days ago' },
]

const STATUS_CFG: Record<string, { label: string; cls: string; icon: any }> = {
  pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700 border-amber-200',       icon: Clock },
  confirmed: { label: 'Confirmed', cls: 'bg-blue-50 text-blue-700 border-blue-200',          icon: CheckCircle },
  shipped:   { label: 'Shipped',   cls: 'bg-[#D8F3DC] text-[#2D6A4F] border-[#52B788]/40',  icon: Truck },
  delivered: { label: 'Delivered', cls: 'bg-[#D8F3DC] text-[#1B4332] border-[#52B788]/50',  icon: PackageCheck },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200',             icon: Clock },
}

const SUMMARY = [
  { label: 'New Orders',    value: '3',          sub: 'Last 7 days',    icon: ShoppingBag,  color: 'bg-amber-50 text-amber-600'   },
  { label: 'Revenue',       value: 'L$60,200',   sub: 'This month',     icon: TrendingUp,   color: 'bg-[#D8F3DC] text-[#1B4332]' },
  { label: 'Delivered',     value: '12',         sub: 'All time',       icon: PackageCheck, color: 'bg-[#D8F3DC] text-[#2D6A4F]' },
]

export default function ShopOrdersWidget() {
  return (
    <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-800">Shop Orders</h3>
            <p className="text-xs text-stone-400">Buyers ordering your produce</p>
          </div>
        </div>
        <Link href="/shop/orders" className="flex items-center gap-1 text-xs text-[#1B4332] font-semibold hover:underline">
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 divide-x divide-stone-100">
        {SUMMARY.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="px-4 py-3 text-center">
              <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-1.5`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-base font-extrabold text-stone-800">{s.value}</p>
              <p className="text-xs text-stone-400 leading-tight">{s.label}</p>
              <p className="text-xs text-stone-300">{s.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Recent orders */}
      <div className="divide-y divide-stone-50">
        {MOCK_ORDERS.slice(0, 4).map((order) => {
          const cfg = STATUS_CFG[order.status]
          const Icon = cfg.icon
          return (
            <div key={order.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50 transition">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">{order.id}</span>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500 truncate">{order.buyer}</span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">{order.crop} · {order.qty} · {order.time}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-[#1B4332]">L${order.totalLRD.toLocaleString()}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.cls}`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
        <Link href="/inventory" className="text-xs text-stone-500 hover:text-[#1B4332] transition flex items-center gap-1">
          Manage your listings in Inventory <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}
