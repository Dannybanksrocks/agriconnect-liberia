'use client'

import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import type { User } from '@/lib/types'

/* ── Seed accounts (hardcoded, always available) ────────────────────────── */

export interface AuthUser extends User {
  password: string
  farmName?: string
}

const SEED_ACCOUNTS: AuthUser[] = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    phone: '+231770000001',
    email: 'admin@agrihub.lr',
    password: 'Admin@2024',
    county: 'Montserrado',
    farmSizeAcres: 0,
    primaryCrops: [],
    role: 'admin',
    language: 'en',
    status: 'active',
    joinedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'farmer-1',
    name: 'Fatu Kamara',
    phone: '+231770001001',
    email: 'fatu.kamara@agrihub.lr',
    password: 'Farmer@2024',
    county: 'Bong County',
    farmSizeAcres: 3.5,
    primaryCrops: ['Rice', 'Cassava'],
    role: 'farmer',
    language: 'en',
    status: 'active',
    joinedAt: '2024-01-15T08:00:00Z',
    farmName: 'Kamara Family Farm',
  },
  {
    id: 'farmer-2',
    name: 'Musu Kollie',
    phone: '+231770001002',
    email: 'musu.kollie@agrihub.lr',
    password: 'Farmer@2024',
    county: 'Nimba County',
    farmSizeAcres: 2.0,
    primaryCrops: ['Hot Pepper', 'Tomato', 'Okra'],
    role: 'farmer',
    language: 'en',
    status: 'active',
    joinedAt: '2024-03-10T10:30:00Z',
    farmName: 'Kollie Gardens',
  },
  {
    id: 'extension-1',
    name: 'James Flomo',
    phone: '+231770003001',
    email: 'james.flomo@agrihub.lr',
    password: 'Officer@2024',
    county: 'Lofa County',
    farmSizeAcres: 0,
    primaryCrops: [],
    role: 'extension-officer',
    language: 'en',
    status: 'active',
    joinedAt: '2024-01-20T09:00:00Z',
  },
  {
    id: 'supplier-1',
    name: 'GreenFields Ltd',
    phone: '+231770004001',
    email: 'greenfields@agrihub.lr',
    password: 'Supplier@2024',
    county: 'Montserrado',
    farmSizeAcres: 0,
    primaryCrops: [],
    role: 'supplier',
    language: 'en',
    status: 'active',
    joinedAt: '2024-02-01T10:00:00Z',
    businessName: 'GreenFields Agricultural Supplies',
    businessType: 'supplier',
  },
  {
    id: 'consumer-1',
    name: 'Mary Johnson',
    phone: '+231770123456',
    email: 'consumer@agrihub.lr',
    password: 'Consumer@2024',
    county: 'Montserrado',
    farmSizeAcres: 0,
    primaryCrops: [],
    role: 'consumer',
    language: 'en',
    status: 'active',
    joinedAt: '2024-04-01T08:00:00Z',
  },
  {
    id: 'consumer-2',
    name: 'Emmanuel Dolo',
    phone: '+231550987654',
    email: 'emmanuel.dolo@agrihub.lr',
    password: 'Consumer@2024',
    county: 'Margibi County',
    farmSizeAcres: 0,
    primaryCrops: [],
    role: 'consumer',
    language: 'en',
    status: 'active',
    joinedAt: '2024-05-10T10:00:00Z',
  },
]

/* ── LocalStorage keys ─────────────────────────────────────────────────── */

const SESSION_KEY = 'farmpulse_session'
const USERS_KEY = 'farmpulse_users'

