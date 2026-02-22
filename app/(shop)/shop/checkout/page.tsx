'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ChevronLeft, Smartphone, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import PaymentMethodSelector from '@/components/shop/PaymentMethodSelector'
import type { MobileMoneyProvider } from '@/lib/types/shop'

export default function CheckoutPage() {
  const router = useRouter()
  const cartItems = useShopStore((s) => s.cartItems)
  const addresses = useShopStore((s) => s.addresses)
  const addOrder = useShopStore((s) => s.addOrder)
  const clearCart = useShopStore((s) => s.clearCart)
  const consumer = useShopStore((s) => s.consumer)
  const [paymentProvider, setPaymentProvider] = useState<MobileMoneyProvider | ''>('')
  const [paymentPhone, setPaymentPhone] = useState('')
  const [paymentPhoneError, setPaymentPhoneError] = useState('')
  const [selectedAddr, setSelectedAddr] = useState<string>(addresses[0]?.id || '')
  const [isPlacing, setIsPlacing] = useState(false)

  const subtotal = cartItems.reduce((s, c) => s + c.pricePerUnitLRD * c.quantity, 0)
  const deliveryFee = cartItems.filter((c) => c.fulfillmentType === 'delivery').length > 0 ? 150 : 0
  const total = subtotal + deliveryFee
  const USD_RATE = 189

  const hasDelivery = cartItems.some((c) => c.fulfillmentType === 'delivery')

  const handlePlaceOrder = async () => {
    let valid = true
    if (!paymentProvider) { toast.error('Please select a payment method'); valid = false }
    if (paymentProvider && !/^\d{8,10}$/.test(paymentPhone)) {
      setPaymentPhoneError('Enter 8-10 digit mobile money number')
      valid = false
    } else setPaymentPhoneError('')
    if (hasDelivery && !selectedAddr) { toast.error('Please select a delivery address'); valid = false }
    if (!valid) return
    setIsPlacing(true)
    await new Promise((r) => setTimeout(r, 1200))
    const orderId = `order_${Date.now()}`
    const deliveryAddr = addresses.find((a) => a.id === selectedAddr)
    addOrder({
      id: orderId,
      consumerId: consumer?.id ?? 'guest',
      items: cartItems.map((c) => ({
        listingId: c.listingId,
        cropName: c.cropName,
        emoji: c.emoji,
        quantity: c.quantity,
        unit: c.unit,
        pricePerUnitLRD: c.pricePerUnitLRD,
        farmerName: c.farmerName,
        farmerId: c.listingId,
        farmerPhone: c.farmerPhone,
      })),
      status: 'placed',
      fulfillmentType: cartItems[0]?.fulfillmentType ?? 'delivery',
      paymentMethod: paymentProvider as MobileMoneyProvider,
      paymentStatus: 'pending',
      mobileMoneyNumber: paymentPhone,
      totalLRD: total,
      totalUSD: parseFloat((total / USD_RATE).toFixed(2)),
      deliveryFee,
      deliveryAddress: deliveryAddr,
      statusHistory: [{ status: 'placed', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    clearCart()
    toast.success('Order placed! You will receive an SMS confirmation.')
    router.push(`/shop/orders/${orderId}`)
    setIsPlacing(false)
  }

  if (cartItems.length === 0) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <div className="text-5xl">🛒</div>
      <h2 className="text-xl font-bold text-stone-800">Your cart is empty</h2>
      <Link href="/shop/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#2D6A4F] transition">Shop Now</Link>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/shop/cart" className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm font-semibold text-stone-700">Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery address */}
          {hasDelivery && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1B4332]" /> Delivery Address
              </h3>
              {addresses.length === 0 ? (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-500 text-center">
                  No address saved. <Link href="/shop/cart" className="text-[#1B4332] hover:underline font-medium">Go back to add one.</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <button key={addr.id} onClick={() => setSelectedAddr(addr.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition ${selectedAddr === addr.id ? 'border-[#1B4332] bg-[#D8F3DC]/40' : 'border-stone-200 hover:border-stone-300'}`}
                    >
                      <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{addr.label} — {addr.county}</p>
                        <p className="text-xs text-stone-500">{addr.landmark}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#1B4332]" /> Mobile Money Payment
            </h3>
            <PaymentMethodSelector
              value={paymentProvider}
              onChange={setPaymentProvider}
              phone={paymentPhone}
              phoneOnChange={setPaymentPhone}
              phoneError={paymentPhoneError}
            />
          </div>

          {/* Order items summary */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h3 className="font-bold text-stone-800 mb-4">Items ({cartItems.length})</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.listingId} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img src={item.imageUrl} alt={item.cropName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.emoji} {item.cropName}</p>
                    <p className="text-xs text-stone-500">{item.quantity} {item.unit} · {item.farmerName}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1B4332]">L${(item.pricePerUnitLRD * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-20">
            <h3 className="font-bold text-stone-800 mb-4">Order Total</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>L${subtotal.toLocaleString()}</span></div>
              {deliveryFee > 0 && <div className="flex justify-between text-stone-600"><span>Delivery</span><span>L${deliveryFee}</span></div>}
              <div className="flex justify-between font-bold text-stone-800 border-t border-stone-100 pt-2.5 text-base">
                <span>Total</span><span className="text-[#1B4332]">L${total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-stone-400">(≈ ${(total / USD_RATE).toFixed(2)} USD)</p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm transition disabled:opacity-60"
            >
              {isPlacing ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><CheckCircle className="w-4 h-4" /> Place Order</>
              )}
            </button>
            <p className="text-xs text-stone-400 text-center mt-3">You will receive an SMS confirmation to your registered number</p>
          </div>
        </div>
      </div>
    </div>
  )
}
