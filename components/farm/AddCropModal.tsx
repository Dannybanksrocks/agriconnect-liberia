'use client'

import { useState, useMemo } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { crops } from '@/lib/mock-data/crops'
import { useAppStore } from '@/lib/store/useAppStore'

const schema = z.object({
  cropId: z.string().min(1, 'Please select a crop'),
  areaAcres: z.number().min(0.1, 'Minimum 0.1 acres').max(500, 'Maximum 500 acres'),
  plantedDate: z.string().min(1, 'Planted date is required'),
  expectedHarvestDate: z.string().min(1, 'Harvest date is required'),
  status: z.enum(['growing', 'ready-soon', 'harvested', 'failed']),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface AddCropModalProps {
  open: boolean
  onClose: () => void
}

export default function AddCropModal({ open, onClose }: AddCropModalProps) {
  const addFarmCrop = useAppStore((s) => s.addFarmCrop)
  const [cropSearch, setCropSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      cropId: '',
      areaAcres: 1,
      plantedDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: new Date(Date.now() + 120 * 86_400_000)
        .toISOString()
        .split('T')[0],
      status: 'growing',
      notes: '',
    },
  })

  const selectedCropId = watch('cropId')
  const selectedCrop = crops.find((c) => c.id === selectedCropId)

  const filteredCrops = useMemo(() => {
    if (!cropSearch) return crops
    const q = cropSearch.toLowerCase()
    return crops.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }, [cropSearch])

  function handlePlantedChange(dateStr: string) {
    setValue('plantedDate', dateStr)
    if (dateStr) {
      const harvest = new Date(
        new Date(dateStr).getTime() + 120 * 86_400_000
      )
        .toISOString()
        .split('T')[0]
      setValue('expectedHarvestDate', harvest)
    }
  }

  function onSubmit(data: FormValues) {
    const crop = crops.find((c) => c.id === data.cropId)
    if (!crop) return

    addFarmCrop({
      id: `fc-${Date.now()}`,
      cropId: crop.id,
      cropName: crop.name,
      emoji: crop.emoji,
      areaAcres: data.areaAcres,
      plantedDate: data.plantedDate,
      expectedHarvestDate: data.expectedHarvestDate,
      status: data.status,
      notes: data.notes ?? '',
      currentPriceLD: Math.round(
        (crop.priceRange.min + crop.priceRange.max) / 2
      ),
    })
    reset()
    setCropSearch('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl border border-agri-border bg-white p-6 shadow-xl dark:border-border dark:bg-card"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-agri-text dark:text-foreground">
                Add Crop
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-agri-muted transition-colors hover:bg-agri-bg dark:text-muted-foreground dark:hover:bg-muted"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Crop Select */}
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Crop
                </label>
                <Controller
                  control={control}
                  name="cropId"
                  render={({ field }) => (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex w-full items-center justify-between rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text transition-colors hover:border-primary dark:border-border dark:bg-card dark:text-foreground"
                      >
                        <span>
                          {selectedCrop
                            ? `${selectedCrop.emoji} ${selectedCrop.name}`
                            : 'Select a crop...'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-agri-muted" />
                      </button>

                      {dropdownOpen && (
                        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-hidden rounded-xl border border-agri-border bg-white shadow-lg dark:border-border dark:bg-card">
                          <div className="border-b border-agri-border p-2 dark:border-border">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-agri-muted" />
                              <input
                                type="text"
                                placeholder="Search crops..."
                                value={cropSearch}
                                onChange={(e) => setCropSearch(e.target.value)}
                                className="w-full rounded-lg border border-agri-border bg-agri-bg py-2 pl-8 pr-3 text-sm text-agri-text outline-none focus:border-primary dark:border-border dark:bg-muted dark:text-foreground"
                              />
                            </div>
                          </div>
                          <div className="max-h-44 overflow-y-auto">
                            {filteredCrops.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  field.onChange(c.id)
                                  setDropdownOpen(false)
                                  setCropSearch('')
                                }}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-agri-bg dark:hover:bg-muted ${
                                  field.value === c.id
                                    ? 'bg-primary/10 font-medium text-primary'
                                    : 'text-agri-text dark:text-foreground'
                                }`}
                              >
                                <span>{c.emoji}</span>
                                <span>{c.name}</span>
                                <span className="ml-auto text-xs text-agri-muted dark:text-muted-foreground">
                                  {c.category}
                                </span>
                              </button>
                            ))}
                            {filteredCrops.length === 0 && (
                              <p className="px-3 py-4 text-center text-sm text-agri-muted dark:text-muted-foreground">
                                No crops found
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.cropId && (
                  <p className="mt-1 text-xs text-red-600">{errors.cropId.message}</p>
                )}
              </div>

              {/* Area */}
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Area (acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('areaAcres', { valueAsNumber: true })}
                  className="w-full rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
                />
                {errors.areaAcres && (
                  <p className="mt-1 text-xs text-red-600">{errors.areaAcres.message}</p>
                )}
              </div>

              {/* Dates row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                    Planted Date
                  </label>
                  <input
                    type="date"
                    {...register('plantedDate', {
                      onChange: (e) => handlePlantedChange(e.target.value),
                    })}
                    className="w-full rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
                  />
                  {errors.plantedDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.plantedDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                    Expected Harvest
                  </label>
                  <input
                    type="date"
                    {...register('expectedHarvestDate')}
                    className="w-full rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
                  />
                  {errors.expectedHarvestDate && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.expectedHarvestDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full appearance-none rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
                >
                  <option value="growing">Growing</option>
                  <option value="ready-soon">Ready Soon</option>
                  <option value="harvested">Harvested</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1 block text-sm font-medium text-agri-text dark:text-foreground">
                  Notes (optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="e.g. NERICA variety, intercropped with groundnuts..."
                  className="w-full resize-none rounded-xl border border-agri-border bg-white px-3 py-2.5 text-sm text-agri-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-agri-muted transition-colors hover:bg-agri-bg dark:text-muted-foreground dark:hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Add Crop
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
