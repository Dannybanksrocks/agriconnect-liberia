'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Filter, MapPin, Phone, CheckCircle } from 'lucide-react'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { countyNames } from '@/lib/mock-data/counties'
import { getCropImage } from '@/lib/constants/cropImages'
import type { MarketplaceListing } from '@/lib/types'

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCounty, setSelectedCounty] = useState<string>('all')
  const [selectedQuality, setSelectedQuality] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest')

  // Filter listings
  let filteredListings = marketplaceListings.filter(listing => {
    const matchesSearch = searchTerm === '' || 
      listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCounty = selectedCounty === 'all' || listing.county === selectedCounty
    const matchesQuality = selectedQuality === 'all' || listing.quality === selectedQuality
    
    return matchesSearch && matchesCounty && matchesQuality && listing.status === 'available'
  })

  // Sort listings
  filteredListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.pricePerUnitLRD - b.pricePerUnitLRD
      case 'price-high':
        return b.pricePerUnitLRD - a.pricePerUnitLRD
      case 'popular':
        return b.views - a.views
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Connect directly with farmers and buy fresh produce across Liberia
        </p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search crops, farmers, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* County Filter */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="all">All Counties</option>
            {countyNames.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
        </div>

        {/* Quality Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none cursor-pointer"
          >
            <option value="all">All Quality</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="basic">Basic</option>
          </select>
        </div>
      </div>

      {/* Sort and Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No listings found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}

function ListingCard({ listing }: { listing: MarketplaceListing }) {
  const [imgError, setImgError] = useState(false)
  const whatsappUrl = `https://wa.me/${listing.farmerPhone.replace('+', '')}?text=Hi%2C%20I%27m%20interested%20in%20your%20${listing.cropName}%20listing%20on%20AgriHub`

  return (
    <Link href={`/marketplace/${listing.id}`} className="group">
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
          {listing.photos[0] && !imgError ? (
            <img
              src={listing.photos[0]}
              alt={listing.cropName}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {listing.emoji}
            </div>
          )}
          {listing.qualityVerified && (
            <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Verified
            </div>
          )}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full px-2 py-1 text-xs font-bold capitalize">
            {listing.quality}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Price */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
              {listing.emoji} {listing.cropName}
            </h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                L${listing.pricePerUnitLRD.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/{listing.unit}</span>
              <span className="text-sm text-gray-400">
                (${listing.pricePerUnitUSD.toFixed(2)})
              </span>
            </div>
          </div>

          {/* Quantity */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {listing.quantityKg} {listing.unit}
            </span>{' '}
            available
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            {listing.location}
          </div>

          {/* Farmer Info */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {listing.farmerName}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  window.open(whatsappUrl, '_blank')
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {listing.views} views
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
