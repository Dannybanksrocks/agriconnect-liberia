'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react'
import { formatLRD } from '@/lib/utils/formatters'

interface LiberiaCountyMapProps {
  prices: Record<string, number>
  selectedCrop: string
}

interface CountyPosition {
  id: string
  name: string
  abbr: string
  x: number
  y: number
  region: 'coastal' | 'interior' | 'southeast'
}

const COUNTY_POSITIONS: CountyPosition[] = [
  { id: 'grand-cape-mount', name: 'Grand Cape Mount', abbr: 'GCM', x: 8,  y: 22, region: 'coastal' },
  { id: 'bomi',             name: 'Bomi',             abbr: 'BO',  x: 22, y: 28, region: 'coastal' },
  { id: 'montserrado',      name: 'Montserrado',      abbr: 'MO',  x: 22, y: 42, region: 'coastal' },
  { id: 'gbarpolu',         name: 'Gbarpolu',         abbr: 'GB',  x: 28, y: 14, region: 'interior' },
  { id: 'lofa',             name: 'Lofa',             abbr: 'LO',  x: 42, y: 6,  region: 'interior' },
  { id: 'bong',             name: 'Bong',             abbr: 'BG',  x: 48, y: 28, region: 'interior' },
  { id: 'margibi',          name: 'Margibi',          abbr: 'MG',  x: 36, y: 46, region: 'coastal' },
  { id: 'grand-bassa',      name: 'Grand Bassa',      abbr: 'GB2', x: 48, y: 54, region: 'coastal' },
  { id: 'nimba',            name: 'Nimba',            abbr: 'NI',  x: 65, y: 16, region: 'interior' },
  { id: 'river-cess',       name: 'River Cess',       abbr: 'RC',  x: 56, y: 62, region: 'coastal' },
  { id: 'sinoe',            name: 'Sinoe',            abbr: 'SI',  x: 64, y: 72, region: 'southeast' },
  { id: 'grand-gedeh',      name: 'Grand Gedeh',      abbr: 'GG',  x: 76, y: 40, region: 'southeast' },
  { id: 'river-gee',        name: 'River Gee',        abbr: 'RG',  x: 78, y: 62, region: 'southeast' },
  { id: 'grand-kru',        name: 'Grand Kru',        abbr: 'GK',  x: 72, y: 80, region: 'southeast' },
  { id: 'maryland',         name: 'Maryland',         abbr: 'MD',  x: 86, y: 74, region: 'southeast' },
]

const CONNECTIONS = [
  ['grand-cape-mount', 'bomi'],
  ['bomi', 'montserrado'],
  ['bomi', 'gbarpolu'],
  ['gbarpolu', 'lofa'],
  ['gbarpolu', 'bong'],
  ['lofa', 'bong'],
  ['lofa', 'nimba'],
  ['bong', 'nimba'],
  ['bong', 'margibi'],
  ['bong', 'grand-bassa'],
  ['margibi', 'montserrado'],
  ['margibi', 'grand-bassa'],
  ['grand-bassa', 'river-cess'],
  ['nimba', 'grand-gedeh'],
  ['river-cess', 'sinoe'],
  ['sinoe', 'grand-kru'],
  ['sinoe', 'river-gee'],
  ['grand-gedeh', 'river-gee'],
  ['river-gee', 'maryland'],
  ['grand-kru', 'maryland'],
]

function getPriceRatio(price: number, min: number, max: number): number {
  if (max === min) return 0.5
  return (price - min) / (max - min)
}

function getPriceGradient(ratio: number): { color: string; glow: string; bg: string } {
  if (ratio < 0.25)  return { color: '#10b981', glow: 'rgba(16,185,129,0.6)',  bg: 'rgba(16,185,129,0.15)' }
  if (ratio < 0.5)   return { color: '#34d399', glow: 'rgba(52,211,153,0.5)',  bg: 'rgba(52,211,153,0.12)' }
  if (ratio < 0.75)  return { color: '#f59e0b', glow: 'rgba(245,158,11,0.6)',  bg: 'rgba(245,158,11,0.15)' }
  return               { color: '#ef4444', glow: 'rgba(239,68,68,0.65)',   bg: 'rgba(239,68,68,0.15)' }
}

