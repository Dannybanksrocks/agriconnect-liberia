'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, MapPin, CheckCircle, Star } from 'lucide-react'
import { toast } from 'sonner'
import { useShopStore } from '@/lib/store/useShopStore'
import { getCropImage } from '@/lib/constants/cropImages'
import { getAverageRating, getReviewsForListing } from '@/lib/mock-data/shop-reviews'
import type { MarketplaceListing } from '@/lib/types'

interface Props { listing: MarketplaceListing }

export default function ProductCard({ listing }: Props) {
  const addToCart = useShopStore((s) => s.addToCart)
  const savedItems = useShopStore((s) => s.savedItems)
  const toggleSaved = useShopStore((s) => s.toggleSaved)
  const isSaved = savedItems.includes(listing.id)
  const avg = getAverageRating(listing.id)
  const count = getReviewsForListing(listing.id).length
  const fallback = getCropImage(listing.cropName)
  const [imgSrc, setImgSrc] = useState(listing.photos[0] || fallback)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
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

  return (
    <div className="group bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:border-[#52B788]/40 transition-all duration-200">
      <Link href={`/shop/products/${listing.id}`}>
        <div className="relative h-48 overflow-hidden bg-stone-50">
          <img
            src={imgSrc}
            alt={listing.cropName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgSrc(fallback)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {listing.qualityVerified && (
            <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#1B4332] text-white text-xs font-semibold">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleSaved(listing.id) }}
            className={`absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-sm transition ${isSaved ? 'bg-red-500 text-white' : 'bg-white/80 text-stone-500 hover:bg-white'}`}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-stone-800 text-sm group-hover:text-[#1B4332] transition-colors line-clamp-1">
                {listing.emoji} {listing.cropName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                {avg > 0 && (
                  <>
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-stone-400">{avg.toFixed(1)} ({count})</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-[#1B4332] text-base">L${listing.pricePerUnitLRD}</p>
              <p className="text-xs text-stone-400">/{listing.unit}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-2 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="flex items-center justify-between mt-1 text-xs text-stone-400">
            <span>{listing.quantityKg} {listing.unit} available</span>
            <span className="capitalize text-stone-500">{listing.quality}</span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-sm font-semibold transition"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  )
}
