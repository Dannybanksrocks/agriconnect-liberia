'use client'

import { Check, MapPin, Package, Truck, Calendar } from 'lucide-react'
import type { FulfillmentType } from '@/lib/types/shop'

const OPTIONS: { id: FulfillmentType; label: string; desc: string; icon: any; badge?: string }[] = [
  { id: 'delivery', icon: Truck, label: 'Home Delivery', desc: 'Rider delivers to your address', badge: '+L$150 fee' },
  { id: 'pickup', icon: MapPin, label: "Pickup from Farm", desc: "Collect at farmer's location — no delivery fee", badge: 'Free' },
  { id: 'bulk', icon: Package, label: 'Bulk / Wholesale', desc: 'Large quantity order with minimum quantity', badge: 'Min qty applies' },
  { id: 'scheduled', icon: Calendar, label: 'Recurring Order', desc: 'Weekly, bi-weekly, or monthly delivery', badge: 'Auto-renews' },
]

interface Props {
  value: FulfillmentType
  onChange: (v: FulfillmentType) => void
}

export default function FulfillmentSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon
        const active = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${active ? 'border-[#1B4332] bg-[#D8F3DC]/40' : 'border-stone-200 bg-white hover:border-stone-300'}`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-[#1B4332]' : 'bg-stone-100'}`}>
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-stone-500'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${active ? 'text-[#1B4332]' : 'text-stone-800'}`}>{opt.label}</p>
              <p className="text-xs text-stone-500 mt-0.5">{opt.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              {opt.badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${active ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-stone-100 text-stone-600'}`}>
                  {opt.badge}
                </span>
              )}
              {active && <Check className="w-4 h-4 text-[#1B4332] flex-shrink-0" />}
            </div>
          </button>
        )
      })}
    </div>
  )
}
