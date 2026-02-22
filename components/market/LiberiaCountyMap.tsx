'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, MapPin, Info } from 'lucide-react'
import { formatLRD } from '@/lib/utils/formatters'

interface LiberiaCountyMapProps {
  prices: Record<string, number>
  selectedCrop: string
}

interface CountyShape {
  id: string
  name: string
  abbr: string
  d: string
  labelX: number
  labelY: number
}

const COUNTY_SHAPES: CountyShape[] = [
  {
    id: 'grand-cape-mount',
    name: 'Grand Cape Mount',
    abbr: 'GCM',
    d: 'M5,32 L82,8 L128,58 L112,168 L50,178 L5,138 Z',
    labelX: 58,
    labelY: 96,
  },
  {
    id: 'gbarpolu',
    name: 'Gbarpolu',
    abbr: 'GP',
    d: 'M82,8 L218,2 L238,98 L172,138 L128,58 Z',
    labelX: 162,
    labelY: 62,
  },
  {
    id: 'lofa',
    name: 'Lofa',
    abbr: 'LF',
    d: 'M218,2 L372,2 L388,82 L298,120 L238,98 Z',
    labelX: 296,
    labelY: 52,
  },
  {
    id: 'bomi',
    name: 'Bomi',
    abbr: 'BM',
    d: 'M5,138 L50,178 L112,168 L120,228 L60,245 L5,202 Z',
    labelX: 56,
    labelY: 190,
  },
  {
    id: 'montserrado',
    name: 'Montserrado',
    abbr: 'MO',
    d: 'M5,202 L60,245 L74,272 L44,292 L5,265 Z',
    labelX: 32,
    labelY: 248,
  },
  {
    id: 'bong',
    name: 'Bong',
    abbr: 'BG',
    d: 'M112,168 L128,58 L172,138 L238,98 L298,120 L312,208 L248,242 L175,255 L120,228 Z',
    labelX: 210,
    labelY: 168,
  },
  {
    id: 'margibi',
    name: 'Margibi',
    abbr: 'MG',
    d: 'M60,245 L120,228 L175,255 L165,308 L98,318 L70,288 Z',
    labelX: 112,
    labelY: 278,
  },
  {
    id: 'nimba',
    name: 'Nimba',
    abbr: 'NI',
    d: 'M298,120 L388,82 L462,82 L465,188 L398,232 L312,208 Z',
    labelX: 385,
    labelY: 155,
  },
  {
    id: 'grand-bassa',
    name: 'Grand Bassa',
    abbr: 'GB',
    d: 'M5,265 L44,292 L70,288 L98,318 L165,308 L202,348 L155,388 L80,372 L38,325 Z',
    labelX: 88,
    labelY: 332,
  },
  {
    id: 'river-cess',
    name: 'River Cess',
    abbr: 'RC',
    d: 'M165,308 L175,255 L248,242 L268,295 L255,365 L202,348 Z',
    labelX: 215,
    labelY: 308,
  },
  {
    id: 'grand-gedeh',
    name: 'Grand Gedeh',
    abbr: 'GG',
    d: 'M312,208 L398,232 L465,188 L485,295 L452,355 L362,355 L302,312 Z',
    labelX: 395,
    labelY: 278,
  },
  {
    id: 'sinoe',
    name: 'Sinoe',
    abbr: 'SI',
    d: 'M255,365 L268,295 L302,312 L362,355 L355,415 L290,452 L242,452 Z',
    labelX: 300,
    labelY: 392,
  },
  {
    id: 'river-gee',
    name: 'River Gee',
    abbr: 'RG',
    d: 'M362,355 L452,355 L472,415 L405,452 L355,415 Z',
    labelX: 412,
    labelY: 395,
  },
  {
    id: 'grand-kru',
    name: 'Grand Kru',
    abbr: 'GK',
    d: 'M202,348 L255,365 L242,452 L290,452 L285,480 L202,480 L160,458 L155,388 Z',
    labelX: 215,
    labelY: 428,
  },
  {
    id: 'maryland',
    name: 'Maryland',
    abbr: 'MD',
    d: 'M405,452 L472,415 L490,472 L450,480 L355,462 L355,415 Z',
    labelX: 418,
    labelY: 452,
  },
]

function getPriceRatio(price: number, min: number, max: number) {
  if (max === min) return 0.5
  return (price - min) / (max - min)
}

