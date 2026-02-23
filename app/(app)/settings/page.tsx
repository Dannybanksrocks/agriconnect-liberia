'use client'

import { useState } from 'react'
import {
  User as UserIcon,
  Bell,
  Globe,
  Shield,
  Info,
  Save,
  Phone,
  Trash2,
  TrendingUp,
  CloudRain,
  Sprout,
  Lightbulb,
  Smartphone,
  ExternalLink,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAppStore } from '@/lib/store/useAppStore'
import PageHeader from '@/components/shared/PageHeader'
import CountySelector from '@/components/shared/CountySelector'
import Logo from '@/components/shared/Logo'
import PoweredBy from '@/components/shared/PoweredBy'

interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

const tabs: Tab[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'about', label: 'About', icon: Info },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and app settings."
      />

      <div className="flex gap-1 overflow-x-auto rounded-xl bg-agri-bg p-1 dark:bg-muted">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-agri-text shadow-sm dark:bg-card dark:text-foreground'
                  : 'text-agri-muted hover:text-agri-text dark:text-muted-foreground dark:hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'language' && <LanguageTab />}
        {activeTab === 'privacy' && <PrivacyTab />}
        {activeTab === 'about' && <AboutTab />}
      </div>
    </div>
  )
}

/* ─── Profile Tab ─────────────────────────────────────────────────── */

function ProfileTab() {
  const user = useAppStore((s) => s.user)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    county: user?.county ?? '',
    farmSizeAcres: user?.farmSizeAcres ?? 0,
  })
  const [saved, setSaved] = useState(false)

  const hasChanges =
    user &&
    (form.name !== user.name ||
      form.phone !== user.phone ||
      form.email !== (user.email ?? '') ||
      form.county !== user.county ||
      form.farmSizeAcres !== user.farmSizeAcres)

  const initials = form.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
          {initials}
        </div>
        <div>
          <h3 className="font-semibold text-agri-text dark:text-foreground">
            {form.name || 'Your Name'}
          </h3>
          <p className="text-sm text-agri-muted dark:text-muted-foreground">
            Farmer &middot; {form.county} County
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FieldInput
          label="Full Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <FieldInput
          label="Phone Number"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <FieldInput
          label="Email (optional)"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          type="email"
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
            County
          </label>
          <CountySelector
            value={form.county}
            onChange={(v) => setForm({ ...form, county: v })}
            className="w-full"
          />
        </div>
        <FieldInput
          label="Farm Size (acres)"
          value={String(form.farmSizeAcres)}
          onChange={(v) =>
            setForm({ ...form, farmSizeAcres: Number(v) || 0 })
          }
          type="number"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
        {saved && (
          <span className="text-sm font-medium text-green-600">
            Changes saved!
          </span>
        )}
      </div>
    </div>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
      />
    </div>
  )
}

/* ─── Notifications Tab ───────────────────────────────────────────── */

interface ToggleRow {
  id: string
  icon: LucideIcon
  label: string
  note?: string
  defaultOn: boolean
}

const notifToggles: ToggleRow[] = [
  { id: 'price', icon: TrendingUp, label: 'Price Alerts (>5%)', defaultOn: true },
  { id: 'weather', icon: CloudRain, label: 'Severe Weather Warnings', defaultOn: true },
  { id: 'planting', icon: Sprout, label: 'Planting Season Reminders', defaultOn: true },
  { id: 'tips', icon: Lightbulb, label: 'New Agronomy Tips', defaultOn: false },
  {
    id: 'sms',
    icon: Smartphone,
    label: 'SMS Notifications',
    note: 'SMS available on USSD *347#',
    defaultOn: false,
  },
]

function NotificationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notifToggles.map((t) => [t.id, t.defaultOn]))
  )
  const [delivery, setDelivery] = useState('push')
  const [frequency, setFrequency] = useState('immediate')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold text-agri-text dark:text-foreground">
          Alert Types
        </h3>
        <div className="divide-y divide-agri-border dark:divide-border">
          {notifToggles.map((row) => {
            const Icon = row.icon
            const isOn = enabled[row.id]
            return (
              <div
                key={row.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 text-agri-muted dark:text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium text-agri-text dark:text-foreground">
                      {row.label}
                    </span>
                    {row.note && (
                      <p className="text-xs text-agri-muted dark:text-muted-foreground">
                        {row.note}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={isOn}
                  onClick={() =>
                    setEnabled((p) => ({ ...p, [row.id]: !p[row.id] }))
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                    isOn ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform ${
                      isOn ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-agri-text dark:text-foreground">
          Delivery Method
        </h3>
        <div className="flex flex-wrap gap-3">
          {['push', 'sms', 'both'].map((m) => (
            <label
              key={m}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                delivery === m
                  ? 'border-primary bg-primary/5 text-primary dark:border-primary'
                  : 'border-agri-border text-agri-text hover:border-primary/50 dark:border-border dark:text-foreground'
              }`}
            >
              <input
                type="radio"
                name="delivery"
                value={m}
                checked={delivery === m}
                onChange={() => setDelivery(m)}
                className="sr-only"
              />
              {m === 'push' ? 'Push' : m === 'sms' ? 'SMS' : 'Both'}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-agri-text dark:text-foreground">
          Frequency
        </h3>
        <div className="flex flex-wrap gap-3">
          {['immediate', 'daily', 'weekly'].map((f) => (
            <label
              key={f}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                frequency === f
                  ? 'border-primary bg-primary/5 text-primary dark:border-primary'
                  : 'border-agri-border text-agri-text hover:border-primary/50 dark:border-border dark:text-foreground'
              }`}
            >
              <input
                type="radio"
                name="frequency"
                value={f}
                checked={frequency === f}
                onChange={() => setFrequency(f)}
                className="sr-only"
              />
              {f}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Language Tab ────────────────────────────────────────────────── */

const languages = [
  { id: 'en', label: 'English', available: true },
  { id: 'kpelle', label: 'Kpelle', available: false },
  { id: 'bassa', label: 'Bassa', available: false },
  { id: 'mende', label: 'Mende', available: false },
  { id: 'vai', label: 'Vai', available: false },
] as const

function LanguageTab() {
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)

  return (
    <div className="space-y-4">
      <p className="text-sm text-agri-muted dark:text-muted-foreground">
        Select your preferred language for the app interface and alerts.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() =>
              lang.available &&
              setLanguage(lang.id as typeof language)
            }
            disabled={!lang.available}
            className={`relative rounded-xl border p-4 text-left transition-colors ${
              language === lang.id
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : lang.available
                  ? 'border-agri-border hover:border-primary/50 dark:border-border'
                  : 'cursor-not-allowed border-agri-border opacity-60 dark:border-border'
            }`}
          >
            <span className="text-sm font-semibold text-agri-text dark:text-foreground">
              {lang.label}
            </span>
            {!lang.available && (
              <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                Coming soon
              </span>
            )}
            {language === lang.id && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Privacy Tab ─────────────────────────────────────────────────── */

function PrivacyTab() {
  const user = useAppStore((s) => s.user)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const farmName = user?.name ?? ''
  const canDelete =
    confirmText.trim().toLowerCase() === farmName.toLowerCase()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-agri-text dark:text-foreground">
          Data Usage
        </h3>
        <div className="space-y-2 text-sm text-agri-muted dark:text-muted-foreground">
          <p>
            AgriHub Liberia collects minimal data to provide you with
            accurate market prices, weather forecasts, and farming
            recommendations tailored to your county and crops.
          </p>
          <p>
            Your farm data is stored locally on your device and
            synchronized securely with our servers only when you have an
            internet connection. We never sell your personal data to third
            parties.
          </p>
          <p>
            For questions about data privacy, contact us at{' '}
            <strong>privacy@tech231apps.net</strong>.
          </p>
        </div>
      </div>

      <div className="border-t border-agri-border pt-6 dark:border-border">
        <h3 className="mb-2 font-semibold text-red-600">Danger Zone</h3>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete my account
          </button>
        ) : (
          <div className="rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
            <p className="mb-3 text-sm text-red-700 dark:text-red-300">
              This action is permanent. Type{' '}
              <strong>&ldquo;{farmName}&rdquo;</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={farmName}
              className="mb-3 w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 dark:border-red-800 dark:bg-card dark:text-foreground"
            />
            <div className="flex gap-2">
              <button
                disabled={!canDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Permanently Delete
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setConfirmText('')
                }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-agri-muted hover:bg-agri-bg dark:text-muted-foreground dark:hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── About Tab ───────────────────────────────────────────────────── */

function AboutTab() {
  return (
    <div className="flex flex-col items-center text-center">
      <Logo size="lg" linkTo="" />

          <p className="mt-4 text-sm font-medium text-agri-text dark:text-foreground">
            AgriHub Liberia v1.0.0
          </p>
      <p className="mt-1 text-sm text-agri-muted dark:text-muted-foreground">
        Built by Tech 231 Liberia Limited
      </p>

      <div className="mt-6">
        <PoweredBy variant="stacked" />
      </div>


      <div className="mt-6 rounded-xl border border-primary/20 bg-primary-50 p-4 dark:border-primary/30 dark:bg-primary-900/20">
        <div className="flex items-center justify-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold text-primary">*347#</span>
        </div>
        <p className="mt-1 text-xs text-agri-muted dark:text-muted-foreground">
          Access market prices &amp; weather via USSD — no internet needed
        </p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        {['Privacy Policy', 'Terms of Service', 'Support'].map((link) => (
          <a
            key={link}
            href="#"
            className="inline-flex items-center gap-1 text-primary transition-colors hover:underline"
          >
            {link}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>
    </div>
  )
}
