export type FulfillmentType = 'pickup' | 'delivery' | 'bulk' | 'scheduled'
export type OrderStatus = 'placed' | 'confirmed' | 'out-for-delivery' | 'delivered' | 'cancelled'
export type ScheduledFrequency = 'weekly' | 'biweekly' | 'monthly'
export type MobileMoneyProvider = 'mtn-momo' | 'orange-money'

export interface ConsumerUser {
  id: string
  fullName: string
  phone: string
  email?: string
  password: string
  county: string
  landmark: string
  role: 'consumer'
  joinedAt: string
}

export interface DeliveryAddress {
  id: string
  label: string
  county: string
  district: string
  landmark: string
  phone: string
  isDefault: boolean
}

export interface CartItem {
  listingId: string
  cropName: string
  emoji: string
  imageUrl: string
  farmerName: string
  farmerPhone: string
  pricePerUnitLRD: number
  pricePerUnitUSD: number
  unit: string
  maxQuantity: number
  quantity: number
  fulfillmentType: FulfillmentType
  bulkMinQty?: number
  scheduledFrequency?: ScheduledFrequency
  deliveryAddress?: DeliveryAddress
}

export interface OrderItem {
  listingId: string
  cropName: string
  emoji: string
  quantity: number
  unit: string
  pricePerUnitLRD: number
  farmerName: string
  farmerId: string
  farmerPhone: string
}

export interface OrderStatusEvent {
  status: OrderStatus
  timestamp: string
  note?: string
}

export interface Order {
  id: string
  consumerId: string
  items: OrderItem[]
  status: OrderStatus
  fulfillmentType: FulfillmentType
  paymentMethod: MobileMoneyProvider
  paymentStatus: 'pending' | 'paid' | 'failed'
  mobileMoneyNumber: string
  totalLRD: number
  totalUSD: number
  deliveryFee: number
  deliveryAddress?: DeliveryAddress
  statusHistory: OrderStatusEvent[]
  createdAt: string
  updatedAt: string
}

export interface ProductReview {
  id: string
  listingId: string
  consumerId: string
  consumerName: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  createdAt: string
  verified: boolean
}

export interface ScheduledOrder {
  id: string
  consumerId: string
  items: CartItem[]
  frequency: ScheduledFrequency
  nextDelivery: string
  active: boolean
  paymentMethod: MobileMoneyProvider
  totalLRD: number
  createdAt: string
}
