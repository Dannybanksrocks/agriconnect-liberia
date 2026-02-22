'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Trash2, Minus, Plus, MapPin, ChevronRight } from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'
import AddressForm from '@/components/shop/AddressForm'
import FulfillmentSelector from '@/components/shop/FulfillmentSelector'
import type { DeliveryAddress } from '@/lib/types/shop'

const USD_RATE = 189
const DELIVERY_FEE = 150

export default function CartPage() {
  const cartItems = useShopStore((s) => s.cartItems)
  const removeFromCart = useShopStore((s) => s.removeFromCart)
  const updateQuantity = useShopStore((s) => s.updateQuantity)
  const updateFulfillment = useShopStore((s) => s.updateFulfillment)
  const addresses = useShopStore((s) => s.addresses)
  const addAddress = useShopStore((s) => s.addAddress)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [selectedAddr, setSelectedAddr] = useState<string>('')

  const subtotal = cartItems.reduce((s, c) => s + c.pricePerUnitLRD * c.quantity, 0)
  const deliveryCount = cartItems.filter((c) => c.fulfillmentType === 'delivery').length
  const delivery = deliveryCount > 0 ? DELIVERY_FEE : 0
  const total = subtotal + delivery

  if (cartItems.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
      <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-4xl">🛒</div>
      <h2 className="text-xl font-bold text-stone-800">Your cart is empty</h2>
      <p className="text-stone-500 text-sm">Browse fresh produce from Liberian farmers and add items to your cart.</p>
      <Link href="/shop/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4332] text-white font-semibold hover:bg-[#2D6A4F] transition">
        <ShoppingCart className="w-4 h-4" /> Browse Products
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">
        Shopping Cart <span className="text-stone-400 font-normal text-lg">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.listingId} className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img src={item.imageUrl} alt={item.cropName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-stone-800">{item.emoji} {item.cropName}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{item.farmerName}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.listingId)} className="text-stone-400 hover:text-red-500 transition p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.listingId, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.listingId, item.quantity + 1)} className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition">
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-xs text-stone-400">{item.unit}</span>
                    </div>
                    <span className="font-bold text-[#1B4332]">L${(item.pricePerUnitLRD * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3">
                <p className="text-xs font-semibold text-stone-500 mb-2">Fulfillment</p>
                <FulfillmentSelector value={item.fulfillmentType} onChange={(v) => updateFulfillment(item.listingId, v)} />
              </div>
            </div>
          ))}

          {/* Delivery address */}
          {deliveryCount > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1B4332]" /> Delivery Address
              </h3>
              {addresses.length === 0 ? (
                !showAddressForm ? (
                  <button onClick={() => setShowAddressForm(true)} className="w-full py-3 rounded-xl border-2 border-dashed border-stone-200 text-sm text-stone-500 hover:border-[#52B788]/50 hover:text-[#1B4332] transition">
                    + Add Delivery Address
                  </button>
                ) : (
                  <AddressForm onSave={(addr) => { addAddress(addr); setSelectedAddr(addr.id); setShowAddressForm(false) }} onCancel={() => setShowAddressForm(false)} />
                )
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
                  {!showAddressForm && (
                    <button onClick={() => setShowAddressForm(true)} className="text-sm text-[#1B4332] hover:underline mt-1">+ Add new address</button>
                  )}
                  {showAddressForm && (
                    <AddressForm onSave={(addr) => { addAddress(addr); setSelectedAddr(addr.id); setShowAddressForm(false) }} onCancel={() => setShowAddressForm(false)} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h3 className="text-base font-bold text-stone-800 mb-4">Order Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <span>L${subtotal.toLocaleString()}</span>
              </div>
              {delivery > 0 && (
                <div className="flex justify-between text-stone-600"><span>Delivery fee</span><span>L${delivery}</span></div>
              )}
              <div className="flex justify-between font-bold text-stone-800 border-t border-stone-100 pt-2.5 text-base">
                <span>Total</span>
                <span className="text-[#1B4332]">L${total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-stone-400">(≈ ${(total / USD_RATE).toFixed(2)} USD)</p>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#D8F3DC] border border-[#52B788]/30 text-xs text-[#1B4332] space-y-1">
              <p className="font-semibold">Accepted Payment</p>
              <p>MTN MoMo (Lonestar) · Orange Money</p>
              <p className="text-[#2D6A4F]">Payments go directly to farmers</p>
            </div>

            <Link href="/shop/checkout" className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-sm transition">
              Proceed to Checkout <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/shop/products" className="block text-center text-sm text-stone-500 hover:text-stone-700 mt-3">Continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
