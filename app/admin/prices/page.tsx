'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Pencil, Trash2, DollarSign } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import { crops } from '@/lib/mock-data/crops'
import { counties } from '@/lib/mock-data/counties'
import { formatLRD } from '@/lib/utils/formatters'

interface PriceRow {
  id: string
  crop: string
  emoji: string
  county: string
  market: string
  priceLRD: number
  priceUSD: number
  updated: string
}

const samplePrices: PriceRow[] = [
  { id: 'p1', crop: 'Rice', emoji: '🌾', county: 'Montserrado', market: 'Monrovia Central', priceLRD: 380, priceUSD: 1.98, updated: '2026-02-21' },
  { id: 'p2', crop: 'Cassava', emoji: '🥔', county: 'Bong', market: 'Gbarnga Market', priceLRD: 65, priceUSD: 0.34, updated: '2026-02-21' },
  { id: 'p3', crop: 'Cocoa', emoji: '🍫', county: 'Nimba', market: 'Sanniquellie Market', priceLRD: 410, priceUSD: 2.14, updated: '2026-02-20' },
  { id: 'p4', crop: 'Hot Pepper', emoji: '🌶️', county: 'Margibi', market: 'Kakata Market', priceLRD: 195, priceUSD: 1.02, updated: '2026-02-20' },
  { id: 'p5', crop: 'Groundnut', emoji: '🥜', county: 'Lofa', market: 'Voinjama Market', priceLRD: 220, priceUSD: 1.15, updated: '2026-02-19' },
  { id: 'p6', crop: 'Palm Oil', emoji: '🫒', county: 'Grand Bassa', market: 'Buchanan Market', priceLRD: 240, priceUSD: 1.25, updated: '2026-02-19' },
  { id: 'p7', crop: 'Coffee', emoji: '☕', county: 'Grand Gedeh', market: 'Zwedru Market', priceLRD: 340, priceUSD: 1.77, updated: '2026-02-18' },
  { id: 'p8', crop: 'Corn', emoji: '🌽', county: 'Montserrado', market: 'Red Light Market', priceLRD: 165, priceUSD: 0.86, updated: '2026-02-18' },
  { id: 'p9', crop: 'Plantain', emoji: '🍌', county: 'Sinoe', market: 'Greenville Market', priceLRD: 48, priceUSD: 0.25, updated: '2026-02-17' },
  { id: 'p10', crop: 'Sweet Potato', emoji: '🍠', county: 'Maryland', market: 'Harper Market', priceLRD: 88, priceUSD: 0.46, updated: '2026-02-17' },
]

