'use client'

import { Check } from 'lucide-react'
import type { MobileMoneyProvider } from '@/lib/types/shop'

const PROVIDERS = [
  { id: 'mtn-momo' as MobileMoneyProvider, label: 'MTN MoMo (Lonestar)', color: 'bg-yellow-400', textColor: 'text-yellow-900', border: 'border-yellow-400', desc: 'Available nationwide · Lonestar Cell' },
  { id: 'orange-money' as MobileMoneyProvider, label: 'Orange Money', color: 'bg-orange-400', textColor: 'text-white', border: 'border-orange-400', desc: 'Orange Liberia · Available nationwide' },
]

interface Props {
  value: MobileMoneyProvider | ''
  onChange: (v: MobileMoneyProvider) => void
  phone?: string
  phoneOnChange?: (v: string) => void
  phoneError?: string
}

export default function PaymentMethodSelector({ value, onChange, phone = '', phoneOnChange, phoneError }: Props) {
  return (
    <div className="space-y-3">
      {PROVIDERS.map((p) => {
        const active = value === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${active ? `${p.border} bg-white shadow-sm` : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color} flex-shrink-0`}>
              <span className={`text-xs font-bold ${p.textColor}`}>{p.id === 'mtn-momo' ? 'MTN' : '🟠'}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{p.label}</p>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </div>
            {active && <Check className="w-5 h-5 text-green-600 flex-shrink-0" />}
          </button>
        )
      })}

      {value && (
        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {value === 'mtn-momo' ? 'MTN' : 'Orange'} Mobile Money Number
          </label>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 text-sm flex-shrink-0">
              <span>🇱🇷</span> <span className="text-gray-600">+231</span>
            </div>
            <input
              className="flex-1 h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="770001234"
              value={phone}
              onChange={(e) => phoneOnChange?.(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
        </div>
      )}
    </div>
  )
}
