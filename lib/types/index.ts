export interface County {
  id: string
  name: string
  capital: string
  region: 'coastal' | 'central' | 'interior'
}

export interface Crop {
  id: string
  name: string
  category: CropCategory
  unit: 'kg' | 'liter' | 'bunch' | 'piece' | 'stalk'
  emoji: string
  priceRange: { min: number; max: number }
}

export type CropCategory = 'grain' | 'vegetable' | 'fruit' | 'legume' | 'cash-crop' | 'root'

export interface MarketPrice {
  id: string
  cropId: string
  cropName: string
  category: CropCategory
  emoji: string
  county: string
  market: string
  priceLD: number
  priceUSD: number
  unit: string
  change7d: number
  trend: number[]
  history30d: number[]
  updatedAt: string
}

export interface WeatherForecast {
  county: string
  current: {
    temp: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDirection: string
    uvIndex: number
    rainChance: number
    condition: WeatherCondition
    description: string
  }
  hourly: Array<{
    hour: string
    temp: number
    rainChance: number
    condition: string
  }>
  daily: Array<{
    day: string
    date: string
    high: number
    low: number
    rainChance: number
    condition: string
    description: string
  }>
  rainfall30d: Array<{ date: string; mm: number }>
  agricultural: {
    plantingWindow: string
    harvestCondition: string
    alerts: Array<{
      type: 'warning' | 'info' | 'success'
      message: string
    }>
  }
}

export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'

export interface AgronomyTip {
  id: string
  slug: string
  title: string
  category: TipCategory
  summary: string
  content: string
  steps: Array<{ title: string; description: string }>
  readTimeMinutes: number
  imageUrl: string
  audioAvailable: boolean
  languages: string[]
  publishedAt: string
  featured: boolean
  tags: string[]
}

export type TipCategory =
  | 'rice'
  | 'cassava'
  | 'vegetables'
  | 'soil'
  | 'pest-control'
  | 'post-harvest'

export interface FarmCrop {
  id: string
  cropId: string
  cropName: string
  emoji: string
  areaAcres: number
  plantedDate: string
  expectedHarvestDate: string
  status: 'growing' | 'ready-soon' | 'harvested' | 'failed'
  notes: string
  currentPriceLD: number
}

export interface Alert {
  id: string
  type: 'weather' | 'price' | 'agronomy' | 'system'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  county?: string
  crop?: string
  read: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  phone: string
  email?: string
  county: string
  farmSizeAcres: number
  primaryCrops: string[]
  role: 'farmer' | 'admin' | 'extension-officer' | 'buyer' | 'supplier' | 'consumer'
  language: 'en' | 'kpelle' | 'bassa' | 'mende' | 'vai'
  status: 'active' | 'inactive' | 'suspended'
  joinedAt: string
  businessName?: string
  businessType?: 'buyer' | 'supplier' | 'cooperative'
}

export interface ActivityItem {
  id: string
  action: string
  timestamp: string
}

export interface ColumnDef<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
  className?: string
}

export interface MarketplaceListing {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone: string
  farmerCounty: string
  cropId: string
  cropName: string
  emoji: string
  quantityKg: number
  unit: string
  pricePerUnitLRD: number
  pricePerUnitUSD: number
  totalPriceLRD: number
  totalPriceUSD: number
  quality: 'premium' | 'standard' | 'basic'
  qualityVerified: boolean
  harvestDate: string
  availableUntil: string
  description: string
  location: string
  county: string
  photos: string[]
  status: 'available' | 'reserved' | 'sold' | 'expired'
  views: number
  inquiries: number
  createdAt: string
  updatedAt: string
}

export interface MarketplaceInquiry {
  id: string
  listingId: string
  buyerId: string
  buyerName: string
  buyerPhone: string
  message: string
  status: 'pending' | 'replied' | 'closed'
  createdAt: string
}

export interface PaymentInfo {
  userId: string
  mobileMoneyProvider: 'mtn-momo' | 'orange-money' | 'lonestar-momo' | null
  mobileMoneyNumber: string | null
  accountName: string | null
}
