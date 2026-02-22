'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Users, Activity, Phone, BookOpen, Search, Bell, ShoppingBag, PackageCheck, TrendingUp, DollarSign } from 'lucide-react'
import Link from 'next/link'
import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'

const LineChart = dynamic(() => import('recharts').then((m) => m.LineChart), { ssr: false })
const BarChart  = dynamic(() => import('recharts').then((m) => m.BarChart),  { ssr: false })
const Line      = dynamic(() => import('recharts').then((m) => m.Line),      { ssr: false })
const Bar       = dynamic(() => import('recharts').then((m) => m.Bar),       { ssr: false })
const XAxis     = dynamic(() => import('recharts').then((m) => m.XAxis),     { ssr: false })
const YAxis     = dynamic(() => import('recharts').then((m) => m.YAxis),     { ssr: false })
const CartesianGrid   = dynamic(() => import('recharts').then((m) => m.CartesianGrid),   { ssr: false })
const Tooltip         = dynamic(() => import('recharts').then((m) => m.Tooltip),         { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false })

const dauData = Array.from({ length: 30 }, (_, i) => {
  const date  = new Date(2026, 0, 22 + i)
  const base  = 700 + i * 15
  const noise = Math.sin(i * 1.7) * 80 + Math.cos(i * 0.9) * 40
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: Math.round(base + noise),
  }
})

const topCrops = [
  { rank: 1,  emoji: '🌾', name: 'Rice',         count: 4218 },
  { rank: 2,  emoji: '🥔', name: 'Cassava',       count: 3102 },
  { rank: 3,  emoji: '🍫', name: 'Cocoa',         count: 2547 },
  { rank: 4,  emoji: '🌶️', name: 'Hot Pepper',    count: 1893 },
  { rank: 5,  emoji: '🌽', name: 'Corn',           count: 1654 },
  { rank: 6,  emoji: '🥜', name: 'Groundnut',      count: 1421 },
  { rank: 7,  emoji: '🍌', name: 'Plantain',       count: 1287 },
  { rank: 8,  emoji: '☕', name: 'Coffee',         count: 1103 },
  { rank: 9,  emoji: '🫒', name: 'Palm Oil',       count:  982 },
  { rank: 10, emoji: '🍠', name: 'Sweet Potato',   count:  841 },
]

const countyUsers = [
  { county: 'Montserrado',     users: 612 },
  { county: 'Nimba',           users: 387 },
  { county: 'Bong',            users: 312 },
  { county: 'Lofa',            users: 278 },
  { county: 'Margibi',         users: 245 },
  { county: 'Grand Bassa',     users: 198 },
  { county: 'Grand Cape Mount',users: 167 },
  { county: 'Grand Gedeh',     users: 142 },
  { county: 'Sinoe',           users: 118 },
  { county: 'Maryland',        users: 105 },
  { county: 'Bomi',            users:  89 },
  { county: 'River Cess',      users:  72 },
  { county: 'River Gee',       users:  58 },
  { county: 'Gbarpolu',        users:  52 },
  { county: 'Grand Kru',       users:  50 },
]

const recentActions = [
  { action: 'Updated rice prices for Montserrado',         time: '2h ago'      },
  { action: 'Published tip: Cocoa Fermentation',           time: '5h ago'      },
  { action: 'Suspended user: Test Account',                time: 'Yesterday'   },
  { action: 'Bulk imported weather data for all counties', time: 'Yesterday'   },
  { action: 'Approved 3 new farmer registrations',         time: '2 days ago'  },
  { action: 'Updated cassava prices for Bong',             time: '2 days ago'  },
  { action: 'Published alert: Heavy rainfall warning',     time: '3 days ago'  },
  { action: 'Edited tip: Rice Planting Guide',             time: '3 days ago'  },
  { action: 'Added new market: Kakata Central',            time: '4 days ago'  },
  { action: 'Generated monthly analytics report',          time: '5 days ago'  },
]

const shopOrders = [
  { id: 'ORD-8821', buyer: 'Mary Kollie',   farmer: 'Fatu Kamara',  crop: '🌾 Rice',    qty: '50 kg',  totalLRD: 16000, status: 'pending',   time: '2h ago'     },
  { id: 'ORD-8817', buyer: 'John Dolo',     farmer: 'Moses Kollie', crop: '🥔 Cassava',  qty: '80 kg',  totalLRD: 9600,  status: 'confirmed', time: '5h ago'     },
  { id: 'ORD-8809', buyer: 'Sia Kamara',    farmer: 'Fatu Kamara',  crop: '🌶️ Pepper',  qty: '20 kg',  totalLRD: 7000,  status: 'shipped',   time: 'Yesterday'  },
  { id: 'ORD-8800', buyer: 'George Wolo',   farmer: 'James Boakai', crop: '🍌 Plantain', qty: '100 kg', totalLRD: 18000, status: 'delivered', time: '2 days ago' },
  { id: 'ORD-8795', buyer: 'Fatu Barclay',  farmer: 'Moses Kollie', crop: '🌾 Rice',    qty: '30 kg',  totalLRD: 9600,  status: 'delivered', time: '3 days ago' },
]

