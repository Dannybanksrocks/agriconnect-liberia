'use client'

import Link from 'next/link'
import { Package, ChevronRight } from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'
import { sampleOrders } from '@/lib/mock-data/shop-orders'

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-yellow-100 text-yellow-700',
  'out-for-delivery': 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  placed: 'Order Placed', confirmed: 'Confirmed', 'out-for-delivery': 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
}

const FULFILLMENT_LABELS: Record<string, string> = {
  delivery: '🚚 Delivery', pickup: '📍 Pickup', bulk: '📦 Bulk', scheduled: '🔄 Recurring',
}

export default function OrdersPage() {
  const storeOrders = useShopStore((s) => s.orders)
  const allOrders = [...storeOrders, ...sampleOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  if (allOrders.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-3xl">📦</div>
      <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
      <p className="text-gray-500 text-sm">Your orders will appear here once you've made a purchase.</p>
      <Link href="/shop/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm">
        <Package className="w-4 h-4" /> Start Shopping
      </Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="space-y-4">
        {allOrders.map((order) => (
          <Link key={order.id} href={`/shop/orders/${order.id}`}
            className="block bg-white rounded-2xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-sm transition group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <span className="text-sm font-bold text-gray-900 font-mono">{order.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-xs text-gray-400">{FULFILLMENT_LABELS[order.fulfillmentType]}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {order.items.map((item) => (
                    <span key={item.listingId} className="text-sm text-gray-600">
                      {item.emoji} {item.cropName} × {item.quantity} {item.unit}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span className="font-semibold text-green-700 text-sm">L${order.totalLRD.toLocaleString()}</span>
                  <span>{order.paymentMethod === 'mtn-momo' ? '🟡 MTN MoMo' : '🟠 Orange Money'}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 flex-shrink-0 mt-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
