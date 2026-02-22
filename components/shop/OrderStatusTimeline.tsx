'use client'

import { Check } from 'lucide-react'
import type { OrderStatus } from '@/lib/types/shop'

const STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', desc: 'Your order has been submitted' },
  { status: 'confirmed', label: 'Confirmed', desc: 'Farmer confirmed your order' },
  { status: 'out-for-delivery', label: 'Out for Delivery', desc: 'Rider is on the way' },
  { status: 'delivered', label: 'Delivered', desc: 'Order successfully delivered' },
]

const ORDER_INDEX: Record<OrderStatus, number> = {
  placed: 0, confirmed: 1, 'out-for-delivery': 2, delivered: 3, cancelled: -1,
}

interface Props {
  status: OrderStatus
  history: { status: OrderStatus; timestamp: string; note?: string }[]
}

export default function OrderStatusTimeline({ status, history }: Props) {
  const currentIdx = ORDER_INDEX[status]

  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">✕</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
          <p className="text-xs text-red-500 mt-0.5">{history.find((h) => h.status === 'cancelled')?.note ?? 'This order was cancelled.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const pending = i > currentIdx
        const event = history.find((h) => h.status === step.status)

        return (
          <div key={step.status} className="flex gap-4">
            {/* Line + dot */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done ? 'bg-green-600' : active ? 'bg-green-600 ring-4 ring-green-100' : 'bg-gray-100 border-2 border-gray-200'}`}>
                {done ? (
                  <Check className="w-4 h-4 text-white" />
                ) : active ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-0.5 h-12 mt-1 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>

            {/* Content */}
            <div className="pb-8 flex-1">
              <p className={`text-sm font-semibold ${pending ? 'text-gray-400' : 'text-gray-900'}`}>{step.label}</p>
              {event ? (
                <>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(event.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {event.note && <p className="text-xs text-green-600 mt-0.5">{event.note}</p>}
                </>
              ) : (
                <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
