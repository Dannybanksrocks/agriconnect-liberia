'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronLeft, Package } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import PaymentMethodSelector from '@/components/shop/PaymentMethodSelector'
import type { MobileMoneyProvider, Order, OrderStatusEvent } from '@/lib/types/shop'
import Link from 'next/link'

const USD_RATE = 189
const DELIVERY_FEE = 150

export default function CheckoutPage() {
  const router = useRouter()
  const cartItems = useShopStore((s) => s.cartItems)
  const consumer = useShopStore((s) => s.consumer)
  const addresses = useShopStore((s) => s.addresses)
  const addOrder = useShopStore((s) => s.addOrder)
  const clearCart = useShopStore((s) => s.clearCart)

  const [payMethod, setPayMethod] = useState<MobileMoneyProvider | ''>('')
  const [payPhone, setPayPhone] = useState(consumer?.phone.replace('+231', '') ?? '')
  const [payPhoneError, setPayPhoneError] = useState('')
  const [placing, setPlacing] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const deliveryAddr = addresses.find((a) => a.isDefault) ?? addresses[0]
  const hasDelivery = cartItems.some((c) => c.fulfillmentType === 'delivery')
  const subtotal = cartItems.reduce((s, c) => s + c.pricePerUnitLRD * c.quantity, 0)
  const delivery = hasDelivery ? DELIVERY_FEE : 0
  const total = subtotal + delivery

  if (!cartItems.length && !orderId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/shop/products" className="text-green-600 font-medium hover:underline">Browse products</Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (!payMethod) { toast.error('Please select a payment method'); return }
    if (!payPhone || !/^\d{8,10}$/.test(payPhone)) { setPayPhoneError('Enter a valid 8–10 digit number'); return }
    setPayPhoneError(''); setPlacing(true)
    await new Promise((r) => setTimeout(r, 1800))

    const id = `ORD-${Date.now()}`
    const now = new Date().toISOString()
    const order: Order = {
      id,
      consumerId: consumer?.id ?? 'guest',
      items: cartItems.map((c) => ({
        listingId: c.listingId, cropName: c.cropName, emoji: c.emoji,
        quantity: c.quantity, unit: c.unit, pricePerUnitLRD: c.pricePerUnitLRD,
        farmerName: c.farmerName, farmerId: 'farmer-seed', farmerPhone: c.farmerPhone,
      })),
      status: 'placed',
      fulfillmentType: cartItems[0]?.fulfillmentType ?? 'delivery',
      paymentMethod: payMethod,
      paymentStatus: 'paid',
      mobileMoneyNumber: `+231${payPhone}`,
      totalLRD: total,
      totalUSD: parseFloat((total / USD_RATE).toFixed(2)),
      deliveryFee: delivery,
      deliveryAddress: deliveryAddr,
      statusHistory: [{ status: 'placed', timestamp: now, note: `Paid via ${payMethod === 'mtn-momo' ? 'MTN MoMo' : 'Orange Money'}` }],
      createdAt: now,
      updatedAt: now,
    }
    addOrder(order); clearCart()
    setOrderId(id); setPlacing(false)
    toast.success('Order placed successfully!')
  }

  if (orderId) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-10 h-10 text-white" />
      </motion.div>
      <div><h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2><p className="text-gray-500 mt-1 text-sm">Payment confirmed · Your order is being processed</p></div>
      <div className="inline-block px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-mono font-bold">{orderId}</div>
      <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-800 text-left space-y-1">
        <p className="font-semibold">📱 WhatsApp notification sent</p>
        <p>The farmer will contact you within 2–4 hours to confirm delivery details.</p>
      </div>
      <div className="flex flex-col gap-3">
        <Link href={`/shop/orders/${orderId}`} className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition">
          <Package className="w-4 h-4" /> Track My Order
        </Link>
        <Link href="/shop" className="py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/shop/cart" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6"><ChevronLeft className="w-4 h-4" /> Back to Cart</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery address */}
          {hasDelivery && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Address</h3>
              {deliveryAddr ? (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm">
                  <p className="font-semibold text-gray-900">{deliveryAddr.label} — {deliveryAddr.county}</p>
                  <p className="text-gray-600">{deliveryAddr.district && `${deliveryAddr.district}, `}{deliveryAddr.landmark}</p>
                  <p className="text-gray-500">+231{deliveryAddr.phone}</p>
                </div>
              ) : (
                <Link href="/shop/cart" className="text-sm text-green-600 hover:underline">← Add delivery address in cart</Link>
              )}
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment Method</h3>
            <PaymentMethodSelector value={payMethod} onChange={setPayMethod} phone={payPhone} phoneOnChange={setPayPhone} phoneError={payPhoneError} />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 h-fit space-y-4">
          <h3 className="font-bold text-gray-900">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.listingId} className="flex justify-between text-sm text-gray-600">
                <span className="truncate flex-1">{item.emoji} {item.cropName} × {item.quantity}</span>
                <span className="flex-shrink-0 ml-2 font-medium">L${(item.pricePerUnitLRD * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>L${subtotal.toLocaleString()}</span></div>
            {delivery > 0 && <div className="flex justify-between text-gray-600"><span>Delivery</span><span>L${delivery}</span></div>}
            <div className="flex justify-between font-bold text-gray-900 text-base pt-1"><span>Total</span><span className="text-green-700">L${total.toLocaleString()}</span></div>
            <p className="text-xs text-gray-400">≈ ${(total / USD_RATE).toFixed(2)} USD</p>
          </div>
          <button onClick={handlePlaceOrder} disabled={placing}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition disabled:opacity-60">
            {placing ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Place Order</>}
          </button>
          <p className="text-xs text-gray-400 text-center">Payment goes directly to the farmer's mobile money wallet</p>
        </div>
      </div>
    </div>
  )
}
