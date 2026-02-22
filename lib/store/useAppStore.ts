import { create } from 'zustand'
import type { User, FarmCrop } from '@/lib/types'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void

  selectedCounty: string
  setSelectedCounty: (county: string) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  unreadAlertCount: number
  setUnreadAlertCount: (count: number) => void

  farmCrops: FarmCrop[]
  addFarmCrop: (crop: FarmCrop) => void
  removeFarmCrop: (id: string) => void
  updateFarmCrop: (id: string, data: Partial<FarmCrop>) => void

  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  language: 'en' | 'kpelle' | 'bassa' | 'mende' | 'vai'
  setLanguage: (lang: 'en' | 'kpelle' | 'bassa' | 'mende' | 'vai') => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  selectedCounty: 'Montserrado',
  setSelectedCounty: (county) => set({ selectedCounty: county }),
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  unreadAlertCount: 7,
  setUnreadAlertCount: (count) => set({ unreadAlertCount: count }),

  farmCrops: [
    {
      id: 'fc-1',
      cropId: 'rice',
      cropName: 'Rice',
      emoji: '🌾',
      areaAcres: 2.5,
      plantedDate: '2024-11-15',
      expectedHarvestDate: '2025-03-15',
      status: 'growing',
      notes: 'Lowland swamp rice, NERICA variety',
      currentPriceLD: 320,
    },
    {
      id: 'fc-2',
      cropId: 'cassava',
      cropName: 'Cassava',
      emoji: '🥔',
      areaAcres: 1.5,
      plantedDate: '2024-09-01',
      expectedHarvestDate: '2025-06-01',
      status: 'growing',
      notes: 'Intercropped with groundnuts',
      currentPriceLD: 55,
    },
    {
      id: 'fc-3',
      cropId: 'groundnut',
      cropName: 'Groundnut',
      emoji: '🥜',
      areaAcres: 0.5,
      plantedDate: '2024-10-01',
      expectedHarvestDate: '2025-02-28',
      status: 'ready-soon',
      notes: 'Ready for harvest next week',
      currentPriceLD: 200,
    },
  ],
  addFarmCrop: (crop) =>
    set((state) => ({ farmCrops: [...state.farmCrops, crop] })),
  removeFarmCrop: (id) =>
    set((state) => ({
      farmCrops: state.farmCrops.filter((c) => c.id !== id),
    })),
  updateFarmCrop: (id, data) =>
    set((state) => ({
      farmCrops: state.farmCrops.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),

  theme: 'light',
  setTheme: (theme) => set({ theme }),
  language: 'en',
  setLanguage: (language) => set({ language }),
}))
