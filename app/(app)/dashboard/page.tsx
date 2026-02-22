'use client'

import GreetingHeader from '@/components/dashboard/GreetingHeader'
import QuickStatsRow from '@/components/dashboard/QuickStatsRow'
import MarketWidget from '@/components/dashboard/MarketWidget'
import WeatherWidget from '@/components/dashboard/WeatherWidget'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import QuickAccessGrid from '@/components/dashboard/QuickAccessGrid'
import AIAdvisorWidget from '@/components/dashboard/AIAdvisorWidget'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <GreetingHeader />
      <QuickStatsRow />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MarketWidget />
          <WeatherWidget />
        </div>
        <div className="space-y-6">
          <AIAdvisorWidget />
          <ActivityFeed />
          <QuickAccessGrid />
        </div>
      </div>
    </div>
  )
}
