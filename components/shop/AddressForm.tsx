'use client'

import { useState } from 'react'
import { MapPin, Plus, Check } from 'lucide-react'
import { countyNames } from '@/lib/mock-data/counties'
import type { DeliveryAddress } from '@/lib/types/shop'

interface Props {
  onSave: (addr: DeliveryAddress) => void
  onCancel?: () => void
  initial?: Partial<DeliveryAddress>
}

export default function AddressForm({ onSave, onCancel, initial = {} }: Props) {
  const [form, setForm] = useState({ label: initial.label ?? 'Home', county: initial.county ?? '', district: initial.district ?? '', landmark: initial.landmark ?? '', phone: initial.phone ?? '', isDefault: initial.isDefault ?? false })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.county) e.county = 'Select your county'
    if (!form.landmark.trim()) e.landmark = 'Enter a landmark or street'
    if (!form.phone.trim()) e.phone = 'Enter a contact phone number'
    else if (!/^\d{8,10}$/.test(form.phone)) e.phone = 'Enter 8–10 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({ id: `addr-${Date.now()}`, ...form })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Label</label>
        <div className="flex gap-2">
          {['Home', 'Office', 'Other'].map((l) => (
            <button key={l} type="button" onClick={() => set('label', l)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${form.label === l ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >{l}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
        <select value={form.county} onChange={(e) => set('county', e.target.value)}
          className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-green-500 bg-white"
        >
          <option value="">Select county</option>
          {countyNames.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.county && <p className="text-xs text-red-500 mt-1">{errors.county}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">District / Area <span className="text-gray-400">(optional)</span></label>
        <input value={form.district} onChange={(e) => set('district', e.target.value)}
          className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-green-500"
          placeholder="e.g. Sinkor, Congo Town" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Landmark / Street</label>
        <input value={form.landmark} onChange={(e) => set('landmark', e.target.value)}
          className="w-full h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-green-500"
          placeholder="e.g. Near Total Gas Station" />
        {errors.landmark && <p className="text-xs text-red-500 mt-1">{errors.landmark}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 h-11 rounded-lg border border-gray-300 bg-gray-50 text-sm flex-shrink-0">
            <span>🇱🇷</span><span className="text-gray-600">+231</span>
          </div>
          <input value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
            className="flex-1 h-11 px-4 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-green-500"
            placeholder="770001234" />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => set('isDefault', e.target.checked)} className="accent-green-600 w-4 h-4" />
        <span className="text-sm text-gray-700">Set as default delivery address</span>
      </label>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
        )}
        <button type="button" onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition">
          <Check className="w-4 h-4" /> Save Address
        </button>
      </div>
    </div>
  )
}