interface Session {
  user: User
  role: User['role']
  token: string
  expiresAt: string
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function getStoredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveStoredUsers(users: AuthUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getAllUsers(): AuthUser[] {
  const stored = getStoredUsers()
  // Merge: seed accounts are canonical, stored users are appended
  const seedEmails = new Set(SEED_ACCOUNTS.map((a) => a.email?.toLowerCase()))
  const uniqueStored = stored.filter(
    (u) => !seedEmails.has(u.email?.toLowerCase())
  )
  return [...SEED_ACCOUNTS, ...uniqueStored]
}

function findUser(emailOrPhone: string, password: string): AuthUser | null {
  const all = getAllUsers()
  const q = emailOrPhone.toLowerCase().trim()
  return (
    all.find(
      (u) =>
        (u.email?.toLowerCase() === q || u.phone === q) &&
        u.password === password
    ) ?? null
  )
}

function createSession(user: User): Session {
  const session: Session = {
    user,
    role: user.role,
    token: `mock-jwt-${user.id}-${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session: Session = JSON.parse(raw)
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

/* ── Public Auth API ───────────────────────────────────────────────────── */

export function login(
  emailOrPhone: string,
  password: string
): { success: true; user: User } | { success: false; error: string } {
  const found = findUser(emailOrPhone, password)
  if (!found) {
    return { success: false, error: 'Invalid email or password' }
  }
  // strip password for session user
  const { password: _pw, farmName: _fn, ...sessionUser } = found
  createSession(sessionUser)
  return { success: true, user: sessionUser }
}

export interface RegisterData {
  fullName: string
  phone: string
  whatsappNumber?: string
  email?: string
  password: string
  county: string
  farmSize: number
  crops: string[]
  experience: string
  language: string
  farmName?: string
  accountType?: string
  familiarWithApps?: string
  mobileMoneyProvider?: string
  mobileMoneyNumber?: string
  accountName?: string
  currencyPreference?: string
  priceAlerts?: boolean
  weatherAlerts?: boolean
}

export function register(
  data: RegisterData
): { success: true; user: User } | { success: false; error: string } {
  const allUsers = getAllUsers()
  const emailExists = data.email && allUsers.some(
    (u) => u.email?.toLowerCase() === data.email!.toLowerCase()
  )
  if (emailExists) {
    return { success: false, error: 'An account with this email already exists' }
  }
  const phoneExists = allUsers.some((u) => u.phone === `+231${data.phone}`)
  if (phoneExists) {
    return { success: false, error: 'An account with this phone number already exists' }
  }

  // Determine role from accountType
  let role: User['role'] = 'farmer'
  if (data.accountType === 'extension-officer') role = 'extension-officer'
  else if (data.accountType === 'buyer') role = 'buyer'
  else if (data.accountType === 'supplier') role = 'supplier'

  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    name: data.fullName,
    phone: `+231${data.phone}`,
    email: data.email || undefined,
    password: data.password,
    county: data.county,
    farmSizeAcres: data.farmSize,
    primaryCrops: data.crops,
    role,
    language: (data.language === 'english' ? 'en' : data.language) as User['language'],
    status: 'active',
    joinedAt: new Date().toISOString(),
    farmName: data.farmName,
  }

  // Save to localStorage
  const stored = getStoredUsers()
  stored.push(newUser)
  saveStoredUsers(stored)

  // Create session
  const { password: _pw, farmName: _fn, ...sessionUser } = newUser
  createSession(sessionUser)

  return { success: true, user: sessionUser }
}

export function logout() {
  clearSession()
}

export function getStoredSession(): Session | null {
  return getSession()
}

export function getAllRegisteredUsers(): User[] {
  return getAllUsers().map(({ password: _pw, farmName: _fn, ...rest }) => rest)
}

/* ── useAuth Hook ──────────────────────────────────────────────────────── */

export function useAuth() {
  const { user, isAuthenticated, setUser } = useAppStore()

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(session.user)
    } else {
      setUser(null)
    }
  }, [setUser])

  const doLogin = useCallback(
    (emailOrPhone: string, password: string) => {
      const result = login(emailOrPhone, password)
      if (result.success) {
        setUser(result.user)
      }
      return result
    },
    [setUser]
  )

  const doRegister = useCallback(
    (data: RegisterData) => {
      const result = register(data)
      if (result.success) {
        setUser(result.user)
      }
      return result
    },
    [setUser]
  )

  const doLogout = useCallback(() => {
    logout()
    setUser(null)
  }, [setUser])

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isFarmer: user?.role === 'farmer',
    isBuyer: user?.role === 'buyer',
    isSupplier: user?.role === 'supplier',
    isExtensionOfficer: user?.role === 'extension-officer',
    login: doLogin,
    register: doRegister,
    logout: doLogout,
  }
}
