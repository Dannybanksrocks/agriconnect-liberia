import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  CartItem, ConsumerUser, DeliveryAddress, Order,
  OrderStatus, ScheduledOrder,
} from '@/lib/types/shop'

const USD_RATE = 189

interface ShopState {
  consumer: ConsumerUser | null
  setConsumer: (user: ConsumerUser | null) => void
  logoutConsumer: () => void

  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (listingId: string) => void
  updateQuantity: (listingId: string, qty: number) => void
  updateFulfillment: (listingId: string, type: CartItem['fulfillmentType']) => void
  clearCart: () => void
  cartCount: () => number
  cartTotal: () => number

  savedItems: string[]
  toggleSaved: (listingId: string) => void

  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void

  addresses: DeliveryAddress[]
  addAddress: (addr: DeliveryAddress) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void

  scheduledOrders: ScheduledOrder[]
  addScheduledOrder: (o: ScheduledOrder) => void
  cancelScheduledOrder: (id: string) => void
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      consumer: null,
      setConsumer: (consumer) => set({ consumer }),
      logoutConsumer: () => set({ consumer: null }),

      cartItems: [],
      addToCart: (item) =>
        set((s) => {
          const existing = s.cartItems.find((c) => c.listingId === item.listingId)
          if (existing) {
            return {
              cartItems: s.cartItems.map((c) =>
                c.listingId === item.listingId
                  ? { ...c, quantity: Math.min(c.quantity + item.quantity, c.maxQuantity) }
                  : c
              ),
            }
          }
          return { cartItems: [...s.cartItems, item] }
        }),
      removeFromCart: (listingId) =>
        set((s) => ({ cartItems: s.cartItems.filter((c) => c.listingId !== listingId) })),
      updateQuantity: (listingId, qty) =>
        set((s) => ({
          cartItems: s.cartItems.map((c) =>
            c.listingId === listingId ? { ...c, quantity: Math.max(1, Math.min(qty, c.maxQuantity)) } : c
          ),
        })),
      updateFulfillment: (listingId, type) =>
        set((s) => ({
          cartItems: s.cartItems.map((c) =>
            c.listingId === listingId ? { ...c, fulfillmentType: type } : c
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
      cartCount: () => get().cartItems.reduce((sum, c) => sum + c.quantity, 0),
      cartTotal: () =>
        get().cartItems.reduce((sum, c) => sum + c.pricePerUnitLRD * c.quantity, 0),

      savedItems: [],
      toggleSaved: (listingId) =>
        set((s) => ({
          savedItems: s.savedItems.includes(listingId)
            ? s.savedItems.filter((id) => id !== listingId)
            : [...s.savedItems, listingId],
        })),

      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  updatedAt: new Date().toISOString(),
                  statusHistory: [
                    ...o.statusHistory,
                    { status, timestamp: new Date().toISOString() },
                  ],
                }
              : o
          ),
        })),

      addresses: [],
      addAddress: (addr) =>
        set((s) => {
          const updated = addr.isDefault
            ? s.addresses.map((a) => ({ ...a, isDefault: false }))
            : [...s.addresses]
          return { addresses: [...updated, addr] }
        }),
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefaultAddress: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      scheduledOrders: [],
      addScheduledOrder: (o) => set((s) => ({ scheduledOrders: [...s.scheduledOrders, o] })),
      cancelScheduledOrder: (id) =>
        set((s) => ({
          scheduledOrders: s.scheduledOrders.map((o) =>
            o.id === id ? { ...o, active: false } : o
          ),
        })),
    }),
    {
      name: 'agrihub_shop',
      partialize: (s) => ({
        consumer: s.consumer,
        cartItems: s.cartItems,
        savedItems: s.savedItems,
        orders: s.orders,
        addresses: s.addresses,
        scheduledOrders: s.scheduledOrders,
      }),
    }
  )
)
