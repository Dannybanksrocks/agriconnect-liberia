'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Sprout,
} from 'lucide-react'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'
import { counties } from '@/lib/mock-data/counties'

const CROPS = [
  'Rice', 'Cassava', 'Corn', 'Groundnut',
  'Palm Oil', 'Cocoa', 'Vegetables', 'Fruits',
] as const

const EXPERIENCE_LEVELS = [
  { value: 'beginner',     label: 'Beginner',     desc: 'Just getting started' },
  { value: 'intermediate', label: 'Intermediate', desc: '2–5 years farming' },
  { value: 'experienced',  label: 'Experienced',  desc: '5+ years farming' },
] as const

const LANGUAGES = [
  { value: 'english', label: 'English', active: true  },
  { value: 'kpelle',  label: 'Kpelle',  active: false },
  { value: 'bassa',   label: 'Bassa',   active: false },
  { value: 'mende',   label: 'Mende',   active: false },
  { value: 'vai',     label: 'Vai',     active: false },
] as const

const step1Schema = z
  .object({
    fullName:        z.string().min(1, 'Full name is required'),
    phone:           z.string().min(1, 'Phone number is required')
                      .regex(/^\d{7,10}$/, 'Enter a valid phone number (7–10 digits)'),
    email:           z.string().email('Enter a valid email').or(z.literal('')).optional(),
    password:        z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const step2Schema = z.object({
  county:     z.string().min(1, 'Please select a county'),
  farmSize:   z.coerce.number({ message: 'Enter a valid number' })
               .min(0.1, 'Farm size must be at least 0.1 acres'),
  crops:      z.array(z.string()).min(1, 'Select at least one crop').max(5, 'Maximum 5 crops allowed'),
  experience: z.string().min(1, 'Select your experience level'),
})

const step3Schema = z.object({
  language:      z.string().min(1, 'Select a language'),
  priceAlerts:   z.boolean(),
  weatherAlerts: z.boolean(),
  acceptTerms:   z.boolean().refine((v) => v === true, 'You must accept the terms'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

const STEP_TITLES = ['Personal Info', 'Farm Profile', 'Preferences']

const slideVariants = {
  enter:  (dir: number) => ({ x: dir > 0 ?  240 : -240, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -240 :  240, opacity: 0 }),
}

const inputClass = "w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState<Partial<Step1Data & Step2Data & Step3Data>>({
    priceAlerts:   true,
    weatherAlerts: true,
    language:      'english',
  })

  const schemas = [step1Schema, step2Schema, step3Schema] as const
  const currentSchema = schemas[step - 1]

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(currentSchema as any),
    defaultValues: formData,
  })

  const selectedCrops = watch('crops') as string[] | undefined

  const goNext = (data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setDirection(1)
    setStep((s) => Math.min(s + 1, 3))
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  const onFinalSubmit = (data: Record<string, unknown>) => {
    const allData = { ...formData, ...data }
    console.log('Register:', allData)
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Logo size="lg" linkTo="/" />
          </div>

          {/* Progress stepper */}
          <div className="flex items-center justify-between px-2">
            {STEP_TITLES.map((title, i) => {
              const stepNum = i + 1
              const isCompleted = step > stepNum
              const isActive = step === stepNum
              return (
                <div key={title} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isCompleted || isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                    </div>
                    <span
                      className={`text-[10px] font-medium hidden sm:block ${
                        isActive || isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full transition-colors ${
                        step > stepNum ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <form
                onSubmit={handleSubmit(step === 3 ? onFinalSubmit : goNext)}
                className="space-y-4"
              >
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>

                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input id="fullName" type="text" placeholder="Enter your full name" {...register('fullName')} className={inputClass} />
                      </div>
                      {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 h-11 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">+231</span>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="phone" type="tel" placeholder="770 123 456" {...register('phone')} className="w-full h-11 pl-10 pr-4 rounded-r-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm" />
                        </div>
                      </div>
                      {errors.phone && <p className="text-xs text-red-600">{errors.phone.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input id="email" type="email" placeholder="you@example.com" {...register('email')} className={inputClass} />
                      </div>
                      {errors.email && <p className="text-xs text-red-600">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" {...register('password')} className="w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" aria-label="Toggle password">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-600">{errors.password.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" {...register('confirmPassword')} className="w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" aria-label="Toggle confirm password">
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword.message as string}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Farm Profile</h2>

                    <div className="space-y-1.5">
                      <label htmlFor="county" className="text-sm font-medium text-gray-700">County</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select id="county" {...register('county')} className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition appearance-none text-sm">
                          <option value="">Select your county</option>
                          {counties.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      {errors.county && <p className="text-xs text-red-600">{errors.county.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="farmSize" className="text-sm font-medium text-gray-700">Farm Size (acres)</label>
                      <div className="relative">
                        <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input id="farmSize" type="number" step="0.1" min="0.1" placeholder="e.g. 2.5" {...register('farmSize')} className={inputClass} />
                      </div>
                      {errors.farmSize && <p className="text-xs text-red-600">{errors.farmSize.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Primary Crops <span className="text-gray-400 font-normal">(max 5)</span>
                      </label>
                      <Controller
                        name="crops"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                          <div className="grid grid-cols-2 gap-2">
                            {CROPS.map((crop) => {
                              const values = (field.value as string[]) || []
                              const isSelected = values.includes(crop)
                              const isDisabled = !isSelected && values.length >= 5
                              return (
                                <label
                                  key={crop}
                                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition text-sm ${
                                    isSelected
                                      ? 'border-green-500 bg-green-50 text-green-700'
                                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        field.onChange([...values, crop])
                                      } else {
                                        field.onChange(values.filter((v: string) => v !== crop))
                                      }
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
                                  />
                                  {crop}
                                </label>
                              )
                            })}
                          </div>
                        )}
                      />
                      {errors.crops && <p className="text-xs text-red-600">{errors.crops.message as string}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Experience Level</label>
                      <div className="grid grid-cols-3 gap-2">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <label key={level.value} className="relative cursor-pointer">
                            <input type="radio" value={level.value} {...register('experience')} className="peer sr-only" />
                            <div className="p-3 rounded-lg border border-gray-200 text-center transition peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50">
                              <p className="text-sm font-semibold text-gray-900">{level.label}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{level.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.experience && <p className="text-xs text-red-600">{errors.experience.message as string}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Preferences</h2>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Language Preference</label>
                      <div className="space-y-2">
                        {LANGUAGES.map((lang) => (
                          <label
                            key={lang.value}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition text-sm ${
                              !lang.active
                                ? 'opacity-50 cursor-not-allowed border-gray-200'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                value={lang.value}
                                disabled={!lang.active}
                                {...register('language')}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 accent-green-600"
                              />
                              <span className="text-gray-900">{lang.label}</span>
                            </div>
                            {!lang.active && (
                              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                                Coming soon
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Price Alerts</p>
                          <p className="text-xs text-gray-500">Get notified when crop prices change</p>
                        </div>
                        <input type="checkbox" {...register('priceAlerts')} className="h-4 w-4 rounded text-green-600 focus:ring-green-500 accent-green-600" />
                      </label>
                      <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Weather Alerts</p>
                          <p className="text-xs text-gray-500">Receive weather forecasts for your area</p>
                        </div>
                        <input type="checkbox" {...register('weatherAlerts')} className="h-4 w-4 rounded text-green-600 focus:ring-green-500 accent-green-600" />
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" {...register('acceptTerms')} className="h-4 w-4 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600" />
                        <span className="text-sm text-gray-500">
                          I agree to the{' '}
                          <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                      {errors.acceptTerms && <p className="text-xs text-red-600">{errors.acceptTerms.message as string}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  {step > 1 ? (
                    <button type="button" onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    type="submit"
                    className="h-11 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center gap-2 text-sm"
                  >
                    {step === 3 ? 'Create Account' : (<>Next <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-green-600 hover:text-green-700 transition">
              Sign in
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
