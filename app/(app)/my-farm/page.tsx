'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import FarmProfileCard from '@/components/farm/FarmProfileCard'
import CropTrackerTable from '@/components/farm/CropTrackerTable'
import AddCropModal from '@/components/farm/AddCropModal'
import WeatherImpactPanel from '@/components/farm/WeatherImpactPanel'

export default function MyFarmPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Farm"
        description="Track your crops, monitor weather impact, and manage your farm."
      />

      <FarmProfileCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="section-heading">My Crops</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Plus className="h-4 w-4" />
              Add Crop
            </button>
          </div>

          <CropTrackerTable />
        </div>

        <div>
          <WeatherImpactPanel />
        </div>
      </div>

      <AddCropModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
