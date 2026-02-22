export interface InventoryItem {
  id: string
  farmerId: string
  cropId: string
  cropName: string
  emoji: string
  harvestDate: string
  quantityKg: number
  unit: string
  qualityGrade: 'premium' | 'standard' | 'basic'
  storageLocation: string
  status: 'in-stock' | 'sold' | 'lost' | 'personal-use'
  notes: string
  createdAt: string
  updatedAt: string
}

export interface InventoryTransaction {
  id: string
  inventoryItemId: string
  type: 'harvest' | 'sale' | 'loss' | 'personal-use'
  quantityKg: number
  pricePerUnitLRD?: number
  totalPriceLRD?: number
  buyerName?: string
  buyerPhone?: string
  lossReason?: 'spoilage' | 'pests' | 'theft' | 'weather' | 'other'
  lossDetails?: string
  transactionDate: string
  createdAt: string
}

export interface InventorySummary {
  totalHarvested: number
  totalSold: number
  totalLost: number
  totalInStock: number
  totalRevenueLRD: number
  averagePriceLRD: number
  lossPercentage: number
}
