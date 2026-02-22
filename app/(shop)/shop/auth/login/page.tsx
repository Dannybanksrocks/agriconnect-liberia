'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import BackButton from '@/components/shared/BackButton'

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

const CONSUMERS_KEY = 'agrihub-consumers'

export default function ShopLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const setConsumer = useShopStore((s) => s.setConsumer)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data: LoginForm) => {
    const stored = JSON.parse(localStorage.getItem(CONSUMERS_KEY) || '[]')
    const user = stored.find(
      (u: { email?: string; phone: string; password: string }) =>
        (u.email === data.emailOrPhone || u.phone === data.emailOrPhone) &&
        u.password === data.password
    )

    if (!user) {
      toast.error('Invalid credentials. Please check your email/phone and password.')
      return
    }

    setConsumer(user)
    toast.success(`Welcome back, ${user.fullName}!`)
    router.push('/shop/account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-green-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <BackButton href="/shop" label="Back to Shop" />
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Sign in to your account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Shop fresh produce directly from Liberian farmers
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('emailOrPhone')}
                  type="text"
                  placeholder="email@example.com or 077..."
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#2D6A4F] focus:bg-white transition"
                />
              </div>
              {errors.emailOrPhone && (
                <p className="text-xs text-red-500 mt-1">{errors.emailOrPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/shop/auth/register" className="text-[#2D6A4F] font-semibold hover:underline">
            Create Account
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          Are you a farmer?{' '}
          <Link href="/auth/login" className="text-[#2D6A4F] hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