function getNodeSize(ratio: number): number {
  return 32 + ratio * 20
}

export default function LiberiaCountyMap({ prices, selectedCrop }: LiberiaCountyMapProps) {
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)

  const priceValues = Object.values(prices).filter((v) => v > 0)
  const minPrice = priceValues.length ? Math.min(...priceValues) : 0
  const maxPrice = priceValues.length ? Math.max(...priceValues) : 0

  const ranked = useMemo(() => {
    return [...COUNTY_POSITIONS]
      .filter((c) => (prices[c.name] ?? 0) > 0)
      .sort((a, b) => (prices[b.name] ?? 0) - (prices[a.name] ?? 0))
      .slice(0, 5)
  }, [prices])

  const activeCounty = hoveredCounty ?? selectedCounty

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1526 50%, #0a1020 100%)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">
              Price Map — <span className="text-emerald-400">{selectedCrop || 'Select a crop'}</span>
            </h3>
          </div>
          <p className="text-xs text-white/40 mt-0.5 ml-6">
            County price comparison · All 15 counties
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/50">
          {[
            { color: '#10b981', label: 'Low' },
            { color: '#f59e0b', label: 'Mid' },
            { color: '#ef4444', label: 'High' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-0">
        {/* Map Area */}
        <div className="flex-1 relative px-3 pb-3">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative" style={{ aspectRatio: '4/3' }}>
            {/* SVG layer — connections + glow lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glow-line">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {CONNECTIONS.map(([aId, bId]) => {
                const a = COUNTY_POSITIONS.find((c) => c.id === aId)
                const b = COUNTY_POSITIONS.find((c) => c.id === bId)
                if (!a || !b) return null
                const aActive = activeCounty === aId
                const bActive = activeCounty === bId
                const isActive = aActive || bActive
                const aPrice = prices[a.name] ?? 0
                const bPrice = prices[b.name] ?? 0
                const avgRatio = aPrice && bPrice
                  ? getPriceRatio((aPrice + bPrice) / 2, minPrice, maxPrice)
                  : -1
                const lineColor = avgRatio >= 0
                  ? getPriceGradient(avgRatio).color
                  : '#ffffff'
                return (
                  <line
                    key={`${aId}-${bId}`}
                    x1={`${a.x}%`} y1={`${a.y}%`}
                    x2={`${b.x}%`} y2={`${b.y}%`}
                    stroke={isActive ? lineColor : 'rgba(255,255,255,0.08)'}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeDasharray={isActive ? 'none' : '3 4'}
                    filter={isActive ? 'url(#glow-line)' : undefined}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                )
              })}
            </svg>

            {/* County nodes */}
            {COUNTY_POSITIONS.map((county, i) => {
              const price = prices[county.name] ?? 0
              const ratio = price ? getPriceRatio(price, minPrice, maxPrice) : -1
              const { color, glow, bg } = ratio >= 0 ? getPriceGradient(ratio) : { color: '#4b5563', glow: 'rgba(75,85,99,0.3)', bg: 'rgba(75,85,99,0.1)' }
              const size = ratio >= 0 ? getNodeSize(ratio) : 32
              const isHovered = hoveredCounty === county.id
              const isSelected = selectedCounty === county.id
              const isActive = isHovered || isSelected

              return (
                <motion.div
                  key={county.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${county.x}%`,
                    top: `${county.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isActive ? 20 : 10,
                  }}
                  onMouseEnter={() => setHoveredCounty(county.id)}
                  onMouseLeave={() => setHoveredCounty(null)}
                  onClick={() => setSelectedCounty(isSelected ? null : county.id)}
                >
                  {/* Outer pulse ring — only for high price counties */}
                  {ratio > 0.65 && (
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                        width: size + 16,
                        height: size + 16,
                        top: -(8),
                        left: -(8),
                      }}
                    />
                  )}

                  {/* Active glow halo */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: size + 20,
                        height: size + 20,
                        top: -10,
                        left: -10,
                        background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <motion.div
                    animate={{ scale: isActive ? 1.25 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="relative flex items-center justify-center rounded-full font-bold text-white select-none"
                    style={{
                      width: size,
                      height: size,
                      fontSize: size > 44 ? 10 : 9,
                      background: isActive
                        ? `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88)`
                        : `radial-gradient(circle at 35% 35%, ${color}99, ${color}44)`,
                      border: `1.5px solid ${color}${isActive ? 'ff' : '66'}`,
                      boxShadow: isActive
                        ? `0 0 20px ${glow}, 0 0 40px ${bg}, inset 0 1px 0 rgba(255,255,255,0.2)`
                        : `0 0 8px ${bg}`,
                    }}
                  >
                    {county.abbr}
                  </motion.div>

                  {/* Price badge on selected */}
                  {isActive && price > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                    >
                      <div
                        className="rounded-lg px-2.5 py-1.5 text-center whitespace-nowrap shadow-2xl"
                        style={{
                          background: 'rgba(10,15,26,0.95)',
                          border: `1px solid ${color}66`,
                          boxShadow: `0 4px 24px rgba(0,0,0,0.6), 0 0 12px ${bg}`,
                        }}
                      >
                        <p className="text-[10px] font-semibold text-white">{county.name}</p>
                        <p className="text-[11px] font-bold mt-0.5" style={{ color }}>{formatLRD(price)}</p>
                        <p className="text-[9px] text-white/40 mt-0.5">
                          Rank #{ranked.findIndex((r) => r.id === county.id) + 1 || '—'} of {priceValues.length}
                        </p>
                      </div>
                      {/* Arrow */}
                      <div
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                        style={{ background: 'rgba(10,15,26,0.95)', borderRight: `1px solid ${color}44`, borderBottom: `1px solid ${color}44` }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right sidebar — Top 5 ranking */}
        <div className="w-[130px] shrink-0 pr-4 pt-1 pb-4 flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-1">Top Prices</p>
          <AnimatePresence mode="popLayout">
            {ranked.length === 0 ? (
              <p className="text-[10px] text-white/20 italic">Select a crop</p>
            ) : (
              ranked.map((county, i) => {
                const price = prices[county.name] ?? 0
                const ratio = getPriceRatio(price, minPrice, maxPrice)
                const { color } = getPriceGradient(ratio)
                const isTop = i === 0
                return (
                  <motion.div
                    key={county.id}
                    layout
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1.5 transition-colors"
                    style={{
                      background: isTop ? `${color}18` : 'rgba(255,255,255,0.03)',
                      border: isTop ? `1px solid ${color}33` : '1px solid transparent',
                    }}
                    onClick={() => setSelectedCounty(county.id === selectedCounty ? null : county.id)}
                  >
                    <span
                      className="text-[10px] font-black w-4 shrink-0"
                      style={{ color: isTop ? color : 'rgba(255,255,255,0.3)' }}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-white/80 truncate leading-tight">{county.name}</p>
                      <p className="text-[10px] font-bold leading-tight" style={{ color }}>{formatLRD(price)}</p>
                    </div>
                    {isTop ? (
                      <TrendingUp className="w-3 h-3 shrink-0" style={{ color }} />
                    ) : i === ranked.length - 1 ? (
                      <TrendingDown className="w-3 h-3 shrink-0 text-white/20" />
                    ) : (
                      <Minus className="w-3 h-3 shrink-0 text-white/20" />
                    )}
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>

          {/* Price spread stat */}
          {minPrice > 0 && maxPrice > 0 && (
            <div
              className="mt-2 rounded-lg px-2 py-2 text-[10px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-white/30 mb-1 uppercase tracking-widest text-[9px]">Spread</p>
              <div className="flex justify-between text-white/60">
                <span className="text-emerald-400 font-bold">{formatLRD(minPrice)}</span>
                <span className="text-white/20">→</span>
                <span className="text-red-400 font-bold">{formatLRD(maxPrice)}</span>
              </div>
              {/* Gradient bar */}
              <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)', width: '100%' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="px-5 py-2 border-t border-white/5 flex items-center justify-between">
        <p className="text-[10px] text-white/20">Hover or click a county to see details</p>
        <p className="text-[10px] text-white/20">
          {priceValues.length}/{COUNTY_POSITIONS.length} counties with data
        </p>
      </div>
    </motion.div>
  )
}
