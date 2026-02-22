'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'

const step1Schema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\+?[\d\s-]{7,15}$/.test(val),
      'Enter a valid email or phone number',
    ),
})

const step3Schema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type Step1Data = z.infer<typeof step1Schema>
type Step3Data = z.infer<typeof step3Schema>

const slideVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [contactInfo, setContactInfo] = useState('')

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const setOtpRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      otpRefs.current[index] = el
    },
    [],
  )

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
  })

  const onStep1Submit = (data: Step1Data) => {
    setContactInfo(data.emailOrPhone)
    console.log('Send OTP to:', data.emailOrPhone)
    setStep(2)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newValues = [...otpValues]
    newValues[index] = value.slice(-1)
    setOtpValues(newValues)
    setOtpError('')

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newValues.every((v) => v !== '') && newValues.join('').length === 6) {
      console.log('OTP submitted:', newValues.join(''))
      setTimeout(() => setStep(3), 300)
    }
  }

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newValues = pasted.split('')
      setOtpValues(newValues)
      otpRefs.current[5]?.focus()
      console.log('OTP submitted:', pasted)
      setTimeout(() => setStep(3), 300)
    }
  }

  const onStep3Submit = (data: Step3Data) => {
    console.log('Reset password:', data)
    setStep(4)
  }

  const resendOtp = () => {
    setOtpValues(['', '', '', '', '', ''])
    setOtpError('')
    otpRefs.current[0]?.focus()
    console.log('Resend OTP to:', contactInfo)
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary dark:from-[#0a1f0a] dark:to-[#0F1A0F] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-card rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="lg" linkTo="/" />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1 — Enter email/phone */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
                <h1 className="text-2xl font-bold text-agri-text dark:text-foreground">
                  Forgot Password?
                </h1>
                <p className="text-sm text-agri-muted dark:text-muted-foreground">
                  Enter your email or phone number and we&apos;ll send you a
                  verification code.
                </p>
              </div>

              <form
                onSubmit={step1Form.handleSubmit(onStep1Submit)}
                className="space-y-4"
              >
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
                      {...step1Form.register('emailOrPhone')}
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-agri-border dark:border-border bg-white dark:bg-background text-agri-text dark:text-foreground placeholder:text-agri-muted/60 dark:placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  {step1Form.formState.errors.emailOrPhone && (
                    <p className="text-xs text-danger">
                      {step1Form.formState.errors.emailOrPhone.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition"
                >
                  Send OTP
                </button>
              </form>

              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-1.5 text-sm font-medium text-agri-muted dark:text-muted-foreground hover:text-agri-text dark:hover:text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </motion.div>
          )}

          {/* STEP 2 — OTP input */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-agri-text dark:text-foreground">
                  Enter Verification Code
                </h1>
                <p className="text-sm text-agri-muted dark:text-muted-foreground">
                  We sent a 6-digit code to{' '}
                  <span className="font-medium text-agri-text dark:text-foreground">
                    {contactInfo}
                  </span>
                </p>
              </div>

              <div
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handleOtpPaste}
              >
                {otpValues.map((val, i) => (
                  <input
                    key={i}
                    ref={setOtpRef(i)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white dark:bg-background text-agri-text dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
                      val
                        ? 'border-primary'
                        : 'border-agri-border dark:border-border'
                    }`}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-danger text-center">{otpError}</p>
              )}

              <p className="text-center text-sm text-agri-muted dark:text-muted-foreground">
                Didn&apos;t receive a code?{' '}
                <button
                  type="button"
                  onClick={resendOtp}
                  className="font-semibold text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition"
                >
                  Resend
                </button>
              </p>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-1.5 w-full text-sm font-medium text-agri-muted dark:text-muted-foreground hover:text-agri-text dark:hover:text-foreground transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Change email/phone
              </button>
            </motion.div>
          )}

          {/* STEP 3 — New password */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-agri-text dark:text-foreground">
                  Create New Password
                </h1>
                <p className="text-sm text-agri-muted dark:text-muted-foreground">
                  Your new password must be at least 8 characters long.
                </p>
              </div>

              <form
                onSubmit={step3Form.handleSubmit(onStep3Submit)}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-agri-text dark:text-foreground"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      {...step3Form.register('newPassword')}
                      className="w-full h-12 pl-10 pr-12 rounded-xl border border-agri-border dark:border-border bg-white dark:bg-background text-agri-text dark:text-foreground placeholder:text-agri-muted/60 dark:placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-agri-muted dark:text-muted-foreground hover:text-agri-text dark:hover:text-foreground transition"
                      aria-label={
                        showNewPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {step3Form.formState.errors.newPassword && (
                    <p className="text-xs text-danger">
                      {step3Form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-agri-text dark:text-foreground"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-agri-muted dark:text-muted-foreground" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      {...step3Form.register('confirmPassword')}
                      className="w-full h-12 pl-10 pr-12 rounded-xl border border-agri-border dark:border-border bg-white dark:bg-background text-agri-text dark:text-foreground placeholder:text-agri-muted/60 dark:placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-agri-muted dark:text-muted-foreground hover:text-agri-text dark:hover:text-foreground transition"
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {step3Form.formState.errors.confirmPassword && (
                    <p className="text-xs text-danger">
                      {step3Form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition"
                >
                  Reset Password
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="space-y-6 text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                <CheckCircle2 className="h-20 w-20 text-primary mx-auto" />
              </motion.div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-agri-text dark:text-foreground">
                  Password Reset Successful
                </h1>
                <p className="text-sm text-agri-muted dark:text-muted-foreground">
                  Your password has been updated. You can now sign in with your
                  new password.
                </p>
              </div>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PoweredBy */}
        <div className="pt-4 border-t border-agri-border dark:border-border flex justify-center">
          <PoweredBy size="sm" />
        </div>
      </motion.div>
    </div>
  )
}
