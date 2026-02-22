'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Users, Activity, Phone, BookOpen, Search, Bell } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import StatCard from '@/components/shared/StatCard'

const LineChart = dynamic(
  () => import('recharts').then((m) => m.LineChart),
  { ssr: false }
)
const BarChart = dynamic(
  () => import('recharts').then((m) => m.BarChart),
  { ssr: false }
)
const Line = dynamic(
  () => import('recharts').then((m) => m.Line),
  { ssr: false }
)
const Bar = dynamic(
  () => import('recharts').then((m) => m.Bar),
  { ssr: false }
)
const XAxis = dynamic(
  () => import('recharts').then((m) => m.XAxis),
  { ssr: false }
)
const YAxis = dynamic(
  () => import('recharts').then((m) => m.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic(
  () => import('recharts').then((m) => m.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic(
  () => import('recharts').then((m) => m.Tooltip),
  { ssr: false }
)
const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer),
  { ssr: false }
)

const dauData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 0, 22 + i)
  const base = 700 + i * 15
  const noise = Math.sin(i * 1.7) * 80 + Math.cos(i * 0.9) * 40
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    users: Math.round(base + noise),
  }
})

const topCrops = [
  { rank: 1, emoji: '🌾', name: 'Rice', count: 4218 },
  { rank: 2, emoji: '🥔', name: 'Cassava', count: 3102 },
  { rank: 3, emoji: '🍫', name: 'Cocoa', count: 2547 },
  { rank: 4, emoji: '🌶️', name: 'Hot Pepper', count: 1893 },
  { rank: 5, emoji: '🌽', name: 'Corn', count: 1654 },
  { rank: 6, emoji: '🥜', name: 'Groundnut', count: 1421 },
  { rank: 7, emoji: '🍌', name: 'Plantain', count: 1287 },
  { rank: 8, emoji: '☕', name: 'Coffee', count: 1103 },
  { rank: 9, emoji: '🫒', name: 'Palm Oil', count: 982 },
  { rank: 10, emoji: '🍠', name: 'Sweet Potato', count: 841 },
]

const countyUsers = [
  { county: 'Montserrado', users: 612 },
  { county: 'Nimba', users: 387 },
  { county: 'Bong', users: 312 },
  { county: 'Lofa', users: 278 },
  { county: 'Margibi', users: 245 },
  { county: 'Grand Bassa', users: 198 },
  { county: 'Grand Cape Mount', users: 167 },
  { county: 'Grand Gedeh', users: 142 },
  { county: 'Sinoe', users: 118 },
  { county: 'Maryland', users: 105 },
  { county: 'Bomi', users: 89 },
  { county: 'River Cess', users: 72 },
  { county: 'River Gee', users: 58 },
  { county: 'Gbarpolu', users: 52 },
  { county: 'Grand Kru', users: 50 },
]

const recentActions = [
  { action: 'Updated rice prices for Montserrado', time: '2h ago' },
  { action: 'Published tip: Cocoa Fermentation', time: '5h ago' },
  { action: 'Suspended user: Test Account', time: 'Yesterday' },
  { action: 'Bulk imported weather data for all counties', time: 'Yesterday' },
  { action: 'Approved 3 new farmer registrations', time: '2 days ago' },
  { action: 'Updated cassava prices for Bong', time: '2 days ago' },
  { action: 'Published alert: Heavy rainfall warning', time: '3 days ago' },
  { action: 'Edited tip: Rice Planting Guide', time: '3 days ago' },
  { action: 'Added new market: Kakata Central', time: '4 days ago' },
  { action: 'Generated monthly analytics report', time: '5 days ago' },
]

export default function AdminDashboardPage() {
  const [mounted] = useState(true)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of AgriHub Liberia platform activity"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={Users}
          iconColor="text-primary"
          iconBg="bg-primary-50"
          label="Total Registered Farmers"
          value="2,847"
          trend={4.6}
          trendLabel="↑ 124 this week"
        />
        <StatCard
          icon={Activity}
          iconColor="text-accent"
          iconBg="bg-blue-50 dark:bg-blue-950"
          label="Active Today"
          value="892"
          subValue="31.4%"
        />
        <StatCard
          icon={Phone}
          iconColor="text-secondary-dark"
          iconBg="bg-secondary-50"
          label="USSD Sessions Today"
          value="1,247"
        />
        <StatCard
          icon={BookOpen}
          iconColor="text-success"
          iconBg="bg-green-50 dark:bg-green-950"
          label="Tips Read Today"
          value="456"
        />
        <StatCard
          icon={Search}
          iconColor="text-purple-600"
          iconBg="bg-purple-50 dark:bg-purple-950"
          label="Price Queries Today"
          value="2,103"
        />
        <StatCard
          icon={Bell}
          iconColor="text-warning"
          iconBg="bg-orange-50 dark:bg-orange-950"
          label="Alerts Sent This Week"
          value="1,872"
        />
      </div>

      {/* DAU Chart + Top Crops */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-foreground">
            Daily Active Users (30 Days)
          </h2>
          {mounted && (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dauData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.75rem',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#16A34A"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-foreground">
            Top 10 Crops Searched
          </h2>
          <ul className="space-y-3">
            {topCrops.map((crop) => (
              <li key={crop.rank} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-right text-xs font-medium text-gray-400 dark:text-muted-foreground">
                    {crop.rank}
                  </span>
                  <span>{crop.emoji}</span>
                  <span className="font-medium text-gray-900 dark:text-foreground">
                    {crop.name}
                  </span>
                </div>
                <span className="text-gray-500 dark:text-muted-foreground">
                  {crop.count.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* County Distribution + Recent Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-foreground">
            Users by County
          </h2>
          {mounted && (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countyUsers} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="county" type="category" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.75rem',
                      color: 'var(--foreground)',
                    }}
                  />
                  <Bar dataKey="users" fill="#16A34A" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-card">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-foreground">
            Recent Admin Actions
          </h2>
          <ul className="space-y-4">
            {recentActions.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {item.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-muted-foreground">
                    {item.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
