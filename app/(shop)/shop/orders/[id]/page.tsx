'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShoppingBag, Clock, CheckCircle, Truck, Package,
  MapPin, CreditCard, ChevronLeft,
} from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'
import BackButton from '@/components/shared/BackButton'
import type { OrderStatus } from '@/lib/types/shop'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending:            { label: 'Pending',          color: 'text-amber-600 bg-amber-50 border-amber-200',      icon: Clock },
  placed:             { label: 'Placed',            color: 'text-amber-600 bg-amber-50 border-amber-200',      icon: Clock },
  confirmed:          { label: 'Confirmed',         color: 'text-blue-600 bg-blue-50 border-blue-200',         icon: CheckCircle },
  processing:         { label: 'Processing',        color: 'text-purple-600 bg-purple-50 border-purple-200',   icon: Package },
  shipped:            { label: 'Shipped',           color: 'text-[#2D6A4F] bg-[#D8F3DC] border-[#52B788]/40', icon: Truck },
  'out-for-delivery': { label: 'Out for Delivery',  color: 'text-[#2D6A4F] bg-[#D8F3DC] border-[#52B788]/40', icon: Truck },
  delivered:          { label: 'Delivered',         color: 'text-[#1B4332] bg-[#D8F3DC] border-[#52B788]/50', icon: CheckCircle },
  cancelled:          { label: 'Cancelled',         color: 'text-red-600 bg-red-50 border-red-200',            icon: Package },
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const orders = useShopStore((s) => s.orders)

  const order = orders.find((o) => o.id === id)

  if (!order) {
    router.push('/shop/orders')
    return null
  }

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const StatusIcon = cfg.icon
  const total = order.items.reduce((s, i) => s + i.pricePerUnitLRD * i.quantity, 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto px-4 pt-4"><BackButton href="/shop/orders" label="Back to Orders" /></div>

      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-800">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-LR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.color}`}>
            <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
          </span>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <p className="text-sm font-semibold text-stone-700">Items Ordered</p>
          </div>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.listingId} className="flex items-center gap-4 px-5 py-4">
                <span className="text-3xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 text-sm">{item.cropName}</p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {item.quantity} {item.unit} · by {item.farmerName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#1B4332]">
                    L${(item.pricePerUnitLRD * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-xs text-stone-400">L${item.pricePerUnitLRD}/{item.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
          <p className="text-sm font-semibold text-stone-700 mb-4">Order Summary</p>
          <div className="flex justify-between text-sm text-stone-600">
            <span>Subtotal</span>
            <span>L${total.toLocaleString()}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-stone-600">
              <span>Delivery fee</span>
              <span>L${order.deliveryFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-stone-800 pt-2 border-t border-stone-100">
            <span>Total</span>
            <span className="text-[#1B4332]">L${order.totalLRD.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment & delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-stone-400" />
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Payment</p>
            </div>
            <p className="text-sm text-stone-700 capitalize">{order.paymentMethod.replace('-', ' ')}</p>
            <p className="text-xs text-stone-400 mt-1">{order.mobileMoneyNumber}</p>
            <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
              order.paymentStatus === 'paid'
                ? 'bg-green-100 text-green-700'
                : order.paymentStatus === 'failed'
                ? 'bg-red-100 text-red-600'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </div>

          {order.deliveryAddress && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-stone-400" />
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Delivery Address</p>
              </div>
              <p className="text-sm font-medium text-stone-700">{order.deliveryAddress.label}</p>
              <p className="text-xs text-stone-400 mt-1">
                {order.deliveryAddress.district}, {order.deliveryAddress.county}
              </p>
              <p className="text-xs text-stone-400">{order.deliveryAddress.landmark}</p>
            </div>
          )}
        </div>

        {/* Status history */}
        {order.statusHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <p className="text-sm font-semibold text-stone-700 mb-4">Status History</p>
            <div className="space-y-3">
              {order.statusHistory.map((event, i) => {
                const evtCfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.pending
                const EvtIcon = evtCfg.icon
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border ${evtCfg.color}`}>
                      <EvtIcon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">{evtCfg.label}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(event.timestamp).toLocaleString('en-LR', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                      {event.note && <p className="text-xs text-stone-500 mt-0.5">{event.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
