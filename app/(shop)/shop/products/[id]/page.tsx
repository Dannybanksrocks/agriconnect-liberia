'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import {
  MapPin, Package, CheckCircle, ShoppingCart,
  Star, Phone, MessageCircle, ExternalLink, ChevronLeft,
} from 'lucide-react'
import { toast } from 'sonner'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { useShopStore } from '@/lib/store/useShopStore'
import { getCropImage, FALLBACK_CROP_IMAGE } from '@/lib/constants/cropImages'
import { getAverageRating, getReviewsForListing } from '@/lib/mock-data/shop-reviews'
import BackButton from '@/components/shared/BackButton'

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const addToCart = useShopStore((s) => s.addToCart)
  const savedItems = useShopStore((s) => s.savedItems)
  const toggleSaved = useShopStore((s) => s.toggleSaved)

  const listing = marketplaceListings.find((l) => l.id === id)

  if (!listing) {
    router.push('/shop/products')
    return null
  }

  const isSaved = savedItems.includes(listing.id)
  const avg = getAverageRating(listing.id)
  const reviews = getReviewsForListing(listing.id)
  const cropFallback = getCropImage(listing.cropName)
  const photos = listing.photos.filter(Boolean)
  const [imgSrc, setImgSrc] = useState(photos[0] || cropFallback)
  const [fallbackIdx, setFallbackIdx] = useState(0)

  const handleImgError = () => {
    const chain = [...photos.slice(1), cropFallback, FALLBACK_CROP_IMAGE]
    const next = chain[fallbackIdx]
    if (next && next !== imgSrc) {
      setImgSrc(next)
      setFallbackIdx((i) => i + 1)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      listingId: listing.id,
      cropName: listing.cropName,
      emoji: listing.emoji,
      imageUrl: imgSrc,
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      pricePerUnitLRD: listing.pricePerUnitLRD,
      pricePerUnitUSD: listing.pricePerUnitUSD,
      unit: listing.unit,
      maxQuantity: listing.quantityKg,
      quantity: 1,
      fulfillmentType: 'delivery',
    })
    toast.success(`${listing.emoji} ${listing.cropName} added to cart!`)
  }

  const parts = listing.farmerName.split(' ')
  const initials = parts.map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const whatsappMsg = encodeURIComponent(
    `Hi ${parts[0]}, I'm interested in your ${listing.cropName} listing on AgriHub. Is it still available?`
  )
  const whatsappUrl = `https://wa.me/${listing.farmerPhone.replace(/\D/g, '')}?text=${whatsappMsg}`

  const qualityBadge =
    listing.quality === 'premium'
      ? 'bg-yellow-100 text-yellow-800'
      : listing.quality === 'standard'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-700'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto px-4 pt-4"><BackButton href="/shop/products" label="Back to Products" /></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-stone-50 h-80">
            <img
              src={imgSrc}
              alt={listing.cropName}
              className="w-full h-full object-cover"
              onError={handleImgError}
            />
            {listing.qualityVerified && (
              <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1B4332] text-white text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Verified
              </span>
            )}
            <button
              onClick={() => toggleSaved(listing.id)}
              className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-base transition ${isSaved ? 'bg-red-500 text-white' : 'bg-white/90 text-stone-500 hover:bg-white'}`}
            >
              {isSaved ? '♥' : '♡'}
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {listing.emoji} {listing.cropName}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${qualityBadge}`}>
                {listing.quality}
              </span>
              {avg > 0 && (
                <span className="flex items-center gap-1 text-xs text-stone-500">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  {avg.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-3xl font-bold text-[#1B4332]">L${listing.pricePerUnitLRD.toLocaleString()}</p>
            <p className="text-sm text-stone-400 mt-0.5">per {listing.unit} · ${listing.pricePerUnitUSD} USD</p>
          </div>

          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>{listing.quantityKg} {listing.unit} available</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>{listing.location}, {listing.county} County</span>
            </div>
          </div>

          {listing.description && (
            <p className="text-sm text-stone-500 leading-relaxed">{listing.description}</p>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold transition"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#25D366] text-[#128C7E] hover:bg-green-50 font-medium text-sm transition"
            >
              <MessageCircle className="w-4 h-4" /> Ask Farmer on WhatsApp
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* Farmer card */}
      <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-5 shadow-sm max-w-sm">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Farmer</p>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-stone-800">{listing.farmerName.split(' ')[0]} {listing.farmerName.split(' ')[1]?.[0]}.</p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-600">Verified Farmer · {listing.county}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Reviews</h2>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-stone-700">{r.consumerName}</p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-stone-500">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
