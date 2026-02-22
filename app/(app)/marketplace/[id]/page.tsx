'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin, Calendar, Package, Phone, MessageCircle,
  Flag, ChevronLeft, CheckCircle, Star, ExternalLink,
  Eye, Users, CreditCard, Smartphone, Copy, Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { marketPrices } from '@/lib/mock-data/crops'
import type { MarketplaceListing } from '@/lib/types'

function getMobileNetwork(phone: string): string {
  const n = phone.replace(/\D/g, '').slice(-9)
  if (n.startsWith('77') || n.startsWith('88')) return 'MTN (Lonestar)'
  if (n.startsWith('55') || n.startsWith('44')) return 'Orange'
  return 'MTN / Orange'
}

function getCountyAvgPrice(cropName: string, county: string): number | null {
  const matches = marketPrices.filter(
    (p) =>
      p.cropName.toLowerCase().includes(cropName.toLowerCase()) &&
      p.county.toLowerCase() === county.toLowerCase()
  )
  if (!matches.length) return null
  return Math.round(matches.reduce((s, p) => s + p.priceLD, 0) / matches.length)
}

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [listing, setListing] = useState<MarketplaceListing | null>(null)
  const [showPhone, setShowPhone] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)
  const [related, setRelated] = useState<MarketplaceListing[]>([])

  useEffect(() => {
    const found = marketplaceListings.find((l) => l.id === id)
    if (!found) {
      router.push('/marketplace')
      return
    }
    setListing(found)
    setRelated(
      marketplaceListings
        .filter((l) => l.id !== id && l.cropName === found.cropName && l.status === 'available')
        .slice(0, 3)
    )
  }, [id, router])

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const parts = listing.farmerName.split(' ')
  const displayName = `${parts[0]} ${parts[1]?.[0] ?? ''}.`
  const initials = parts.map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  const network = getMobileNetwork(listing.farmerPhone)
  const countyAvg = getCountyAvgPrice(listing.cropName, listing.county)
  const priceDiff = countyAvg !== null ? listing.pricePerUnitLRD - countyAvg : null
  const listingCode = listing.id.replace('listing-', '')

  const whatsappMsg = encodeURIComponent(
    `Hi ${parts[0]}, I found your ${listing.cropName} listing on AgriHub Liberia. I'm interested in buying ${listing.quantityKg} ${listing.unit} at L$${listing.pricePerUnitLRD}/${listing.unit}. Are you available?`
  )
  const whatsappUrl = `https://wa.me/${listing.farmerPhone.replace(/\D/g, '')}?text=${whatsappMsg}`

  const handleSendInquiry = () => {
    const stored = JSON.parse(localStorage.getItem('agrihub_inquiries') || '[]')
    stored.push({ id: `inq-${Date.now()}`, listingId: listing.id, sentAt: new Date().toISOString() })
    localStorage.setItem('agrihub_inquiries', JSON.stringify(stored))
    setInquirySent(true)
    toast.success('Your inquiry has been sent. The farmer will contact you on WhatsApp within 24 hours.')
  }

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(listing.farmerPhone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const qualityBadge =
    listing.quality === 'premium'
      ? 'bg-yellow-100 text-yellow-800'
      : listing.quality === 'standard'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-gray-100 text-gray-700'

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-green-700 to-green-900 px-6 py-8 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-5xl">{listing.emoji}</span>
                  <h1 className="text-2xl font-bold mt-3">{listing.cropName}</h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${qualityBadge}`}>
                      {listing.quality}
                    </span>
                    {listing.qualityVerified && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/30 text-green-100 text-xs font-semibold">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold">L${listing.pricePerUnitLRD.toLocaleString()}</p>
                  <p className="text-green-200 text-sm">per {listing.unit}</p>
                  <p className="text-green-300 text-xs mt-0.5">${listing.pricePerUnitUSD} USD</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5 text-green-100 text-sm">
                  <Package className="w-4 h-4" />
                  <span>{listing.quantityKg} {listing.unit} available</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-100 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-green-100 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Harvested{' '}
                    {new Date(listing.harvestDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">About this listing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{listing.description}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {listing.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {listing.inquiries} inquiries
                </span>
                <span>
                  Available until{' '}
                  {new Date(listing.availableUntil).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Price comparison */}
          {countyAvg !== null && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Price Comparison</h3>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">This listing</p>
                  <p className="text-xl font-bold text-gray-900">
                    L${listing.pricePerUnitLRD}/{listing.unit}
                  </p>
                </div>
                {priceDiff !== null && (
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      priceDiff <= 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {priceDiff <= 0
                      ? `L$${Math.abs(priceDiff)} below avg`
                      : `L$${priceDiff} above avg`}
                  </span>
                )}
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Market avg · {listing.county}</p>
                  <p className="text-xl font-bold text-gray-400">L${countyAvg}/{listing.unit}</p>
                </div>
              </div>
            </div>
          )}

          {/* USSD offline tip */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200">
            <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              {"Can't use WhatsApp? Dial "}
              <span className="font-bold">*347*{listingCode}#</span>
              {" to get this farmer's number via SMS on any Liberian phone."}
            </p>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                More {listing.cropName} Listings
              </h3>
              <div className="space-y-3">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/marketplace/${rel.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50 transition"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {rel.farmerName.split(' ')[0]} {rel.farmerName.split(' ')[1]?.[0]}. —{' '}
                        {rel.county}
                      </p>
                      <p className="text-xs text-gray-500">{rel.quantityKg} kg available</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-700">
                        L${rel.pricePerUnitLRD}/{rel.unit}
                      </p>
                      <p className="text-xs text-gray-400">${rel.pricePerUnitUSD} USD</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Farmer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
              Farmer Profile
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{displayName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Verified Farmer</span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{listing.county} County</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Member since {new Date(listing.createdAt).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>
                  {marketplaceListings.filter((l) => l.farmerId === listing.farmerId).length}{' '}
                  listing(s)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs">{network}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Contact Farmer
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-sm transition"
            >
              <MessageCircle className="w-5 h-5" />
              Contact on WhatsApp
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            {showPhone ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-mono text-gray-800 flex-1">{listing.farmerPhone}</span>
                <button
                  onClick={handleCopyPhone}
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowPhone(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition"
              >
                <Phone className="w-4 h-4" /> Call via {network}
              </button>
            )}

            <button
              onClick={handleSendInquiry}
              disabled={inquirySent}
              className={`w-full py-2.5 rounded-xl border text-sm font-medium transition ${
                inquirySent
                  ? 'border-green-300 bg-green-50 text-green-600 cursor-default'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {inquirySent ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Inquiry Sent
                </span>
              ) : (
                'Send Platform Inquiry'
              )}
            </button>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Payment
            </p>
            <div className="flex items-start gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                Accepts{' '}
                <span className="font-medium text-gray-800">MTN MoMo (Lonestar)</span> and{' '}
                <span className="font-medium text-gray-800">Orange Money</span>
              </p>
            </div>
            {[
              'Buyers pay via mobile money before or on delivery',
              'AgriHub does NOT hold funds — payments go directly to farmer',
              'Confirmation sent via SMS to registered number',
            ].map((item) => (
              <div key={item} className="flex items-start gap-1.5 mb-1.5">
                <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">{item}</p>
              </div>
            ))}
          </div>

          {/* Report */}
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm transition">
            <Flag className="w-4 h-4" /> Report this listing
          </button>
        </div>
      </div>
    </div>
  )
}
