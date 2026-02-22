'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'
import { useAuth } from '@/lib/auth'

const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormContent() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, user } = useAuth()

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, user, router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = async (data: LoginForm) => {
    const result = login(data.emailOrPhone, data.password)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(`Welcome back, ${result.user.name}!`)

    const returnUrl = searchParams.get('returnUrl')

    // Route based on role
    if (result.user.role === 'admin') {
      router.push(returnUrl || '/admin/dashboard')
    } else {
      router.push(returnUrl || '/dashboard')
    }
  }

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row bg-white">
      {/* Left panel -- desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 bg-[#0f2d1a]">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Logo size="lg" linkTo="/" variant="white" />
            <p className="mt-4 text-lg font-medium text-white leading-snug">
              Giving every Liberian farmer the data advantage
            </p>
            <p className="mt-2 text-white/60">
              Real-time market prices, weather forecasts, and expert agronomy tips — all in one place.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <p className="text-white/80 leading-relaxed text-sm italic">
              &ldquo;I earned L$8,000 more on my rice harvest after using AgriHub.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                FK
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Fatu Kamara</p>
                <p className="text-xs text-white/50">Rice farmer, Bong County</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 font-medium mb-2">Demo Accounts</p>
            <div className="space-y-2 text-xs text-white/60">
              <p><span className="text-white/80 font-medium">Admin:</span> admin@farmpulse.lr / Admin@2024</p>
              <p><span className="text-white/80 font-medium">Farmer:</span> fatu.kamara@gmail.com / Farmer@2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center lg:hidden mb-2">
            <Logo size="lg" linkTo="/" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Rice prices just updated. Sign in to check.
            </p>
          </div>

          {/* Mobile demo accounts hint */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 lg:hidden">
            <p className="text-xs text-gray-500 font-medium mb-1">Demo Accounts</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><span className="font-medium text-gray-700">Admin:</span> admin@farmpulse.lr / Admin@2024</p>
              <p><span className="font-medium text-gray-700">Farmer:</span> fatu.kamara@gmail.com / Farmer@2024</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email / Phone */}
            <div className="space-y-1.5">
              <label htmlFor="emailOrPhone" className="text-sm font-medium text-gray-700">
                Email or Phone
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="emailOrPhone"
                  type="text"
                  placeholder="you@example.com or +231..."
                  {...register('emailOrPhone')}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
                />
              </div>
              {errors.emailOrPhone && (
                <p className="text-xs text-red-600">{errors.emailOrPhone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  {...register('password')}
                  className="w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-700 transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            New farmer?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-green-600 hover:text-green-700 transition inline-flex items-center gap-1"
            >
              Create account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>

          {/* PoweredBy */}
          <div className="pt-4 border-t border-gray-100 flex justify-center">
            <PoweredBy size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center bg-white">
        <div className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  )
}
