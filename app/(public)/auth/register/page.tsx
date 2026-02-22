'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Leaf,
  Tractor,
  ShoppingCart,
  ClipboardList,
  PartyPopper,
} from 'lucide-react'
import { toast } from 'sonner'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'
import { counties } from '@/lib/mock-data/counties'
import { useAuth } from '@/lib/auth'

const CROPS = [
  'Rice', 'Cassava', 'Palm Oil', 'Rubber', 'Cocoa',
  'Hot Pepper', 'Okra', 'Groundnut', 'Plantain', 'Yam',
  'Corn', 'Tomato', 'Coffee', 'Sweet Potato',
] as const

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'Just getting started' },
  { value: 'intermediate', label: 'Intermediate', desc: '2-5 years farming' },
  { value: 'experienced', label: 'Experienced', desc: '5+ years farming' },
] as const

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'kpelle', label: 'Kpelle' },
  { value: 'bassa', label: 'Bassa' },
] as const

const STEP_TITLES = ['Personal Info', 'Farm Details', 'Account Type', 'Preferences', 'Complete']

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 240 : -240, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -240 : 240, opacity: 0 }),
}

const inputClass =
  'w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm'

interface FormData {
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  county: string
  farmName: string
  farmSize: string
  crops: string[]
  experience: string
  accountType: string
  familiarWithApps: string
  language: string
  smsAlerts: boolean
  priceAlerts: boolean
  weatherAlerts: boolean
  acceptTerms: boolean
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { register: doRegister, isAuthenticated, user } = useAuth()

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    county: '',
    farmName: '',
    farmSize: '',
    crops: [],
    experience: '',
    accountType: 'farmer',
    familiarWithApps: '',
    language: 'english',
    smsAlerts: true,
    priceAlerts: true,
    weatherAlerts: true,
    acceptTerms: false,
  })

  useEffect(() => {
    if (isAuthenticated && user && step !== 5) {
      if (user.role === 'admin') router.replace('/admin/dashboard')
      else router.replace('/dashboard')
    }
  }, [isAuthenticated, user, router, step])

  const updateField = (key: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const validateStep = (s: number): boolean => {
    const errs: Record<string, string> = {}

    if (s === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required'
      if (!formData.phone.trim()) errs.phone = 'Phone number is required'
      else if (!/^\d{7,10}$/.test(formData.phone)) errs.phone = 'Enter a valid phone number (7-10 digits)'
      if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match'
      if (!formData.familiarWithApps) errs.familiarWithApps = 'Please select an option'
    }

    if (s === 2) {
      if (!formData.county) errs.county = 'Please select a county'
      if (!formData.farmSize || parseFloat(formData.farmSize) < 0.1) errs.farmSize = 'Farm size must be at least 0.1 acres'
      if (formData.crops.length === 0) errs.crops = 'Select at least one crop'
      if (!formData.experience) errs.experience = 'Select your experience level'
    }

    if (s === 3) {
      if (!formData.accountType) errs.accountType = 'Select an account type'
    }

    if (s === 4) {
      if (!formData.acceptTerms) errs.acceptTerms = 'You must accept the terms'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goNext = () => {
    if (!validateStep(step)) return

    if (step === 4) {
      // Submit registration
      const result = doRegister({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || undefined,
        password: formData.password,
        county: formData.county,
        farmSize: parseFloat(formData.farmSize),
        crops: formData.crops,
        experience: formData.experience,
        language: formData.language,
        farmName: formData.farmName || undefined,
        accountType: formData.accountType,
        priceAlerts: formData.priceAlerts,
        weatherAlerts: formData.weatherAlerts,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Account created successfully!')
      setDirection(1)
      setStep(5)
      return
    }

    setDirection(1)
    setStep((s) => Math.min(s + 1, 5))
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(s - 1, 1))
  }

  const goToDashboard = () => {
    if (user?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-dvh flex bg-gray-50">
      {/* Left sidebar - step progress (desktop) */}
      <div className="hidden lg:flex lg:w-80 flex-col bg-[#0f2d1a] p-8">
        <Logo size="lg" linkTo="/" variant="white" />
        <p className="mt-4 text-sm text-white/50">Create your free account</p>

        <nav className="mt-12 flex-1 space-y-2">
          {STEP_TITLES.map((title, i) => {
            const stepNum = i + 1
            const isCompleted = step > stepNum
            const isActive = step === stepNum
            return (
              <div
                key={title}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive ? 'bg-white/10' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-white text-[#0f2d1a]'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isActive || isCompleted ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {title}
                </span>
              </div>
            )
          })}
        </nav>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 mt-auto">
          <p className="text-xs text-white/50">
            You can also access FarmPulse via USSD: <span className="text-white/80 font-mono">*347#</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Logo size="lg" linkTo="/" />
          </div>

          {/* Mobile progress stepper */}
          <div className="flex items-center justify-between px-2 mb-6 lg:hidden">
            {STEP_TITLES.map((title, i) => {
              const stepNum = i + 1
              const isCompleted = step > stepNum
              const isActive = step === stepNum
              return (
                <div key={title} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                        isCompleted || isActive
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="h-3 w-3" /> : stepNum}
                    </div>
                  </div>
                  {i < 4 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 rounded-full transition-colors ${
                        step > stepNum ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
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
                  {/* STEP 1: Personal Info */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-sm text-gray-500">Let&apos;s start with your basic details</p>

                      <div className="space-y-1.5">
                        <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} className={inputClass} />
                        </div>
                        {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                        <div className="relative flex">
                          <span className="inline-flex items-center px-3 h-11 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-500">+231</span>
                          <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input id="phone" type="tel" placeholder="770 123 456" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-r-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm" />
                          </div>
                        </div>
                        {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Are you familiar with using apps?</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Yes', 'Somewhat', 'No'].map((opt) => (
                            <label key={opt} className="relative cursor-pointer">
                              <input type="radio" value={opt.toLowerCase()} checked={formData.familiarWithApps === opt.toLowerCase()} onChange={() => updateField('familiarWithApps', opt.toLowerCase())} className="peer sr-only" />
                              <div className="p-2.5 rounded-lg border border-gray-200 text-center text-sm transition peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50">
                                {opt}
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.familiarWithApps && <p className="text-xs text-red-600">{errors.familiarWithApps}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={formData.password} onChange={(e) => updateField('password', e.target.value)} className="w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" aria-label="Toggle password">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Re-enter your password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className="w-full h-11 pl-10 pr-12 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" aria-label="Toggle confirm password">
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Farm Details */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900">Farm Details</h2>
                      <p className="text-sm text-gray-500">Tell us about your farm</p>

                      <div className="space-y-1.5">
                        <label htmlFor="county" className="text-sm font-medium text-gray-700">County</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <select id="county" value={formData.county} onChange={(e) => updateField('county', e.target.value)} className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition appearance-none text-sm">
                            <option value="">Select your county</option>
                            {counties.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        {errors.county && <p className="text-xs text-red-600">{errors.county}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="farmName" className="text-sm font-medium text-gray-700">
                          Farm Name <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <div className="relative">
                          <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="farmName" type="text" placeholder="e.g. Kamara Family Farm" value={formData.farmName} onChange={(e) => updateField('farmName', e.target.value)} className={inputClass} />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="farmSize" className="text-sm font-medium text-gray-700">Farm Size (acres)</label>
                        <div className="relative">
                          <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input id="farmSize" type="number" step="0.1" min="0.1" placeholder="e.g. 2.5" value={formData.farmSize} onChange={(e) => updateField('farmSize', e.target.value)} className={inputClass} />
                        </div>
                        {errors.farmSize && <p className="text-xs text-red-600">{errors.farmSize}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">
                          Primary Crops <span className="text-gray-400 font-normal">(select up to 5)</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {CROPS.map((crop) => {
                            const isSelected = formData.crops.includes(crop)
                            const isDisabled = !isSelected && formData.crops.length >= 5
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
                                      updateField('crops', [...formData.crops, crop])
                                    } else {
                                      updateField('crops', formData.crops.filter((c) => c !== crop))
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
                                />
                                {crop}
                              </label>
                            )
                          })}
                        </div>
                        {errors.crops && <p className="text-xs text-red-600">{errors.crops}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Experience Level</label>
                        <div className="grid grid-cols-3 gap-2">
                          {EXPERIENCE_LEVELS.map((level) => (
                            <label key={level.value} className="relative cursor-pointer">
                              <input type="radio" value={level.value} checked={formData.experience === level.value} onChange={() => updateField('experience', level.value)} className="peer sr-only" />
                              <div className="p-3 rounded-lg border border-gray-200 text-center transition peer-checked:border-green-500 peer-checked:bg-green-50 hover:bg-gray-50">
                                <p className="text-sm font-semibold text-gray-900">{level.label}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{level.desc}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.experience && <p className="text-xs text-red-600">{errors.experience}</p>}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Account Type */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900">Account Type</h2>
                      <p className="text-sm text-gray-500">How will you use FarmPulse?</p>

                      <div className="space-y-3">
                        {[
                          { value: 'farmer', icon: Tractor, label: 'Farmer', desc: 'Track your crops, get price alerts, and access agronomy tips' },
                          { value: 'extension-officer', icon: ClipboardList, label: 'Extension Officer', desc: 'Support farmers in your area with data and guidance' },
                          { value: 'buyer', icon: ShoppingCart, label: 'Buyer', desc: 'Find farmers, check market prices, and source produce' },
                        ].map((type) => {
                          const Icon = type.icon
                          return (
                            <label
                              key={type.value}
                              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                                formData.accountType === type.value
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <input type="radio" value={type.value} checked={formData.accountType === type.value} onChange={() => updateField('accountType', type.value)} className="sr-only" />
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                formData.accountType === type.value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                              }`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{type.label}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                      {errors.accountType && <p className="text-xs text-red-600">{errors.accountType}</p>}
                    </div>
                  )}

                  {/* STEP 4: Preferences */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
                      <p className="text-sm text-gray-500">Customize your experience</p>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Language Preference</label>
                        <div className="space-y-2">
                          {LANGUAGES.map((lang) => (
                            <label
                              key={lang.value}
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer transition hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <input type="radio" value={lang.value} checked={formData.language === lang.value} onChange={() => updateField('language', lang.value)} className="h-4 w-4 text-green-600 focus:ring-green-500 accent-green-600" />
                                <span className="text-sm text-gray-900">{lang.label}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Notifications</label>
                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Enable SMS Alerts</p>
                            <p className="text-xs text-gray-500">Get important updates via SMS</p>
                          </div>
                          <input type="checkbox" checked={formData.smsAlerts} onChange={(e) => updateField('smsAlerts', e.target.checked)} className="h-4 w-4 rounded text-green-600 focus:ring-green-500 accent-green-600" />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Price Alerts</p>
                            <p className="text-xs text-gray-500">Get notified when crop prices change</p>
                          </div>
                          <input type="checkbox" checked={formData.priceAlerts} onChange={(e) => updateField('priceAlerts', e.target.checked)} className="h-4 w-4 rounded text-green-600 focus:ring-green-500 accent-green-600" />
                        </label>
                        <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Weather Alerts</p>
                            <p className="text-xs text-gray-500">Receive weather forecasts for your area</p>
                          </div>
                          <input type="checkbox" checked={formData.weatherAlerts} onChange={(e) => updateField('weatherAlerts', e.target.checked)} className="h-4 w-4 rounded text-green-600 focus:ring-green-500 accent-green-600" />
                        </label>
                      </div>

                      <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                        <p className="text-xs text-green-800">
                          You can also access FarmPulse via USSD: <span className="font-mono font-bold">*347#</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => updateField('acceptTerms', e.target.checked)} className="h-4 w-4 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600" />
                          <span className="text-sm text-gray-500">
                            I agree to the{' '}
                            <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>
                          </span>
                        </label>
                        {errors.acceptTerms && <p className="text-xs text-red-600">{errors.acceptTerms}</p>}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Complete */}
                  {step === 5 && (
                    <div className="text-center py-8 space-y-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
                      >
                        <PartyPopper className="h-10 w-10 text-green-600" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Welcome to FarmPulse!</h2>
                        <p className="text-sm text-gray-500 mt-2">
                          Your account has been created successfully. You&apos;re now part of a community of {'>'}2,400 Liberian farmers.
                        </p>
                      </div>
                      <button
                        onClick={goToDashboard}
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition text-sm"
                      >
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {step < 5 && (
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                  {step > 1 ? (
                    <button type="button" onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    type="button"
                    onClick={goNext}
                    className="h-11 px-8 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center gap-2 text-sm"
                  >
                    {step === 4 ? 'Create Account' : (<>Next <ArrowRight className="h-4 w-4" /></>)}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Login link */}
          {step < 5 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-green-600 hover:text-green-700 transition">
                Sign in
              </Link>
            </p>
          )}

          {/* PoweredBy */}
          <div className="pt-4 mt-4 border-t border-gray-100 flex justify-center">
            <PoweredBy size="sm" />
          </div>
        </div>
      </div>
    </div>
  )
}
