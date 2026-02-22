'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, User, Phone, Mail, Lock, MapPin, ArrowRight, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import type { ConsumerUser } from '@/lib/types/shop'
import BackButton from '@/components/shared/BackButton'

const LIBERIA_COUNTIES = [
  'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount',
  'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland',
  'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe',
]

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid Liberian phone number required').max(15),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  county: z.string().min(1, 'Select your county'),
  landmark: z.string().min(2, 'Enter a landmark or area'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

const CONSUMERS_KEY = 'agrihub-consumers'

export default function ShopRegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const setConsumer = useShopStore((s) => s.setConsumer)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (data: RegisterForm) => {
    const stored: ConsumerUser[] = JSON.parse(localStorage.getItem(CONSUMERS_KEY) || '[]')

    const exists = stored.some((u) => u.phone === data.phone || (data.email && u.email === data.email))
    if (exists) {
      toast.error('An account with this phone or email already exists. Try signing in.')
      return
    }

    const newUser: ConsumerUser = {
      id: `consumer-${Date.now()}`,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || undefined,
      password: data.password,
      county: data.county,
      landmark: data.landmark,
      role: 'consumer',
      joinedAt: new Date().toISOString(),
    }

    stored.push(newUser)
    localStorage.setItem(CONSUMERS_KEY, JSON.stringify(stored))
    setConsumer(newUser)
    toast.success('Account created! Welcome to AgriHub Shop.')
    router.push('/shop')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-green-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackButton href="/shop/auth/login" label="Back to Sign In" />
        </div>
        <div className="text-center mb-8">
          <Link href="/shop" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#D8F3DC]" />
            </div>
            <span className="text-xl font-bold text-[#1B4332]">
              Agri <span className="text-[#2D6A4F]">Hub</span>{' '}
              <span className="text-sm bg-[#D8F3DC] text-[#1B4332] px-1.5 py-0.5 rounded">Shop</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Buy fresh produce directly from Liberian farmers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('fullName')}
                  type="text"
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="0770001234"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    {...register('county')}
                    className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition appearance-none"
                  >
                    <option value="">Select</option>
                    {LIBERIA_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {errors.county && <p className="text-xs text-red-500 mt-1">{errors.county.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Landmark / Area</label>
                <input
                  {...register('landmark')}
                  type="text"
                  placeholder="e.g. Red Light"
                  className="w-full px-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                />
                {errors.landmark && <p className="text-xs text-red-500 mt-1">{errors.landmark.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-10 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter"
                    className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/shop/auth/login" className="text-[#2D6A4F] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          Are you a farmer?{' '}
          <Link href="/auth/register" className="text-[#2D6A4F] hover:underline">
            Register as Farmer
          </Link>
        </p>
      </div>
    </div>
  )
}
