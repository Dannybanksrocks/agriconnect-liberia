'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/hooks/useAuth'
import {
  Eye, EyeOff, User, Phone, MapPin, Check, ChevronRight, ChevronLeft,
  Sprout, TrendingUp, MessageCircle, Leaf, CreditCard, Bell, Globe,
  Smartphone, Info, ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { countyNames } from '@/lib/mock-data/counties'
import { LIBERIAN_CROPS, MOBILE_MONEY_PROVIDERS } from '@/lib/constants'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  county: string
  familiarWithApps: string
  whatsappNumber: string
  farmName: string
  farmSize: string
  crops: string[]
  experience: string
  goals: string
  accountType: string
  mobileMoneyProvider: string
  mobileMoneyNumber: string
  accountName: string
  currencyPreference: string
  minPayoutThreshold: string
  language: string
  smsAlerts: boolean
  weatherAlerts: boolean
  marketplaceNotifications: boolean
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Farm Details', icon: Sprout },
  { id: 3, label: 'Account Type', icon: TrendingUp },
  { id: 4, label: 'Payment Setup', icon: CreditCard },
  { id: 5, label: 'Preferences', icon: Bell },
]

const inputClass =
  'w-full h-11 px-4 rounded-lg border border-stone-300 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 transition text-sm'
