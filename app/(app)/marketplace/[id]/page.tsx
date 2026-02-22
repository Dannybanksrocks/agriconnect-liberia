'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Package, Phone, MessageCircle, CheckCircle, Share2, Heart, Clock } from 'lucide-react'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [inquiryMessage, setInquiryMessage] = useState('')
  
  const listing = marketplaceListings.find(l => l.id === params.id)
  
  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Listing not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">This listing may have been removed or is no longer available.</p>
        <Link href="/marketplace" className="text-green-600 hover:text-green-700 font-medium">
          ← Back to Marketplace
        </Link>
      </div>
    )
  }

  const whatsappUrl = `https://wa.me/${listing.farmerPhone.replace('+', '')}?text=Hi%20${encodeURIComponent(listing.farmerName)}%2C%20I'm%20interested%20in%20your%20${encodeURIComponent(listing.cropName)}%20listing%20on%20AgriHub.%20Is%20this%20still%20available%3F`

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${listing.cropName} - ${listing.farmerName}`,
        text: `Check out this ${listing.cropName} listing on AgriHub: ${listing.quantityKg} ${listing.unit} at L$${listing.pricePerUnitLRD}/${listing.unit}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleInquiry = () => {
    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message')
      return
    }
    
    // In a real app, this would submit to backend
    toast.success('Inquiry sent! The farmer will contact you soon.')
    setShowInquiryForm(false)
    setInquiryMessage('')
  }

  const daysUntilExpiry = Math.ceil((new Date(listing.availableUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {listing.photos[0] ? (
              <img
                src={listing.photos[0]}
                alt={listing.cropName}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-9xl">
                {listing.emoji}
              </div>
            )}
            {listing.qualityVerified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-2 shadow-lg">
                <CheckCircle className="w-4 h-4" />
                Quality Verified
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 rounded-full px-3 py-1.5 text-sm font-bold capitalize shadow-lg">
              {listing.quality} Quality
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Product Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={Package} label="Quantity" value={`${listing.quantityKg} ${listing.unit}`} />
              <DetailItem icon={Calendar} label="Harvest Date" value={new Date(listing.harvestDate).toLocaleDateString()} />
              <DetailItem icon={MapPin} label="Location" value={listing.location} />
              <DetailItem icon={Clock} label="Available Until" value={`${daysUntilExpiry} days`} />
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Info */}
        <div className="space-y-4">
          {/* Price Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {listing.emoji} {listing.cropName}
            </h1>
            
            <div className="mt-4 mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  L${listing.pricePerUnitLRD.toLocaleString()}
                </span>
                <span className="text-gray-500">per {listing.unit}</span>
              </div>
              <p className="text-sm text-gray-400">
                (${listing.pricePerUnitUSD.toFixed(2)} USD)
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    L${listing.totalPriceLRD.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400"></span>
                  <span className="text-gray-400">
                    (${listing.totalPriceUSD.toFixed(2)} USD)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg px-4 py-3 font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Contact via WhatsApp
              </button>
              
              <button
                onClick={() => window.open(`tel:${listing.farmerPhone}`, '_blank')}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-3 font-semibold transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call {listing.farmerPhone}
              </button>

              <button
                onClick={() => setShowInquiryForm(!showInquiryForm)}
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-400 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-lg px-4 py-3 font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Send Inquiry
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Heart className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>

            {/* Inquiry Form */}
            {showInquiryForm && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={4}
                  placeholder="Hi, I'm interested in this listing. Is it still available?"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleInquiry}
                  className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                >
                  Send Inquiry
                </button>
              </div>
            )}
          </div>

          {/* Seller Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Seller Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-600 text-white text-lg font-bold flex items-center justify-center">
                  {listing.farmerName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{listing.farmerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{listing.farmerCounty}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-1">📍 Based in {listing.county}</p>
                <p className="mb-1">📞 {listing.farmerPhone}</p>
                <p>👁️ {listing.views} views • 💬 {listing.inquiries} inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  )
}
