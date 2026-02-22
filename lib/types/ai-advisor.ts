export interface CropRecommendation {
  id: string
  cropName: string
  emoji: string
  recommendationScore: number // 0-100
  seasonalFit: 'perfect' | 'good' | 'fair' | 'poor'
  bestPlantingWindow: {
    start: string
    end: string
  }
  expectedYieldPerAcre: string
  marketOutlook: 'excellent' | 'good' | 'fair' | 'poor'
  estimatedPriceRange: {
    low: number
    high: number
    currency: 'LRD'
  }
  profitPotential: 'high' | 'medium' | 'low'
  reasons: string[]
  risks: string[]
  tips: string[]
}

export interface PriceForecast {
  cropName: string
  emoji: string
  currentPriceLRD: number
  forecastedPriceLRD: number
  priceChange: number
  changePercent: number
  trend: 'rising' | 'falling' | 'stable'
  confidence: 'high' | 'medium' | 'low'
  timeframe: string
  factors: string[]
}

export interface SeasonalInsight {
  season: 'dry' | 'rainy'
  currentPhase: string
  duration: string
  recommendations: string[]
  warnings: string[]
  opportunities: string[]
}

export interface AIQuestion {
  id: string
  question: string
  category: 'planting' | 'pest' | 'harvest' | 'market' | 'weather' | 'general'
  answer: string
  askedAt: string
}
