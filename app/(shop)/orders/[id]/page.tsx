'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageCircle, ExternalLink, Package, CreditCard, MapPin } from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'
import { sampleOrders } from '@/lib/mock-data/shop-orders'
import OrderStatusTimeline from '@/components/shop/OrderStatusTimeline'
import type { Order } from '@/lib/types/shop'

const USD_RATE = 189
const PAYMENT_LABELS: Record<string, string> = { 'mtn-momo': 'MTN MoMo (Lonestar)', 'orange-money': 'Orange Money' }

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const storeOrders = useShopStore((s) => s.orders)
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const found = [...storeOrders, ...sampleOrders].find((o) => o.id === id)
    setOrder(found ?? null)
  }, [id, storeOrders])

  if (!order) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <p className="text-gray-500 text-sm">Order not found.</p>
      <Link href="/shop/orders" className="text-green-600 font-medium hover:underline">← My Orders</Link>
    </div>
  )

  const firstItem = order.items[0]
  const whatsappMsg = encodeURIComponent(`Hi, I have an AgriHub order ${order.id} for ${firstItem.cropName}. Can you confirm the status?`)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href="/shop/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
        <ChevronLeft className="w-4 h-4" /> My Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-gray-400">Order ID</p>
            <p className="font-bold text-gray-900 font-mono text-lg">{order.id}</p>
            <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <a href={`https://wa.me/${firstItem.farmerPhone.replace(/\D/g,'')}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-semibold transition">
            <MessageCircle className="w-4 h-4" /> Contact Farmer <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tracking */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Order Tracking</h2>
          <OrderStatusTimeline status={order.status} history={order.statusHistory} />
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.listingId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.emoji} {item.cropName}</p>
                    <p className="text-xs text-gray-500">{item.quantity} {item.unit} · {item.farmerName.split(' ')[0]} {item.farmerName.split(' ')[1]?.[0]}.</p>
                  </div>
                  <span className="font-semibold text-gray-900">L${(item.pricePerUnitLRD * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5 text-sm">
              {order.deliveryFee > 0 && <div className="flex justify-between text-gray-500"><span>Delivery fee</span><span>L${order.deliveryFee}</span></div>}
              <div className="flex justify-between font-bold text-gray-900"><span>Total</span><span className="text-green-700">L${order.totalLRD.toLocaleString()}</span></div>
              <p className="text-xs text-gray-400">≈ ${order.totalUSD} USD</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Payment</h3>
            <div className="text-sm space-y-1.5 text-gray-600">
              <div className="flex justify-between"><span>Method</span><span className="font-medium text-gray-900">{PAYMENT_LABELS[order.paymentMethod]}</span></div>
              <div className="flex justify-between"><span>Number</span><span className="font-mono text-gray-900">{order.mobileMoneyNumber}</span></div>
              <div className="flex justify-between"><span>Status</span><span className={`font-semibold ${order.paymentStatus === 'paid' ? 'text-green-600' : order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span></div>
            </div>
          </div>

          {/* Delivery address */}
          {order.deliveryAddress && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> Delivery Address</h3>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p className="font-semibold text-gray-900">{order.deliveryAddress.label}</p>
                <p>{order.deliveryAddress.county}{order.deliveryAddress.district && ` · ${order.deliveryAddress.district}`}</p>
                <p>{order.deliveryAddress.landmark}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