const LRD_RATE = 192

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<PriceRow[]>(samplePrices)
  const [searchQuery, setSearchQuery] = useState('')
  const [formCrop, setFormCrop] = useState('')
  const [formCounty, setFormCounty] = useState('')
  const [formMarket, setFormMarket] = useState('')
  const [formPriceLRD, setFormPriceLRD] = useState('')
  const [formPriceUSD, setFormPriceUSD] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formSource, setFormSource] = useState('')

  const filteredPrices = useMemo(() => {
    if (!searchQuery) return prices
    const q = searchQuery.toLowerCase()
    return prices.filter(
      (p) =>
        p.crop.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q) ||
        p.market.toLowerCase().includes(q)
    )
  }, [prices, searchQuery])

  const handleLRDChange = (val: string) => {
    setFormPriceLRD(val)
    const num = parseFloat(val)
    if (!isNaN(num)) {
      setFormPriceUSD((num / LRD_RATE).toFixed(2))
    } else {
      setFormPriceUSD('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCrop || !formCounty || !formMarket || !formPriceLRD) {
      alert('Please fill in all required fields')
      return
    }
    const selectedCrop = crops.find((c) => c.id === formCrop)
    const selectedCounty = counties.find((c) => c.id === formCounty)
    const lrd = parseFloat(formPriceLRD)

    const newPrice: PriceRow = {
      id: `p${Date.now()}`,
      crop: selectedCrop?.name ?? formCrop,
      emoji: selectedCrop?.emoji ?? '🌱',
      county: selectedCounty?.name ?? formCounty,
      market: formMarket,
      priceLRD: lrd,
      priceUSD: parseFloat((lrd / LRD_RATE).toFixed(2)),
      updated: formDate || new Date().toISOString().split('T')[0],
    }

    setPrices([newPrice, ...prices])
    setFormCrop('')
    setFormCounty('')
    setFormMarket('')
    setFormPriceLRD('')
    setFormPriceUSD('')
    setFormDate('')
    setFormSource('')
    alert('Price added successfully!')
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this price entry?')) {
      setPrices(prices.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Price Management"
        description="Manage market prices across all counties"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Add Price Form */}
        <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-agri-text dark:text-foreground">
            <Plus className="h-5 w-5 text-primary" />
            Add Price
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                Crop
              </label>
              <select
                value={formCrop}
                onChange={(e) => setFormCrop(e.target.value)}
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select crop...</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                County
              </label>
              <select
                value={formCounty}
                onChange={(e) => setFormCounty(e.target.value)}
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select county...</option>
                {counties.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                Market Name
              </label>
              <input
                type="text"
                value={formMarket}
                onChange={(e) => setFormMarket(e.target.value)}
                placeholder="e.g. Monrovia Central"
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Price (LRD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formPriceLRD}
                  onChange={(e) => handleLRDChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formPriceUSD}
                  readOnly
                  placeholder="Auto"
                  className="w-full rounded-xl border border-agri-border bg-agri-bg px-3 py-2 text-sm text-agri-muted dark:border-border dark:bg-muted dark:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                Effective Date
              </label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                Source
              </label>
              <input
                type="text"
                value={formSource}
                onChange={(e) => setFormSource(e.target.value)}
                placeholder="e.g. Field agent, MOA"
                className="w-full rounded-xl border border-agri-border bg-white px-3 py-2 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              <DollarSign className="h-4 w-4" />
              Add Price
            </button>
          </form>
        </div>

        {/* Prices Table */}
        <div className="lg:col-span-2 rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-agri-text dark:text-foreground">
              Current Prices
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-agri-muted dark:text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prices..."
                className="rounded-xl border border-agri-border bg-white py-2 pl-9 pr-3 text-sm text-agri-text dark:border-border dark:bg-card dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-agri-border dark:border-border">
                  <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                    Crop
                  </th>
                  <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                    County
                  </th>
                  <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground sm:table-cell">
                    Market
                  </th>
                  <th className="py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                    Price (LRD)
                  </th>
                  <th className="py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                    Price (USD)
                  </th>
                  <th className="hidden py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground md:table-cell">
                    Updated
                  </th>
                  <th className="py-3 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((price) => (
                  <tr
                    key={price.id}
                    className="border-b border-agri-border/50 transition-colors hover:bg-agri-hover dark:border-border/50 dark:hover:bg-muted"
                  >
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-2 font-medium text-agri-text dark:text-foreground">
                        <span>{price.emoji}</span>
                        {price.crop}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-agri-text dark:text-foreground">
                      {price.county}
                    </td>
                    <td className="hidden py-3 pr-4 text-agri-muted dark:text-muted-foreground sm:table-cell">
                      {price.market}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-agri-text dark:text-foreground">
                      {formatLRD(price.priceLRD)}
                    </td>
                    <td className="py-3 pr-4 text-right text-agri-muted dark:text-muted-foreground">
                      ${price.priceUSD.toFixed(2)}
                    </td>
                    <td className="hidden py-3 pr-4 text-agri-muted dark:text-muted-foreground md:table-cell">
                      {price.updated}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => alert(`Edit price for ${price.crop}`)}
                          className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-hover hover:text-primary dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(price.id)}
                          className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-red-50 hover:text-danger dark:text-muted-foreground dark:hover:bg-red-950 dark:hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPrices.length === 0 && (
              <p className="py-8 text-center text-sm text-agri-muted dark:text-muted-foreground">
                No prices found matching your search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