function getPriceStyle(ratio: number) {
  if (ratio < 0.25) return { fill: '#064e3b', stroke: '#10b981', glow: '#10b981' }
  if (ratio < 0.5)  return { fill: '#065f46', stroke: '#34d399', glow: '#34d399' }
  if (ratio < 0.75) return { fill: '#78350f', stroke: '#f59e0b', glow: '#f59e0b' }
  return               { fill: '#7f1d1d', stroke: '#ef4444', glow: '#ef4444' }
}

export default function LiberiaCountyMap({ prices, selectedCrop }: LiberiaCountyMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [pinnedId, setPinnedId]   = useState<string | null>(null)

  const priceValues = Object.values(prices).filter((v) => v > 0)
  const minPrice    = priceValues.length ? Math.min(...priceValues) : 0
  const maxPrice    = priceValues.length ? Math.max(...priceValues) : 0

  const ranked = useMemo(
    () =>
      [...COUNTY_SHAPES]
        .filter((c) => (prices[c.name] ?? 0) > 0)
        .sort((a, b) => (prices[b.name] ?? 0) - (prices[a.name] ?? 0))
        .slice(0, 5),
    [prices]
  )

  const activeId = hoveredId ?? pinnedId
  const activeCounty = COUNTY_SHAPES.find((c) => c.id === activeId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'linear-gradient(160deg,#060d1a 0%,#0a1628 60%,#060d1a 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              Liberia Price Map
            </h3>
            <p className="text-[10px] text-white/35 leading-tight">
              {selectedCrop ? `Showing: ${selectedCrop}` : 'Select a crop from the table'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-white/40">
          {[
            { color: '#10b981', label: 'Low' },
            { color: '#f59e0b', label: 'Mid' },
            { color: '#ef4444', label: 'High' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* SVG Map */}
        <div className="flex-1 p-3 relative">
          {/* Faint grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <svg
            viewBox="0 0 500 492"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))' }}
          >
            <defs>
              <filter id="county-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="county-glow-strong" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {COUNTY_SHAPES.map((county, i) => {
              const price = prices[county.name] ?? 0
              const ratio = price ? getPriceRatio(price, minPrice, maxPrice) : -1
              const style = ratio >= 0 ? getPriceStyle(ratio) : { fill: '#1e293b', stroke: '#334155', glow: '#334155' }
              const isActive = activeId === county.id
              const isPinned = pinnedId === county.id

              return (
                <g
                  key={county.id}
                  onMouseEnter={() => setHoveredId(county.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setPinnedId(isPinned ? null : county.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glow backdrop for active */}
                  {isActive && (
                    <path
                      d={county.d}
                      fill={style.glow}
                      opacity={0.3}
                      filter="url(#county-glow-strong)"
                    />
                  )}

                  <motion.path
                    d={county.d}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    fill={isActive ? `${style.fill}` : style.fill}
                    stroke={style.stroke}
                    strokeWidth={isActive ? 2 : 0.8}
                    opacity={isActive ? 1 : 0.82}
                    filter={isActive ? 'url(#county-glow)' : undefined}
                    style={{
                      transition: 'fill 0.2s, stroke-width 0.15s, opacity 0.15s',
                    }}
                  />

                  {/* Pinned badge ring */}
                  {isPinned && (
                    <path
                      d={county.d}
                      fill="none"
                      stroke={style.glow}
                      strokeWidth={3}
                      strokeDasharray="6 3"
                      opacity={0.9}
                    />
                  )}

                  {/* Abbreviation label */}
                  <text
                    x={county.labelX}
                    y={county.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.65)'}
                    fontSize={ratio >= 0 ? 9 : 8}
                    fontWeight={isActive ? 700 : 500}
                    fontFamily="system-ui, sans-serif"
                    style={{ pointerEvents: 'none', transition: 'fill 0.15s' }}
                  >
                    {county.abbr}
                  </text>

                  {/* Price label when active */}
                  {isActive && price > 0 && (
                    <text
                      x={county.labelX}
                      y={county.labelY + 11}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={style.glow}
                      fontSize={7.5}
                      fontWeight={700}
                      fontFamily="system-ui, sans-serif"
                      style={{ pointerEvents: 'none' }}
                    >
                      {formatLRD(price)}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Ocean coast tint */}
            <rect x="0" y="0" width="500" height="492" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1.5" rx="4" />
          </svg>

          {/* Floating tooltip for hovered county */}
          <AnimatePresence>
            {activeCounty && (
              <motion.div
                key={activeCounty.id}
                initial={{ opacity: 0, scale: 0.92, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-20"
              >
                {(() => {
                  const price = prices[activeCounty.name] ?? 0
                  const ratio = price ? getPriceRatio(price, minPrice, maxPrice) : -1
                  const style = ratio >= 0 ? getPriceStyle(ratio) : { fill: '#1e293b', stroke: '#334155', glow: '#334155' }
                  const rank = ranked.findIndex((r) => r.id === activeCounty.id) + 1
                  return (
                    <div
                      className="rounded-xl px-4 py-3 text-center shadow-2xl"
                      style={{
                        background: 'rgba(6,13,26,0.96)',
                        border: `1px solid ${style.glow}44`,
                        boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 20px ${style.glow}22`,
                        minWidth: 140,
                      }}
                    >
                      <p className="text-[11px] font-bold text-white">{activeCounty.name}</p>
                      {price > 0 ? (
                        <>
                          <p className="text-[15px] font-black mt-0.5" style={{ color: style.glow }}>
                            {formatLRD(price)}
                          </p>
                          {rank > 0 && (
                            <p className="text-[10px] text-white/30 mt-0.5">
                              Rank #{rank} of {priceValues.length}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-[10px] text-white/30 mt-1 flex items-center gap-1 justify-center">
                          <Info className="w-3 h-3" /> No price data
                        </p>
                      )}
                      {pinnedId === activeCounty.id && (
                        <p className="text-[9px] text-white/20 mt-1">Click to unpin</p>
                      )}
                    </div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar — rankings */}
        <div className="w-[128px] shrink-0 pr-3 py-3 flex flex-col gap-1.5">
          <p className="text-[9px] font-semibold text-white/25 uppercase tracking-widest mb-0.5">
            Top Prices
          </p>

          <AnimatePresence mode="popLayout">
            {ranked.length === 0 ? (
              <p className="text-[10px] text-white/20 italic leading-relaxed">
                Select a crop to see county rankings
              </p>
            ) : (
              ranked.map((county, i) => {
                const price = prices[county.name] ?? 0
                const ratio = getPriceRatio(price, minPrice, maxPrice)
                const { glow } = getPriceStyle(ratio)
                const isTop = i === 0
                return (
                  <motion.button
                    key={county.id}
                    layout
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setPinnedId(county.id === pinnedId ? null : county.id)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-left w-full transition-colors"
                    style={{
                      background: pinnedId === county.id
                        ? `${glow}22`
                        : isTop
                        ? `${glow}12`
                        : 'rgba(255,255,255,0.02)',
                      border: isTop ? `1px solid ${glow}28` : '1px solid transparent',
                    }}
                  >
                    <span
                      className="text-[10px] font-black w-4 shrink-0"
                      style={{ color: isTop ? glow : 'rgba(255,255,255,0.25)' }}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-semibold text-white/70 truncate leading-snug">
                        {county.name}
                      </p>
                      <p className="text-[10px] font-bold leading-snug" style={{ color: glow }}>
                        {formatLRD(price)}
                      </p>
                    </div>
                    {isTop ? (
                      <TrendingUp className="w-3 h-3 shrink-0" style={{ color: glow }} />
                    ) : i === ranked.length - 1 ? (
                      <TrendingDown className="w-3 h-3 shrink-0 text-white/15" />
                    ) : (
                      <Minus className="w-2.5 h-2.5 shrink-0 text-white/15" />
                    )}
                  </motion.button>
                )
              })
            )}
          </AnimatePresence>

          {/* Spread bar */}
          {minPrice > 0 && maxPrice > 0 && (
            <div
              className="mt-auto rounded-lg p-2 text-[9px]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-white/25 uppercase tracking-widest mb-1.5">Price Range</p>
              <div className="h-1.5 rounded-full mb-1.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#10b981,#f59e0b,#ef4444)' }} />
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400 font-bold">{formatLRD(minPrice)}</span>
                <span className="text-red-400 font-bold">{formatLRD(maxPrice)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-2 border-t border-white/5 flex justify-between text-[9px] text-white/20">
        <span>Hover or click a county · click again to unpin</span>
        <span>{priceValues.length} / 15 counties</span>
      </div>
    </motion.div>
  )
}
