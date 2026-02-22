'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Leaf, Check, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import { registerConsumer } from '@/lib/auth-consumer'
import { countyNames } from '@/lib/mock-data/counties'

const inputClass = 'w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'
const errorClass = 'text-xs text-red-500 mt-1'

export default function ConsumerRegisterPage() {
  const router = useRouter()
  const setConsumer = useShopStore((s) => s.setConsumer)
  const [step, setStep] = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
    county: '', landmark: '',
  })

  const set = (k: string, v: string) => { setForm((f) => ({ ...f, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n }) }

  const validate = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required'
      if (!form.phone.trim()) e.phone = 'Phone number is required'
      else if (!/^\d{8,10}$/.test(form.phone)) e.phone = 'Enter 8–10 digits'
      if (!form.password) e.password = 'Password is required'
      else if (form.password.length < 6) e.password = 'Minimum 6 characters'
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }
    if (s === 2) {
      if (!form.county) e.county = 'Please select your county'
      if (!form.landmark.trim()) e.landmark = 'Enter a landmark for delivery'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => { if (validate(step)) setStep(2) }

  const handleRegister = async () => {
    if (!validate(2)) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const result = registerConsumer({ fullName: form.fullName, phone: `+231${form.phone}`, email: form.email || undefined, password: form.password, county: form.county, landmark: form.landmark })
    setLoading(false)
    if (!result.success || !result.user) { toast.error(result.error ?? 'Registration failed'); return }
    setConsumer(result.user)
    toast.success(`Welcome, ${form.fullName.split(' ')[0]}! 🌱`)
    router.push('/shop')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-green-600 flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Create Consumer Account</h1>
          <p className="text-sm text-gray-500 mt-1">Buy directly from Liberian farmers</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2">
          {[1, 2].map((s) => (
            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-green-600' : 'bg-gray-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Step 1 of 2 — Account Details</p>
            <div><label className={labelClass}>Full Name</label><input className={inputClass} placeholder="e.g. Mary Johnson" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />{errors.fullName && <p className={errorClass}>{errors.fullName}</p>}</div>
            <div><label className={labelClass}>Phone Number</label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm flex-shrink-0"><span>🇱🇷</span><span className="text-gray-600">+231</span></div>
                <input className={`${inputClass} flex-1`} placeholder="770123456" value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} />
              </div>{errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
            <div><label className={labelClass}>Email <span className="text-gray-400">(optional)</span></label><input className={inputClass} type="email" placeholder="your@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label className={labelClass}>Password</label>
              <div className="relative"><input type={showPw ? 'text' : 'password'} className={`${inputClass} pr-10`} placeholder="Min. 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>{errors.password && <p className={errorClass}>{errors.password}</p>}
            </div>
            <div><label className={labelClass}>Confirm Password</label><input type="password" className={inputClass} placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} />{errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}</div>
            <button onClick={handleNext} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition">Continue <ChevronRight className="w-4 h-4" /></button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Step 2 of 2 — Delivery Preferences</p>
            <div><label className={labelClass}>County</label>
              <select value={form.county} onChange={(e) => set('county', e.target.value)} className={`${inputClass} bg-white`}>
                <option value="">Select your county</option>
                {countyNames.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>{errors.county && <p className={errorClass}>{errors.county}</p>}
            </div>
            <div><label className={labelClass}>Default Delivery Landmark</label><input className={inputClass} placeholder="e.g. Near Total Gas Station, Sinkor" value={form.landmark} onChange={(e) => set('landmark', e.target.value)} />{errors.landmark && <p className={errorClass}>{errors.landmark}</p>}</div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition">Back</button>
              <button onClick={handleRegister} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition disabled:opacity-60">
                {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Create Account</>}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/shop/auth/login" className="text-green-700 font-semibold hover:underline">Sign in</Link>
        </p>
        <p className="text-center text-xs text-gray-400">
          Are you a farmer? <Link href="/auth/register" className="text-green-600 hover:underline">Farmer registration →</Link>
        </p>
      </div>
    </div>
  )
}
