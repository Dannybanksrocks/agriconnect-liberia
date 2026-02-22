'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, MessageCircle, Eye, Users, Clock, BadgeCheck, Zap, Star } from 'lucide-react'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { formatLRD } from '@/lib/utils/formatters'

function getDaysUntilExpiry(availableUntil: string): number {
  const now = new Date('2024-10-22')
  const end = new Date(availableUntil)
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function getDaysSinceHarvest(harvestDate: string): number {
  const now = new Date('2024-10-22')
  const harvest = new Date(harvestDate)
  return Math.floor((now.getTime() - harvest.getTime()) / (1000 * 60 * 60 * 24))
}

function getHotScore(listing: (typeof marketplaceListings)[0]): number {
  const inquiryScore = listing.inquiries * 4
  const viewScore = listing.views * 0.1
  const expiryUrgency = Math.max(0, 10 - getDaysUntilExpiry(listing.availableUntil)) * 3
  const premiumBonus = listing.quality === 'premium' ? 8 : 0
  const verifiedBonus = listing.qualityVerified ? 5 : 0
  return inquiryScore + viewScore + expiryUrgency + premiumBonus + verifiedBonus
}

export default function HotDeals() {
  const hotListings = useMemo(
    () =>
      [...marketplaceListings]
        .filter((l) => l.status === 'available')
        .sort((a, b) => getHotScore(b) - getHotScore(a))
        .slice(0, 5),
    []
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0a00 0%, #1a0f00 40%, #0d0a00 100%)',
        border: '1px solid rgba(251,146,60,0.2)',
        boxShadow: '0 0 40px rgba(251,146,60,0.08)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: 'linear-gradient(90deg, rgba(234,88,12,0.18) 0%, rgba(234,88,12,0.04) 100%)',
          borderBottom: '1px solid rgba(251,146,60,0.15)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626)', boxShadow: '0 0 16px rgba(234,88,12,0.5)' }}
          >
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight">Hot Deals</h3>
            <p className="text-[10px] text-orange-300/50">Trending listings right now</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: 'rgba(234,88,12,0.15)', border: '1px solid rgba(234,88,12,0.3)' }}>
          <Zap className="w-3 h-3 text-orange-400" />
          <span className="text-[10px] font-bold text-orange-400">{hotListings.length} active</span>
        </div>
      </div>

      {/* Scrollable Cards Row */}
      <div className="flex gap-3 overflow-x-auto px-4 py-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {hotListings.map((listing, i) => {
          const daysLeft      = getDaysUntilExpiry(listing.availableUntil)
          const daysSince     = getDaysSinceHarvest(listing.harvestDate)
          const isExpiringSoon = daysLeft <= 5 && daysLeft >= 0
          const isSellingFast  = listing.inquiries >= 15
          const isTopDeal      = i === 0

          return (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="shrink-0 flex flex-col rounded-2xl overflow-hidden cursor-pointer"
              style={{
                width: 188,
                background: isTopDeal
                  ? 'linear-gradient(160deg, #1c0a00 0%, #2a1000 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: isTopDeal
                  ? '1px solid rgba(251,146,60,0.4)'
                  : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isTopDeal ? '0 4px 24px rgba(234,88,12,0.2)' : 'none',
              }}
            >
              {/* Top badge row */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1 gap-1 flex-wrap">
                {isTopDeal && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black text-white"
                    style={{ background: 'linear-gradient(90deg,#ea580c,#dc2626)', boxShadow: '0 0 10px rgba(234,88,12,0.5)' }}
                  >
                    <Flame className="w-2.5 h-2.5" /> #1 HOT
                  </span>
                )}
                {isSellingFast && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                    style={{ background: 'rgba(234,88,12,0.3)', border: '1px solid rgba(234,88,12,0.5)' }}
                  >
                    <Zap className="w-2.5 h-2.5 text-orange-400" />
                    <span className="text-orange-300">SELLING FAST</span>
                  </span>
                )}
                {isExpiringSoon && (
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold"
                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5' }}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {daysLeft}d left
                  </span>
                )}
              </div>

              {/* Emoji + crop */}
              <div className="px-3 pt-1 pb-2 flex items-center gap-2.5">
                <span
                  className="text-3xl flex items-center justify-center rounded-xl h-12 w-12 shrink-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  {listing.emoji}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-bold text-white leading-tight truncate">{listing.cropName}</p>
                    {listing.qualityVerified && <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-white/40 leading-tight">{listing.county} County</p>
                  {listing.quality === 'premium' && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-400">
                      <Star className="w-2.5 h-2.5 fill-amber-400" /> Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="px-3 pb-2">
                <div
                  className="rounded-lg px-2.5 py-1.5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <p
                    className="text-[15px] font-black leading-tight"
                    style={{ color: isTopDeal ? '#fb923c' : '#fbbf24' }}
                  >
                    {formatLRD(listing.pricePerUnitLRD)}
                    <span className="text-[10px] font-medium text-white/35">/{listing.unit}</span>
                  </p>
                  <p className="text-[10px] text-white/30 leading-tight">
                    {listing.quantityKg.toLocaleString()} {listing.unit} · harvested {daysSince}d ago
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-2 px-3 pb-3 text-[9px] text-white/30">
                <span className="flex items-center gap-0.5">
                  <Eye className="w-3 h-3" />{listing.views}
                </span>
                <span className="flex items-center gap-0.5">
                  <Users className="w-3 h-3" />{listing.inquiries} inquiries
                </span>
              </div>

              {/* Farmer + WhatsApp */}
              <div
                className="mt-auto px-3 py-2.5 flex items-center justify-between gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-white/60 truncate">{listing.farmerName}</p>
                  <p className="text-[9px] text-white/25 truncate">{listing.location.split(',')[0]}</p>
                </div>
                <a
                  href={`https://wa.me/${listing.farmerPhone.replace('+', '')}?text=${encodeURIComponent(
                    `Hi ${listing.farmerName}, I found your ${listing.cropName} listing on AgriHub. I'm interested in buying. Is it still available?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-white transition-opacity hover:opacity-80"
                  style={{ background: '#25d366', boxShadow: '0 0 12px rgba(37,211,102,0.35)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="w-3 h-3" />
                  Chat
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-2.5 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="text-[10px] text-white/20">Ranked by inquiries · Payment via MTN MoMo / Orange Money</p>
        <a
          href="/marketplace"
          className="text-[10px] font-semibold text-orange-400/70 hover:text-orange-400 transition-colors"
        >
          View all listings →
        </a>
      </div>
    </motion.div>
  )
}
