'use client'

import { useState } from 'react'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { MarketplaceListing } from '@/lib/types'
import { Eye, EyeOff, Flag, Trash2, Star, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminListingsPage() {
  const [listings, setListings] = useState<MarketplaceListing[]>(marketplaceListings)
  const [filter, setFilter] = useState<'all' | 'available' | 'sold' | 'expired'>('all')

  const filteredListings = listings.filter((l) => {
    if (filter === 'all') return true
    return l.status === filter
  })

  const toggleFeature = (id: string) => {
    toast.success('Listing featured status updated')
  }

  const removeListing = (id: string) => {
    setListings(listings.filter((l) => l.id !== id))
    toast.success('Listing removed')
  }

  const flagListing = (id: string) => {
    toast.warning('Listing flagged for review')
  }

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === 'available').length,
    sold: listings.filter((l) => l.status === 'sold').length,
    expired: listings.filter((l) => l.status === 'expired').length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace Listings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage farmer listings and marketplace activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Listings</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.sold}</p>
              <p className="text-xs text-gray-500">Sold</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
              <p className="text-xs text-gray-500">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {(['all', 'available', 'sold', 'expired'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Farmer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Crop</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">County</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Posted</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-900">{listing.farmerName}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center gap-1">
                      {listing.emoji} {listing.cropName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{listing.county}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{listing.quantityKg} {listing.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    L${listing.pricePerUnitLRD.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'sold'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleFeature(listing.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-yellow-600 transition"
                        title="Feature listing"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => flagListing(listing.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-amber-600 transition"
                        title="Flag listing"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeListing(listing.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-red-600 transition"
                        title="Remove listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
