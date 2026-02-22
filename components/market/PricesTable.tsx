'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import DataTable from '@/components/shared/DataTable'
import CountySelector from '@/components/shared/CountySelector'
import CropBadge from '@/components/shared/CropBadge'
import { getMarketPrices } from '@/lib/api/market'
import { formatLRD, formatUSD, formatChange, formatRelativeTime } from '@/lib/utils/formatters'
import { useAppStore } from '@/lib/store/useAppStore'
import type { MarketPrice, CropCategory, ColumnDef } from '@/lib/types'

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All',       value: ''          },
  { label: 'Grain',     value: 'grain'     },
  { label: 'Vegetable', value: 'vegetable' },
  { label: 'Fruit',     value: 'fruit'     },
  { label: 'Legume',    value: 'legume'    },
  { label: 'Cash Crop', value: 'cash-crop' },
  { label: 'Root',      value: 'root'      },
]

function MiniSparkline({ data }: { data: number[] }) {
  const points = data.map((v, i) => ({ i, v }))
  const isUp = data[data.length - 1] >= data[0]
  return (
    <ResponsiveContainer width={72} height={28}>
      <LineChart data={points}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={isUp ? 'var(--color-success)' : 'var(--color-danger)'}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface PricesTableProps {
  onRowSelect?: (price: MarketPrice) => void
}

export default function PricesTable({ onRowSelect }: PricesTableProps) {
  const { selectedCounty, setSelectedCounty } = useAppStore()
  const [data, setData]       = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getMarketPrices({
        county: selectedCounty,
        category: category || undefined,
        search:   search    || undefined,
        limit: 100,
      })
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }, [selectedCounty, category, search])

  useEffect(() => { fetchData() }, [fetchData])

  const columns: ColumnDef<MarketPrice>[] = useMemo(() => [
    {
      key: 'cropName',
      header: 'Crop',
      render: (_val: unknown, row: MarketPrice) => (
        <div className="flex items-center gap-2">
          <span className="text-lg">{row.emoji}</span>
          <div>
            <span className="body-text-strong">{row.cropName}</span>
            <div className="mt-0.5">
              <CropBadge category={row.category as CropCategory} />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'market',
      header: 'Market Location',
      render: (_val: unknown, row: MarketPrice) => (
        <span className="body-text">{row.market}</span>
      ),
    },
    {
      key: 'priceLD',
      header: 'Price (LRD)',
      sortable: true,
      render: (_val: unknown, row: MarketPrice) => (
        <span className="body-text-strong">
          {formatLRD(row.priceLD)}
          <span className="ml-1 caption-text">/{row.unit}</span>
        </span>
      ),
    },
    {
      key: 'priceUSD',
      header: 'USD Equiv',
      render: (_val: unknown, row: MarketPrice) => (
        <span className="body-text">{formatUSD(row.priceUSD)}</span>
      ),
    },
    {
      key: 'change7d',
      header: '7d Change',
      sortable: true,
      render: (_val: unknown, row: MarketPrice) => (
        <span
          className={`body-text font-semibold ${
            row.change7d > 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : row.change7d < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-muted-foreground'
          }`}
        >
          {formatChange(row.change7d)}
        </span>
      ),
    },
    {
      key: 'trend',
      header: 'Trend',
      render: (_val: unknown, row: MarketPrice) => (
        <MiniSparkline data={row.trend} />
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (_val: unknown, row: MarketPrice) => (
        <span className="caption-text">{formatRelativeTime(row.updatedAt)}</span>
      ),
    },
  ], [])

  return (
    <div className="space-y-4">
      {/* Search + county */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops, markets…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <CountySelector value={selectedCounty} onChange={setSelectedCounty} size="md" />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              category === cat.value
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <DataTable<MarketPrice>
        columns={columns}
        data={data}
        getRowKey={(row) => row.id}
        loading={loading}
        paginated
        pageSize={20}
        exportable
        onRowClick={onRowSelect}
        emptyMessage="No market prices found"
      />
    </div>
  )
}
