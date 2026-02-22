'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ShoppingCart, MapPin, CheckCircle, Calendar, Package, MessageCircle, ExternalLink, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { getReviewsForListing, getAverageRating } from '@/lib/mock-data/shop-reviews'
import { getCropImage } from '@/lib/constants/cropImages'
import { useShopStore } from '@/lib/store/useShopStore'
import FulfillmentSelector from '@/components/shop/FulfillmentSelector'
import RatingStars from '@/components/shop/RatingStars'
import ProductCard from '@/components/shop/ProductCard'
import type { MarketplaceListing } from '@/lib/types'
import type { FulfillmentType } from '@/lib/types/shop'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const addToCart = useShopStore((s) => s.addToCart)
  const savedItems = useShopStore((s) => s.savedItems)
  const toggleSaved = useShopStore((s) => s.toggleSaved)

  const [listing, setListing] = useState<MarketplaceListing | null>(null)
  const [qty, setQty] = useState(1)
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('delivery')
  const [imgSrc, setImgSrc] = useState('')
  const [related, setRelated] = useState<MarketplaceListing[]>([])
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    const found = marketplaceListings.find((l) => l.id === id)
    if (!found) { router.push('/shop/products'); return }
    setListing(found)
    setImgSrc(found.photos[0] || getCropImage(found.cropName))
    setRelated(marketplaceListings.filter((l) => l.id !== id && l.status === 'available').slice(0, 3))
  }, [id, router])

  if (!listing) return <div className="flex items-center justify-center min-h-96"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>

  const reviews = getReviewsForListing(listing.id)
  const avgRating = getAverageRating(listing.id)
  const isSaved = savedItems.includes(listing.id)
  const deliveryFee = fulfillment === 'delivery' ? 150 : 0
  const total = listing.pricePerUnitLRD * qty + deliveryFee
  const nameParts = listing.farmerName.split(' ')
  const whatsappMsg = encodeURIComponent(`Hi ${nameParts[0]}, I want to buy ${qty} ${listing.unit} of ${listing.cropName} from your AgriHub Shop listing at L$${listing.pricePerUnitLRD}/${listing.unit}.`)

  const handleAddToCart = () => {
    addToCart({ listingId: listing.id, cropName: listing.cropName, emoji: listing.emoji, imageUrl: imgSrc, farmerName: listing.farmerName, farmerPhone: listing.farmerPhone, pricePerUnitLRD: listing.pricePerUnitLRD, pricePerUnitUSD: listing.pricePerUnitUSD, unit: listing.unit, maxQuantity: listing.quantityKg, quantity: qty, fulfillmentType: fulfillment })
    toast.success(`${listing.emoji} ${qty} ${listing.unit} of ${listing.cropName} added to cart!`)
  }

  const handleSubmitReview = () => {
    if (!reviewRating) { toast.error('Please select a rating'); return }
    if (!reviewComment.trim()) { toast.error('Please write a short comment'); return }
    toast.success('Review submitted! Thank you.')
    setReviewRating(0); setReviewComment('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link href="/shop/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
        <ChevronLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative h-80 rounded-2xl overflow-hidden bg-gray-100">
            <img src={imgSrc} alt={listing.cropName} className="w-full h-full object-cover" onError={() => setImgSrc(getCropImage(listing.cropName))} />
            {listing.qualityVerified && <span className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white text-xs font-bold"><CheckCircle className="w-3.5 h-3.5" /> Verified</span>}
          </div>
          {/* Farmer info card */}
          <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">{nameParts.map((n: string) => n[0]).join('').slice(0,2)}</div>
              <div><p className="text-sm font-semibold text-gray-900">{nameParts[0]} {nameParts[1]?.[0]}.</p><div className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-500" /><span className="text-xs text-green-600">Verified Farmer · {listing.county}</span></div></div>
            </div>
            <a href={`https://wa.me/${listing.farmerPhone.replace(/\D/g,'')}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1ebe5a] transition">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Details + Cart */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-gray-400 capitalize">{listing.quality} quality</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{listing.emoji} {listing.cropName}</h1>
            {avgRating > 0 && <div className="flex items-center gap-2 mt-2"><RatingStars rating={Math.round(avgRating)} size="sm" /><span className="text-sm text-gray-500">{avgRating.toFixed(1)} ({reviews.length} reviews)</span></div>}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-green-700">L${listing.pricePerUnitLRD.toLocaleString()}</span>
            <span className="text-gray-400">/{listing.unit}</span>
            <span className="text-sm text-gray-400">(${listing.pricePerUnitUSD} USD)</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5"><Package className="w-4 h-4 text-gray-400" />{listing.quantityKg} {listing.unit} available</div>
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{listing.location}</div>
            <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />Harvested {new Date(listing.harvestDate).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity ({listing.unit})</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center font-bold text-gray-900 text-lg">{qty}</span>
              <button onClick={() => setQty(Math.min(listing.quantityKg, qty + 1))} className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"><Plus className="w-4 h-4" /></button>
              <span className="text-sm text-gray-400 ml-1">of {listing.quantityKg} available</span>
            </div>
          </div>

          {/* Fulfillment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fulfillment Option</label>
            <FulfillmentSelector value={fulfillment} onChange={setFulfillment} />
          </div>

          {/* Order summary */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal ({qty} {listing.unit})</span><span className="font-medium">L${(listing.pricePerUnitLRD * qty).toLocaleString()}</span></div>
            {fulfillment === 'delivery' && <div className="flex justify-between text-gray-600"><span>Delivery fee</span><span>L$150</span></div>}
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2"><span>Total</span><span className="text-green-700">L${total.toLocaleString()}</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={() => toggleSaved(listing.id)} className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl transition ${isSaved ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:bg-gray-50 text-gray-400'}`}>
              {isSaved ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
          {avgRating > 0 && <div className="flex items-center gap-2"><RatingStars rating={Math.round(avgRating)} size="sm" /><span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}/5</span><span className="text-sm text-gray-400">({reviews.length})</span></div>}
        </div>

        {reviews.length === 0 ? <p className="text-sm text-gray-400">No reviews yet. Be the first to review this product!</p> : (
          <div className="space-y-4 mb-6">
            {reviews.map((r) => (
              <div key={r.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">{r.consumerName[0]}</div>
                <div>
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-gray-900">{r.consumerName}</span>{r.verified && <span className="text-xs text-green-600 font-medium">✓ Verified</span>}<RatingStars rating={r.rating} size="sm" /></div>
                  <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write review */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Write a Review</h3>
          <RatingStars rating={reviewRating} size="lg" interactive onChange={setReviewRating} />
          <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your experience with this product..." className="mt-3 w-full h-24 px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-green-500" />
          <button onClick={handleSubmitReview} className="mt-3 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition">Submit Review</button>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map((l) => <ProductCard key={l.id} listing={l} />)}
          </div>
        </div>
      )}
    </div>
  )
}
