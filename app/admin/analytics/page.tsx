'use client'

import dynamic from 'next/dynamic'
import { Download, FileText } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'

const LineChart = dynamic(() => import('recharts').then((m) => m.LineChart), { ssr: false })
const BarChart = dynamic(() => import('recharts').then((m) => m.BarChart), { ssr: false })
const PieChart = dynamic(() => import('recharts').then((m) => m.PieChart), { ssr: false })
const Line = dynamic(() => import('recharts').then((m) => m.Line), { ssr: false })
const Bar = dynamic(() => import('recharts').then((m) => m.Bar), { ssr: false })
const Pie = dynamic(() => import('recharts').then((m) => m.Pie), { ssr: false })
const XAxis = dynamic(() => import('recharts').then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then((m) => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then((m) => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false })
const Legend = dynamic(() => import('recharts').then((m) => m.Legend), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false })

const activeUsersData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2026, 0, 22 + i)
  const dauBase = 800 + i * 12
  const dauNoise = Math.sin(i * 1.5) * 100 + Math.cos(i * 0.8) * 50
  const dau = Math.round(dauBase + dauNoise)
  const wau = Math.round(2000 + i * 30 + Math.sin(i * 0.6) * 200)
  const mau = Math.round(2847 + i * 2 + Math.sin(i * 0.3) * 30)
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    DAU: dau,
    WAU: wau,
    MAU: mau,
  }
})

const featureUsageData = [
  { name: 'Market Prices', value: 35, fill: '#2E7D32' },
  { name: 'Weather', value: 25, fill: '#1565C0' },
  { name: 'Tips', value: 20, fill: '#F9A825' },
  { name: 'Farm Profile', value: 12, fill: '#43A047' },
  { name: 'Alerts', value: 8, fill: '#FB8C00' },
]

const sessionDurationData = [
  { range: '<1 min', pct: 15 },
  { range: '1-5 min', pct: 35 },
  { range: '5-15 min', pct: 30 },
  { range: '15-30 min', pct: 15 },
  { range: '>30 min', pct: 5 },
]

const countyAdoptionData = [
  { county: 'Montserrado', totalUsers: 612, activeRate: 68.2, avgSessions: 3.4, topFeature: 'Market Prices' },
  { county: 'Nimba', totalUsers: 387, activeRate: 61.5, avgSessions: 2.8, topFeature: 'Weather' },
  { county: 'Bong', totalUsers: 312, activeRate: 58.3, avgSessions: 2.5, topFeature: 'Tips' },
  { county: 'Lofa', totalUsers: 278, activeRate: 54.7, avgSessions: 2.2, topFeature: 'Market Prices' },
  { county: 'Margibi', totalUsers: 245, activeRate: 52.1, avgSessions: 2.4, topFeature: 'Weather' },
  { county: 'Grand Bassa', totalUsers: 198, activeRate: 49.8, avgSessions: 2, topFeature: 'Tips' },
  { county: 'Grand Cape Mount', totalUsers: 167, activeRate: 47.3, avgSessions: 1.9, topFeature: 'Market Prices' },
  { county: 'Grand Gedeh', totalUsers: 142, activeRate: 45.1, avgSessions: 1.8, topFeature: 'Farm Profile' },
  { county: 'Sinoe', totalUsers: 118, activeRate: 42.6, avgSessions: 1.7, topFeature: 'Weather' },
  { county: 'Maryland', totalUsers: 105, activeRate: 40.2, avgSessions: 1.6, topFeature: 'Market Prices' },
  { county: 'Bomi', totalUsers: 89, activeRate: 38.5, avgSessions: 1.5, topFeature: 'Tips' },
  { county: 'River Cess', totalUsers: 72, activeRate: 35.8, avgSessions: 1.3, topFeature: 'Alerts' },
  { county: 'River Gee', totalUsers: 58, activeRate: 33.4, avgSessions: 1.2, topFeature: 'Market Prices' },
  { county: 'Gbarpolu', totalUsers: 52, activeRate: 30.1, avgSessions: 1.1, topFeature: 'Weather' },
  { county: 'Grand Kru', totalUsers: 50, activeRate: 28.7, avgSessions: 1, topFeature: 'Tips' },
]

const tooltipStyle = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '0.75rem',
  color: 'var(--foreground)',
}

function getActiveRateClass(rate: number): string {
  if (rate >= 50) return 'text-success'
  if (rate >= 35) return 'text-warning'
  return 'text-danger'
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Platform usage metrics and insights"
      />

      {/* Row 1: DAU / WAU / MAU Chart */}
      <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
        <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
          Active Users Trend (30 Days)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeUsersData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                interval={4}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="DAU" stroke="#2E7D32" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="WAU" stroke="#1565C0" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="MAU" stroke="#F9A825" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Feature Usage Pie + Session Duration Bar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
          <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
            Feature Usage
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }: { name?: string; value?: number }) => `${name ?? ''} ${value ?? 0}%`}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
          <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
            Session Duration Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionDurationData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="%" />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: unknown) => typeof value === 'number' || typeof value === 'string' ? `${value}%` : ''} />
                <Bar dataKey="pct" fill="#4CAF50" radius={[6, 6, 0, 0]} name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: County Adoption Table */}
      <div className="rounded-2xl border border-agri-border bg-white p-6 dark:border-border dark:bg-card">
        <h2 className="mb-4 text-lg font-bold text-agri-text dark:text-foreground">
          County Adoption
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-agri-border dark:border-border">
                <th className="py-3 pr-4 text-left font-semibold text-agri-muted dark:text-muted-foreground">
                  County
                </th>
                <th className="py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                  Total Users
                </th>
                <th className="py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground">
                  Active Rate
                </th>
                <th className="hidden py-3 pr-4 text-right font-semibold text-agri-muted dark:text-muted-foreground sm:table-cell">
                  Avg Sessions/Day
                </th>
                <th className="hidden py-3 text-left font-semibold text-agri-muted dark:text-muted-foreground md:table-cell">
                  Top Feature
                </th>
              </tr>
            </thead>
            <tbody>
              {countyAdoptionData.map((row) => (
                <tr
                  key={row.county}
                  className="border-b border-agri-border/50 transition-colors hover:bg-agri-hover dark:border-border/50 dark:hover:bg-muted"
                >
                  <td className="py-3 pr-4 font-medium text-agri-text dark:text-foreground">
                    {row.county}
                  </td>
                  <td className="py-3 pr-4 text-right text-agri-text dark:text-foreground">
                    {row.totalUsers.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <span
                      className={`font-medium ${getActiveRateClass(row.activeRate)}`}
                    >
                      {row.activeRate}%
                    </span>
                  </td>
                  <td className="hidden py-3 pr-4 text-right text-agri-muted dark:text-muted-foreground sm:table-cell">
                    {row.avgSessions}
                  </td>
                  <td className="hidden py-3 text-agri-muted dark:text-muted-foreground md:table-cell">
                    {row.topFeature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Export Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => alert('CSV export would be generated here')}
          className="flex items-center gap-2 rounded-xl border border-agri-border bg-white px-5 py-2.5 text-sm font-semibold text-agri-text transition-colors hover:bg-agri-hover dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          Download CSV
        </button>
        <button
          type="button"
          onClick={() => alert('PDF report would be generated here')}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          <FileText className="h-4 w-4" />
          Download PDF Report
        </button>
      </div>
    </div>
  )
}
