'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import { SEED_ACCOUNTS_PUBLIC } from '@/lib/auth-consumer'

const inputClass = 'w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition'

export default function ConsumerLoginPage() {
  const router = useRouter()
  const setConsumer = useShopStore((s) => s.setConsumer)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier || !password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    const found = SEED_ACCOUNTS_PUBLIC.find(
      (u) => (u.email === identifier || u.phone === identifier) && u.password === password
    )
    setLoading(false)
    if (!found) { toast.error('Invalid email/phone or password'); return }
    setConsumer({ id: found.id, fullName: found.name, phone: found.phone, email: found.email, password: found.password, county: found.county, landmark: '', role: 'consumer', joinedAt: found.joinedAt })
    toast.success(`Welcome back, ${found.name.split(' ')[0]}!`)
    router.push('/shop')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-green-600 flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Sign in to Shop</h1>
          <p className="text-sm text-gray-500 mt-1">Buy fresh produce from Liberian farmers</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Phone</label>
            <input className={inputClass} placeholder="consumer@agrihub.lr or +231..." value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} className={`${inputClass} pr-10`} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          {"Don't have an account? "}
          <Link href="/shop/auth/register" className="text-green-700 font-semibold hover:underline">Create one</Link>
        </p>
        <p className="text-center text-xs text-gray-400">
          Are you a farmer? <Link href="/auth/login" className="text-green-600 hover:underline">Farmer login →</Link>
        </p>
      </div>
    </div>
  )
}
