'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { marketplaceListings } from '@/lib/mock-data/marketplace'
import { countyNames } from '@/lib/mock-data/counties'
import ProductCard from '@/components/shop/ProductCard'

const CATEGORIES = ['All', 'Rice & Grains', 'Root Crops', 'Vegetables', 'Fruits', 'Cash Crops']
const CROP_CATEGORY_MAP: Record<string, string> = {
  Rice: 'Rice & Grains', Maize: 'Rice & Grains', Corn: 'Rice & Grains',
  Cassava: 'Root Crops', Yam: 'Root Crops', 'Sweet Potato': 'Root Crops', Cocoyam: 'Root Crops',
  Tomato: 'Vegetables', Okra: 'Vegetables', Cabbage: 'Vegetables', Eggplant: 'Vegetables', 'Hot Pepper': 'Vegetables', Pepper: 'Vegetables', Onion: 'Vegetables',
  Plantain: 'Fruits', Banana: 'Fruits', Watermelon: 'Fruits', Pineapple: 'Fruits',
  Rubber: 'Cash Crops', Cocoa: 'Cash Crops', Coffee: 'Cash Crops', 'Palm Oil': 'Cash Crops',
}
const SORT_OPTIONS = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Quantity']

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [county, setCounty] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const listings = useMemo(() => {
    let result = marketplaceListings.filter((l) => l.status === 'available')
    if (search) result = result.filter((l) => l.cropName.toLowerCase().includes(search.toLowerCase()) || l.farmerName.toLowerCase().includes(search.toLowerCase()))
    if (county) result = result.filter((l) => l.county === county)
    if (category !== 'All') result = result.filter((l) => CROP_CATEGORY_MAP[l.cropName] === category)
    if (minPrice) result = result.filter((l) => l.pricePerUnitLRD >= Number(minPrice))
    if (maxPrice) result = result.filter((l) => l.pricePerUnitLRD <= Number(maxPrice))
    if (sort === 'Price: Low to High') result = [...result].sort((a, b) => a.pricePerUnitLRD - b.pricePerUnitLRD)
    else if (sort === 'Price: High to Low') result = [...result].sort((a, b) => b.pricePerUnitLRD - a.pricePerUnitLRD)
    else if (sort === 'Quantity') result = [...result].sort((a, b) => b.quantityKg - a.quantityKg)
    return result
  }, [search, county, category, sort, minPrice, maxPrice])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 text-sm mt-1">{listings.length} listings from verified Liberian farmers</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${category === cat ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}
          >{cat}</button>
        ))}
      </div>

      {/* Search + filter row */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops or farmers..."
            className="w-full pl-9 pr-4 h-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-green-500 bg-white"
          />
        </div>
        <select value={county} onChange={(e) => setCounty(e.target.value)}
          className="h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:border-green-500 hidden sm:block"
        >
          <option value="">All Counties</option>
          {countyNames.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="h-11 px-3 rounded-xl border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:border-green-500"
        >
          {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowFilters(!showFilters)}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-green-300 transition flex items-center gap-2 text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">County</label>
            <select value={county} onChange={(e) => setCounty(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:border-green-500"
            >
              <option value="">All Counties</option>
              {countyNames.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Price (LRD)</label>
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-500"
              placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price (LRD)</label>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-500"
              placeholder="Any" />
          </div>
        </div>
      )}

      {/* Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl">🌾</span>
          <p className="mt-4 text-base font-medium">No listings match your filters</p>
          <button onClick={() => { setSearch(''); setCounty(''); setCategory('All') }} className="mt-4 text-sm text-green-600 hover:underline">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {listings.map((l) => <ProductCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  )
}
