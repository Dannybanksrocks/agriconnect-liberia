'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, MapPin, ShoppingBag, Calendar, Heart, LogOut, Plus } from 'lucide-react'
import { useShopStore } from '@/lib/store/useShopStore'
import { sampleOrders } from '@/lib/mock-data/shop-orders'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import AddressForm from '@/components/shop/AddressForm'
import type { DeliveryAddress } from '@/lib/types/shop'

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700', confirmed: 'bg-yellow-100 text-yellow-700',
  'out-for-delivery': 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
}

export default function AccountPage() {
  const router = useRouter()
  const consumer = useShopStore((s) => s.consumer)
  const logoutConsumer = useShopStore((s) => s.logoutConsumer)
  const addresses = useShopStore((s) => s.addresses)
  const addAddress = useShopStore((s) => s.addAddress)
  const removeAddress = useShopStore((s) => s.removeAddress)
  const savedItems = useShopStore((s) => s.savedItems)
  const toggleSaved = useShopStore((s) => s.toggleSaved)
  const scheduledOrders = useShopStore((s) => s.scheduledOrders)
  const cancelScheduled = useShopStore((s) => s.cancelScheduledOrder)
  const storeOrders = useShopStore((s) => s.orders)
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'saved' | 'scheduled'>('orders')

  if (!consumer) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Sign in to view your account</h2>
      <Link href="/shop/auth/login" className="inline-block px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm">Sign In</Link>
    </div>
  )

  const allOrders = [...storeOrders, ...sampleOrders.filter((o) => o.consumerId === consumer.id)]
  const savedListings = marketplaceListings.filter((l) => savedItems.includes(l.id))

  const handleLogout = () => { logoutConsumer(); router.push('/shop') }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
            {consumer.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{consumer.fullName}</h1>
            <p className="text-sm text-gray-500">{consumer.email ?? consumer.phone} · {consumer.county}</p>
            <p className="text-xs text-gray-400 mt-0.5">Member since {new Date(consumer.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {([
          { id: 'orders', label: 'My Orders', icon: ShoppingBag },
          { id: 'addresses', label: 'Addresses', icon: MapPin },
          { id: 'saved', label: 'Saved Items', icon: Heart },
          { id: 'scheduled', label: 'Recurring', icon: Calendar },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === id ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}
          ><Icon className="w-4 h-4" />{label}</button>
        ))}
      </div>

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {allOrders.length === 0 ? <p className="text-gray-500 text-sm">No orders yet.</p> : allOrders.map((o) => (
            <Link key={o.id} href={`/shop/orders/${o.id}`} className="block bg-white rounded-2xl border border-gray-200 p-4 hover:border-green-300 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900 font-mono">{o.id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{o.items.map((i) => `${i.emoji} ${i.cropName}`).join(', ')}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{o.status.replace('-', ' ')}</span>
                  <p className="text-sm font-bold text-green-700 mt-1">L${o.totalLRD.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-start justify-between gap-3">
              <div><p className="text-sm font-bold text-gray-900">{addr.label} — {addr.county}</p><p className="text-xs text-gray-500">{addr.district && `${addr.district}, `}{addr.landmark}</p>{addr.isDefault && <span className="text-xs text-green-600 font-medium mt-1 inline-block">✓ Default</span>}</div>
              <button onClick={() => removeAddress(addr.id)} className="text-xs text-red-500 hover:text-red-700 flex-shrink-0">Remove</button>
            </div>
          ))}
          {!showAddrForm ? (
            <button onClick={() => setShowAddrForm(true)} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-500 hover:border-green-300 hover:text-green-600 transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Address
            </button>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <AddressForm onSave={(addr: DeliveryAddress) => { addAddress(addr); setShowAddrForm(false) }} onCancel={() => setShowAddrForm(false)} />
            </div>
          )}
        </div>
      )}

      {/* Saved */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedListings.length === 0 ? <p className="text-gray-500 text-sm">No saved items.</p> : savedListings.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{l.emoji}</span>
                <div><p className="text-sm font-bold text-gray-900">{l.cropName}</p><p className="text-xs text-gray-500">{l.county} · L${l.pricePerUnitLRD}/{l.unit}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/shop/products/${l.id}`} className="text-xs text-green-600 font-medium hover:underline">View</Link>
                <button onClick={() => toggleSaved(l.id)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled */}
      {activeTab === 'scheduled' && (
        <div className="space-y-3">
          {scheduledOrders.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-gray-500 text-sm">No recurring orders yet.</p>
              <p className="text-xs text-gray-400">Choose "Recurring Order" when adding items to cart to set up scheduled deliveries.</p>
            </div>
          ) : scheduledOrders.map((so) => (
            <div key={so.id} className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div><p className="text-sm font-bold text-gray-900">{so.frequency.charAt(0).toUpperCase() + so.frequency.slice(1)} Order</p><p className="text-xs text-gray-500 mt-0.5">Next: {new Date(so.nextDelivery).toLocaleDateString('en-GB',{day:'numeric',month:'short'})} · L${so.totalLRD.toLocaleString()}</p></div>
                {so.active && <button onClick={() => cancelScheduled(so.id)} className="text-xs text-red-500 hover:text-red-700">Cancel</button>}
                {!so.active && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