const labelClass = 'block text-sm font-medium text-stone-700 mb-1.5'
const errorClass = 'text-xs text-red-500 mt-1'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isAuthenticated, user } = useAuth()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [cropInput, setCropInput] = useState('')

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    county: '',
    familiarWithApps: '',
    whatsappNumber: '',
    farmName: '',
    farmSize: '',
    crops: [],
    experience: '',
    goals: '',
    accountType: 'farmer',
    mobileMoneyProvider: '',
    mobileMoneyNumber: '',
    accountName: '',
    currencyPreference: 'LRD',
    minPayoutThreshold: '',
    language: 'english',
    smsAlerts: true,
    weatherAlerts: true,
    marketplaceNotifications: true,
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })

  useEffect(() => {
    if (isAuthenticated && user && step !== 6) {
      if (user.role === 'admin') router.replace('/admin/dashboard')
      else if (user.role === 'extension-officer') router.replace('/admin/farmers')
      else if (user.role === 'buyer') router.replace('/marketplace')
      else router.replace('/dashboard')
    }
  }, [isAuthenticated, user, router, step])

  const set = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e })
  }

  const toggleCrop = (crop: string) => {
    const updated = formData.crops.includes(crop)
      ? formData.crops.filter((c) => c !== crop)
      : [...formData.crops, crop]
    set('crops', updated)
  }

  const addCustomCrop = () => {
    const trimmed = cropInput.trim()
    if (trimmed && !formData.crops.includes(trimmed)) {
      set('crops', [...formData.crops, trimmed])
      setCropInput('')
    }
  }

  const validate = (s: number): boolean => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!formData.firstName.trim()) e.firstName = 'First name is required'
      if (!formData.lastName.trim()) e.lastName = 'Last name is required'
      if (!formData.phone.trim()) e.phone = 'Phone number is required'
      else if (!/^\d{8,10}$/.test(formData.phone)) e.phone = 'Enter 8-10 digits (without country code)'
      if (!formData.county) e.county = 'Please select your county'
      if (!formData.familiarWithApps) e.familiarWithApps = 'Please select one'
      if (!formData.password) e.password = 'Password is required'
      else if (formData.password.length < 6) e.password = 'Minimum 6 characters'
      if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match'
    }
    if (s === 2) {
      if (!formData.farmName.trim()) e.farmName = 'Farm name is required'
      if (!formData.farmSize) e.farmSize = 'Please select farm size'
      if (formData.crops.length === 0) e.crops = 'Add at least one crop'
      if (!formData.experience) e.experience = 'Please select your experience level'
    }
    if (s === 3) {
      if (!formData.accountType) e.accountType = 'Please select an account type'
    }
    if (s === 4) {
      if (formData.mobileMoneyProvider && formData.mobileMoneyProvider !== 'none') {
        if (!formData.mobileMoneyNumber.trim()) e.mobileMoneyNumber = 'Mobile money number is required'
        else if (!/^\d{8,10}$/.test(formData.mobileMoneyNumber)) e.mobileMoneyNumber = 'Enter 8-10 digits'
        if (!formData.accountName.trim()) e.accountName = 'Account name is required'
      }
    }
    if (s === 5) {
      if (!formData.acceptTerms) e.acceptTerms = 'You must accept the terms and conditions'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => { if (validate(step)) setStep((s) => s + 1) }
  const handleBack = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!validate(5)) return
    setIsSubmitting(true)
    try {
      const result = register({
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber || undefined,
        email: undefined,
        password: formData.password,
        county: formData.county,
        farmSize: parseFloat(formData.farmSize) || 0,
        crops: formData.crops,
        experience: formData.experience,
        language: formData.language,
        farmName: formData.farmName,
        accountType: formData.accountType,
        familiarWithApps: formData.familiarWithApps,
        mobileMoneyProvider: formData.mobileMoneyProvider || undefined,
        mobileMoneyNumber: formData.mobileMoneyNumber || undefined,
        accountName: formData.accountName || undefined,
        currencyPreference: formData.currencyPreference,
        priceAlerts: formData.smsAlerts,
        weatherAlerts: formData.weatherAlerts,
      })
      if (result.success) {
        setStep(6)
        toast.success('Welcome to AgriHub! Dial *347# anytime for market prices.')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } catch {
      toast.error('An error occurred during registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToDashboard = () => {
    if (user?.role === 'buyer') router.push('/marketplace')
    else router.push('/dashboard')
  }

  const selectedProvider = MOBILE_MONEY_PROVIDERS.find((p) => p.id === formData.mobileMoneyProvider)

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-xl border border-stone-200">

        {/* Left Sidebar */}
        <div className="hidden lg:flex w-64 flex-shrink-0 bg-[#1B4332] flex-col p-6">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#D8F3DC]/20 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#D8F3DC]" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Agri <span className="text-[#74C69D]">Hub</span>
              </span>
            </Link>
            <p className="text-[#74C69D]/70 text-xs mt-1">Liberia's Agricultural Platform</p>
          </div>

          <nav className="flex-1 space-y-1">
            {STEPS.map((s) => {
              const Icon = s.icon
              const done = step > s.id
              const active = step === s.id
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${active ? 'bg-white/10' : done ? 'opacity-70' : 'opacity-40'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${done ? 'bg-[#52B788] text-white' : active ? 'bg-white text-[#1B4332]' : 'bg-white/10 text-white/50'}`}>
                    {done ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${active ? 'text-white' : 'text-[#74C69D]'}`}>{s.label}</p>
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <p className="text-xs text-white/40">Already have an account?</p>
            <Link href="/auth/login" className="text-sm text-[#74C69D] hover:text-white font-medium mt-1 inline-block transition-colors">
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#1B4332]">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-[#D8F3DC]" />
              </div>
              <span className="text-white font-bold tracking-tight">
                Agri <span className="text-[#74C69D]">Hub</span>
              </span>
            </Link>
            {step < 6 && (
              <span className="text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded-full">Step {step} of 5</span>
            )}
          </div>

          {/* Mobile step dots */}
          {step < 6 && (
            <div className="lg:hidden flex items-center justify-center gap-2 py-3 bg-stone-50 border-b border-stone-100">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className={`rounded-full transition-all duration-300 ${step === s.id ? 'w-6 h-2 bg-[#1B4332]' : step > s.id ? 'w-2 h-2 bg-[#52B788]' : 'w-2 h-2 bg-stone-300'}`}
                />
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >

                {/* ── Step 1: Personal Info ── */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">Personal Information</h2>
                      <p className="text-stone-500 text-sm mt-1">Tell us about yourself to get started</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>First Name</label>
                        <input className={inputClass} placeholder="e.g. Fatu" value={formData.firstName} onChange={(e) => set('firstName', e.target.value)} />
                        {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input className={inputClass} placeholder="e.g. Kamara" value={formData.lastName} onChange={(e) => set('lastName', e.target.value)} />
                        {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 h-11 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 text-sm flex-shrink-0">
                          <span>🇱🇷</span>
                          <span>+231</span>
                        </div>
                        <div className="flex-1">
                          <input className={inputClass} placeholder="770001234" value={formData.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} />
                        </div>
                      </div>
                      {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>County</label>
                      <select className={inputClass} value={formData.county} onChange={(e) => set('county', e.target.value)}>
                        <option value="">Select your county</option>
                        {countyNames.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.county && <p className={errorClass}>{errors.county}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>Are you familiar with using mobile apps?</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Yes', 'Somewhat', 'No'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => set('familiarWithApps', opt.toLowerCase())}
                            className={`py-2.5 rounded-lg border text-sm font-medium transition ${formData.familiarWithApps === opt.toLowerCase() ? 'border-[#1B4332] bg-[#D8F3DC] text-[#1B4332]' : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {errors.familiarWithApps && <p className={errorClass}>{errors.familiarWithApps}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>WhatsApp Number <span className="text-stone-400">(optional)</span></label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 h-11 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 text-sm flex-shrink-0">
                          <span>🇱🇷</span>
                          <span>+231</span>
                        </div>
                        <input className={`${inputClass} flex-1`} placeholder="For buyer communications" value={formData.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value.replace(/\D/g, ''))} />
                      </div>
                    </div>

                    <div className="border-t border-stone-100 pt-5">
                      <p className="text-sm font-medium text-stone-700 mb-4">Create your password</p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Password</label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className={`${inputClass} pr-10`}
                              placeholder="Min. 6 characters"
                              value={formData.password}
                              onChange={(e) => set('password', e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.password && <p className={errorClass}>{errors.password}</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Confirm Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              className={`${inputClass} pr-10`}
                              placeholder="Repeat password"
                              value={formData.confirmPassword}
                              onChange={(e) => set('confirmPassword', e.target.value)}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Farm Details ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">Farm Details</h2>
                      <p className="text-stone-500 text-sm mt-1">Tell us about your farm so we can personalise your experience</p>
                    </div>

                    <div>
                      <label className={labelClass}>Farm Name</label>
                      <input className={inputClass} placeholder="e.g. Kamara Family Farm" value={formData.farmName} onChange={(e) => set('farmName', e.target.value)} />
                      {errors.farmName && <p className={errorClass}>{errors.farmName}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>Farm Size</label>
                      <select className={inputClass} value={formData.farmSize} onChange={(e) => set('farmSize', e.target.value)}>
                        <option value="">Select farm size</option>
                        <option value="0.5">Under 1 acre</option>
                        <option value="2">1–3 acres</option>
                        <option value="6">3–10 acres</option>
                        <option value="30">10–50 acres</option>
                        <option value="100">50+ acres</option>
                      </select>
                      {errors.farmSize && <p className={errorClass}>{errors.farmSize}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>What do you grow?</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {LIBERIAN_CROPS.map((crop) => (
                          <button
                            key={crop}
                            type="button"
                            onClick={() => toggleCrop(crop)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${formData.crops.includes(crop) ? 'border-[#1B4332] bg-[#D8F3DC] text-[#1B4332]' : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'}`}
                          >
                            {formData.crops.includes(crop) && <span className="mr-1">✓</span>}{crop}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          className={inputClass}
                          placeholder="Add custom crop..."
                          value={cropInput}
                          onChange={(e) => setCropInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomCrop() } }}
                        />
                        <button type="button" onClick={addCustomCrop} className="px-4 h-11 rounded-lg bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-medium transition flex-shrink-0">
                          Add
                        </button>
                      </div>
                      {formData.crops.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {formData.crops.map((c) => (
                            <span key={c} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#D8F3DC] border border-[#52B788]/40 text-[#1B4332] text-xs">
                              {c}
                              <button type="button" onClick={() => toggleCrop(c)} className="hover:text-red-500">&times;</button>
                            </span>
                          ))}
                        </div>
                      )}
                      {errors.crops && <p className={errorClass}>{errors.crops}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>How long have you been in agriculture?</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'beginner', label: 'Beginner', sub: '< 1 year' },
                          { id: 'intermediate', label: 'Intermediate', sub: '1–5 years' },
                          { id: 'experienced', label: 'Experienced', sub: '5+ years' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => set('experience', opt.id)}
                            className={`py-3 px-2 rounded-lg border text-center transition ${formData.experience === opt.id ? 'border-[#1B4332] bg-[#D8F3DC]' : 'border-stone-300 bg-white hover:border-stone-400'}`}
                          >
                            <p className={`text-sm font-medium ${formData.experience === opt.id ? 'text-[#1B4332]' : 'text-stone-700'}`}>{opt.label}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{opt.sub}</p>
                          </button>
                        ))}
                      </div>
                      {errors.experience && <p className={errorClass}>{errors.experience}</p>}
                    </div>

                    <div>
                      <label className={labelClass}>What are your goals with AgriHub? <span className="text-stone-400">(optional)</span></label>
                      <textarea
                        className={`${inputClass} h-20 py-3 resize-none`}
                        placeholder="e.g. Get better prices for my cassava, connect with buyers in Monrovia..."
                        value={formData.goals}
                        onChange={(e) => set('goals', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* ── Step 3: Account Type ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">Account Type</h2>
                      <p className="text-stone-500 text-sm mt-1">Choose the role that best describes how you'll use AgriHub</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { id: 'farmer', icon: Sprout, label: 'Farmer', desc: 'I grow and sell produce' },
                        { id: 'buyer', icon: TrendingUp, label: 'Buyer', desc: 'I purchase agricultural produce' },
                        { id: 'extension-officer', icon: MessageCircle, label: 'Extension Officer', desc: 'I provide advisory services to farmers' },
                      ].map((opt) => {
                        const Icon = opt.icon
                        const active = formData.accountType === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => set('accountType', opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition ${active ? 'border-[#1B4332] bg-[#D8F3DC]/40' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-[#1B4332]' : 'bg-stone-100'}`}>
                              <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-stone-500'}`} />
                            </div>
                            <div className="flex-1">
                              <p className={`font-semibold ${active ? 'text-[#1B4332]' : 'text-stone-700'}`}>{opt.label}</p>
                              <p className="text-sm text-stone-400">{opt.desc}</p>
                            </div>
                            {active && <Check className="w-5 h-5 text-[#1B4332] flex-shrink-0" />}
                          </button>
                        )
                      })}
                    </div>
                    {errors.accountType && <p className={errorClass}>{errors.accountType}</p>}
                  </div>
                )}

                {/* ── Step 4: Payment Setup ── */}
                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">Payment Setup</h2>
                      <p className="text-stone-500 text-sm mt-1">How would you like to receive payments from buyers?</p>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#D8F3DC] border border-[#52B788]/50">
                      <Info className="w-5 h-5 text-[#1B4332] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#1B4332]">
                        AgriHub uses mobile money — no bank account needed. Buyers pay directly to your wallet when your produce is sold through the marketplace.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>Mobile Money Provider</label>
                      <div className="space-y-2">
                        {MOBILE_MONEY_PROVIDERS.map((provider) => (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => {
                              set('mobileMoneyProvider', provider.id)
                              if (provider.id !== 'none' && !formData.mobileMoneyNumber) {
                                set('mobileMoneyNumber', formData.phone)
                              }
                            }}
                            className={`w-full flex items-center gap-3 p-3.5 rounded-lg border text-left transition ${formData.mobileMoneyProvider === provider.id ? 'border-[#1B4332] bg-[#D8F3DC]/40' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${formData.mobileMoneyProvider === provider.id ? 'border-[#1B4332] bg-[#1B4332]' : 'border-stone-400'}`} />
                            <div>
                              <p className={`text-sm font-medium ${formData.mobileMoneyProvider === provider.id ? 'text-[#1B4332]' : 'text-stone-700'}`}>{provider.label}</p>
                              <p className="text-xs text-stone-400">{provider.description}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.mobileMoneyProvider && formData.mobileMoneyProvider !== 'none' && (
                      <>
                        <div>
                          <label className={labelClass}>Mobile Money Number</label>
                          <div className="flex gap-2">
                            <div className="flex items-center gap-2 px-3 h-11 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 text-sm flex-shrink-0">
                              <span>🇱🇷</span>
                              <span>+231</span>
                            </div>
                            <input
                              className={`${inputClass} flex-1`}
                              placeholder="770001234"
                              value={formData.mobileMoneyNumber}
                              onChange={(e) => set('mobileMoneyNumber', e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                          <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#52B788]" /> This is the number buyers will use to pay you
                          </p>
                          {errors.mobileMoneyNumber && <p className={errorClass}>{errors.mobileMoneyNumber}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Account Name</label>
                          <input className={inputClass} placeholder="Name registered on mobile money" value={formData.accountName} onChange={(e) => set('accountName', e.target.value)} />
                          {errors.accountName && <p className={errorClass}>{errors.accountName}</p>}
                        </div>

                        <div>
                          <label className={labelClass}>Currency Preference</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['LRD', 'USD'].map((cur) => (
                              <button
                                key={cur}
                                type="button"
                                onClick={() => set('currencyPreference', cur)}
                                className={`py-3 rounded-lg border text-sm font-medium transition ${formData.currencyPreference === cur ? 'border-[#1B4332] bg-[#D8F3DC] text-[#1B4332]' : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'}`}
                              >
                                {cur === 'LRD' ? 'L$ Liberian Dollars' : '$ US Dollars'}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-stone-400 mt-2">Most market transactions in Liberia are in LRD. USD available for export crops (rubber, cocoa).</p>
                        </div>

                        <div>
                          <label className={labelClass}>Minimum payout threshold <span className="text-stone-400">(optional)</span></label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">L$</span>
                            <input className={`${inputClass} pl-8`} placeholder="e.g. 500" value={formData.minPayoutThreshold} onChange={(e) => set('minPayoutThreshold', e.target.value.replace(/\D/g, ''))} />
                          </div>
                          <p className="text-xs text-stone-400 mt-1">Notify me when my balance reaches this amount</p>
                        </div>
                      </>
                    )}

                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Payment Terms</p>
                      {[
                        'Buyers pay via mobile money before or on delivery',
                        'AgriHub does NOT hold funds — payments go directly to your wallet',
                        'Transaction confirmation sent via SMS to your registered number',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#52B788] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-stone-500">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Step 5: Preferences ── */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-800">Preferences</h2>
                      <p className="text-stone-500 text-sm mt-1">Customise how AgriHub works for you</p>
                    </div>

                    <div>
                      <label className={labelClass}>Language Preference</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'english', label: 'English' },
                          { id: 'kpelle', label: 'Kpelle' },
                          { id: 'bassa', label: 'Bassa' },
                          { id: 'mende', label: 'Mende' },
                          { id: 'vai', label: 'Vai' },
                        ].map((lang) => (
                          <button
                            key={lang.id}
                            type="button"
                            onClick={() => set('language', lang.id)}
                            className={`py-2.5 rounded-lg border text-sm font-medium transition ${formData.language === lang.id ? 'border-[#1B4332] bg-[#D8F3DC] text-[#1B4332]' : 'border-stone-300 bg-white text-stone-600 hover:border-stone-400'}`}
                          >
                            {lang.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: 'smsAlerts' as const, label: 'SMS Price Alerts', desc: `Sent to +231${formData.phone || '...'}` },
                        { key: 'weatherAlerts' as const, label: 'Weather Alerts', desc: 'Daily county weather updates' },
                        { key: 'marketplaceNotifications' as const, label: 'Marketplace Inquiry Notifications', desc: 'When buyers contact you' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-stone-50 border border-stone-200">
                          <div>
                            <p className="text-sm font-medium text-stone-700">{item.label}</p>
                            <p className="text-xs text-stone-400">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => set(item.key, !formData[item.key])}
                            className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${formData[item.key] ? 'bg-[#1B4332]' : 'bg-stone-300'}`}
                          >
                            <span className={`block w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-transform ${formData[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-700">Offline Access Available</p>
                        <p className="text-xs text-blue-500 mt-0.5">You can access AgriHub offline via <span className="font-bold">*347#</span> on any Liberian phone</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={(e) => set('acceptTerms', e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-stone-400 accent-[#1B4332] flex-shrink-0"
                        />
                        <span className="text-sm text-stone-600">
                          I agree to the{' '}
                          <Link href="/terms" className="text-[#1B4332] hover:text-[#2D6A4F] underline">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-[#1B4332] hover:text-[#2D6A4F] underline">Privacy Policy</Link>
                        </span>
                      </label>
                      {errors.acceptTerms && <p className={errorClass}>{errors.acceptTerms}</p>}
                    </div>
                  </div>
                )}

                {/* ── Step 6: Success ── */}
                {step === 6 && (
                  <div className="flex flex-col items-center text-center space-y-6 py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-24 h-24 rounded-full bg-[#1B4332] flex items-center justify-center"
                    >
                      <Check className="w-12 h-12 text-white" />
                    </motion.div>

                    <div>
                      <h2 className="text-3xl font-bold text-stone-800">Welcome to AgriHub!</h2>
                      <p className="text-stone-500 mt-2">Your account has been created successfully</p>
                    </div>

                    <div className="w-full max-w-sm bg-stone-50 rounded-xl border border-stone-200 p-5 text-left space-y-3">
                      <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Account Summary</p>
                      {[
                        { label: 'Name', value: `${formData.firstName} ${formData.lastName}` },
                        { label: 'County', value: formData.county },
                        { label: 'Account Type', value: formData.accountType.replace('-', ' ') },
                        { label: 'Primary Crops', value: formData.crops.slice(0, 3).join(', ') || '—' },
                        { label: 'Mobile Money', value: selectedProvider?.id !== 'none' ? selectedProvider?.label || 'Not set up' : 'Not set up' },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between text-sm">
                          <span className="text-stone-400">{row.label}</span>
                          <span className="text-stone-700 font-medium capitalize">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#D8F3DC] border border-[#52B788]/50 w-full max-w-sm text-left">
                      <Smartphone className="w-5 h-5 text-[#1B4332] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#1B4332]">Dial <span className="font-bold">*347#</span> anytime on any Liberian phone to access market prices offline.</p>
                    </div>

                    <button
                      onClick={goToDashboard}
                      className="w-full max-w-sm h-12 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition text-base"
                    >
                      Go to your Dashboard <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Nav Buttons */}
          {step < 6 && (
            <div className="px-6 lg:px-8 py-5 border-t border-stone-100 flex items-center justify-between gap-4 bg-stone-50/50">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 h-11 rounded-xl border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 text-sm font-medium transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-5 h-11 rounded-xl border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 text-sm font-medium transition"
                >
                  Sign In
                </Link>
              )}

              <div className="flex items-center gap-3">
                {step === 4 && (
                  <button
                    type="button"
                    onClick={() => { set('mobileMoneyProvider', ''); setStep(5) }}
                    className="px-4 h-11 text-sm text-stone-400 hover:text-stone-600 transition"
                  >
                    Set up later
                  </button>
                )}
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 h-11 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition shadow-sm"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 h-11 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition disabled:opacity-60 shadow-sm"
                  >
                    {isSubmitting ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Create Account <Check className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
