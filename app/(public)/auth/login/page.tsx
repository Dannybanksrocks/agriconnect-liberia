'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight } from 'lucide-react'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'

const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\+?[\d\s-]{7,15}$/.test(val),
      'Enter a valid email or phone number',
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = async (data: LoginForm) => {
    console.log('Login:', data)
  }

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row bg-gradient-to-br from-primary-dark to-primary dark:from-[#0a1f0a] dark:to-[#0F1A0F]">
      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-secondary/30 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center space-y-8"
        >
          <Logo size="lg" variant="white" linkTo="/" />

          <p className="text-xl font-medium leading-relaxed text-white/90">
            Empowering Liberian farmers with technology
          </p>

          <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="italic text-white/90 leading-relaxed">
              &ldquo;AgriConnect helped me find the best price for my rice
              harvest. I earned 40% more this season!&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary-dark font-bold text-sm">
                FK
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Fatu Kamara</p>
                <p className="text-xs text-white/70">
                  Rice farmer, Bong County
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right panel / mobile full-page */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
        >
          <div className="flex justify-center lg:hidden">
            <Logo size="lg" linkTo="/" />
          </div>
          <div className="hidden lg:flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-agri-text dark:text-foreground">
              Welcome back
            </h1>
            <p className="text-sm text-agri-muted dark:text-muted-foreground">
              Rice prices just updated. Sign in to check.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email / Phone */}
            <div className="space-y-1.5">
              <label
                htmlFor="emailOrPhone"
                className="text-sm font-medium text-agri-text dark:text-foreground"
              >
                Email or Phone
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                <input
                  id="emailOrPhone"
                  type="text"
                  placeholder="you@example.com or +231..."
                  {...register('emailOrPhone')}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-agri-border dark:border-border bg-white dark:bg-background text-agri-text dark:text-foreground placeholder:text-agri-muted/60 dark:placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              {errors.emailOrPhone && (
                <p className="text-xs text-danger">{errors.emailOrPhone.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-agri-text dark:text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-agri-border dark:border-border bg-white dark:bg-background text-agri-text dark:text-foreground placeholder:text-agri-muted/60 dark:placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-agri-muted dark:text-muted-foreground hover:text-agri-text dark:hover:text-foreground transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="h-4 w-4 rounded border-agri-border text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm text-agri-muted dark:text-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-agri-border dark:bg-border" />
            <span className="text-xs text-agri-muted dark:text-muted-foreground">
              or
            </span>
            <div className="flex-1 h-px bg-agri-border dark:bg-border" />
          </div>

          {/* OTP Button */}
          <button
            type="button"
            className="w-full h-12 border border-agri-border dark:border-border text-agri-text dark:text-foreground font-semibold rounded-xl hover:bg-agri-hover dark:hover:bg-muted transition flex items-center justify-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Continue with Phone OTP
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-agri-muted dark:text-muted-foreground">
            New farmer?{' '}
            <Link
              href="/auth/register"
              className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition inline-flex items-center gap-1"
            >
              Create account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>

          {/* PoweredBy */}
          <div className="pt-4 border-t border-agri-border dark:border-border flex justify-center">
            <PoweredBy size="sm" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