const ORDER_STATUS_CFG: Record<string, { cls: string }> = {
  pending:   { cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped:   { cls: 'bg-[#D8F3DC] text-[#2D6A4F] border-[#52B788]/40' },
  delivered: { cls: 'bg-[#D8F3DC] text-[#1B4332] border-[#52B788]/50' },
  cancelled: { cls: 'bg-red-50 text-red-600 border-red-200' },
}

const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '0.75rem',
  fontSize: '0.75rem',
  color: 'var(--foreground)',
}

export default function AdminDashboardPage() {
  const [mounted] = useState(true)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of AgriConnect Liberia platform activity"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Users}    iconColor="text-primary"       iconBg="bg-primary/10"       label="Total Registered Farmers" value="2,847"  trend={4.6} trendLabel="↑ 124 this week" />
        <StatCard icon={Activity} iconColor="text-accent"        iconBg="bg-accent/10"        label="Active Today"             value="892"    subValue="31.4%" />
        <StatCard icon={Phone}    iconColor="text-secondary-dark" iconBg="bg-secondary/10"    label="USSD Sessions Today"      value="1,247"  />
        <StatCard icon={BookOpen} iconColor="text-success"       iconBg="bg-success/10"       label="Tips Read Today"          value="456"    />
        <StatCard icon={Search}   iconColor="text-purple-600"    iconBg="bg-purple-500/10"    label="Price Queries Today"      value="2,103"  />
        <StatCard icon={Bell}     iconColor="text-warning"       iconBg="bg-warning/10"       label="Alerts Sent This Week"    value="1,872"  />
      </div>

      {/* E-Commerce Section */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D8F3DC] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#1B4332]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800">E-Commerce Dashboard</h2>
              <p className="text-xs text-stone-400">Consumer shop orders placed for farmer produce</p>
            </div>
          </div>
          <Link href="/admin/listings" className="text-sm text-[#1B4332] font-semibold hover:underline">Manage Listings →</Link>
        </div>

        {/* Shop KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: ShoppingBag,  label: 'Total Orders',      value: '248',       sub: 'All time',         bg: 'bg-amber-50',    color: 'text-amber-600'   },
            { icon: DollarSign,   label: 'Total Revenue',     value: 'L$3.2M',    sub: 'All time',         bg: 'bg-[#D8F3DC]',   color: 'text-[#1B4332]'  },
            { icon: TrendingUp,   label: 'Avg. Order Value',  value: 'L$12,900',  sub: 'Per order',        bg: 'bg-[#D8F3DC]',   color: 'text-[#2D6A4F]'  },
            { icon: PackageCheck, label: 'Delivered',         value: '187',       sub: '75% of all orders',bg: 'bg-blue-50',     color: 'text-blue-600'    },
          ].map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <p className="text-xl font-extrabold text-stone-800">{kpi.value}</p>
                <p className="text-xs font-semibold text-stone-600 mt-0.5">{kpi.label}</p>
                <p className="text-xs text-stone-400">{kpi.sub}</p>
              </div>
            )
          })}
        </div>

        {/* Recent shop orders table */}
        <div>
          <h3 className="text-sm font-semibold text-stone-600 mb-3">Recent Orders</h3>
          <div className="rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 hidden sm:table-cell">Buyer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 hidden md:table-cell">Farmer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500">Crop</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {shopOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition">
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold text-stone-700">{order.id}</p>
                      <p className="text-xs text-stone-400">{order.time}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-600 hidden sm:table-cell">{order.buyer}</td>
                    <td className="px-4 py-3 text-xs text-stone-600 hidden md:table-cell">{order.farmer}</td>
                    <td className="px-4 py-3 text-xs text-stone-700">{order.crop} · {order.qty}</td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-[#1B4332]">L${order.totalLRD.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-medium capitalize ${ORDER_STATUS_CFG[order.status]?.cls}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DAU Chart + Top Crops */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="card-heading mb-4">Daily Active Users (30 Days)</h2>
          {mounted && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dauData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="users" stroke="var(--color-primary)" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="card-heading mb-4">Top 10 Crops Searched</h2>
          <ul className="space-y-3">
            {topCrops.map((crop) => (
              <li key={crop.rank} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right caption-text font-medium">{crop.rank}</span>
                  <span>{crop.emoji}</span>
                  <span className="body-text-strong">{crop.name}</span>
                </div>
                <span className="caption-text">{crop.count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* County Distribution + Recent Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="card-heading mb-4">Users by County</h2>
          {mounted && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countyUsers} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="county" type="category" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="users" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="card-heading mb-4">Recent Admin Actions</h2>
          <ul className="space-y-4">
            {recentActions.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="body-text-strong">{item.action}</p>
                  <p className="caption-text mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
