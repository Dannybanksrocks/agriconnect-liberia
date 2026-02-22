'use client'

import { motion } from 'framer-motion'
import type { TipCategory } from '@/lib/types'

const categories: Array<{ value: TipCategory; label: string; emoji: string }> = [
  { value: 'rice', label: 'Rice', emoji: '🌾' },
  { value: 'cassava', label: 'Cassava', emoji: '🌿' },
  { value: 'vegetables', label: 'Vegetables', emoji: '🥬' },
  { value: 'soil', label: 'Soil Health', emoji: '🪱' },
  { value: 'pest-control', label: 'Pest Control', emoji: '🐛' },
  { value: 'post-harvest', label: 'Post-Harvest', emoji: '📦' },
]

interface CategoryGridProps {
  activeCategory: TipCategory | null
  onSelect: (category: TipCategory | null) => void
}

export default function CategoryGrid({ activeCategory, onSelect }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.value

        return (
          <motion.button
            key={cat.value}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(isActive ? null : cat.value)}
            className={`flex flex-col items-center gap-1.5 rounded-xl p-4 border transition-colors cursor-pointer ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white border-agri-border hover:bg-agri-hover dark:bg-card dark:border-border dark:hover:bg-muted'
            }`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span
              className={`text-sm font-medium ${
                isActive
                  ? 'text-white'
                  : 'text-agri-text dark:text-foreground'
              }`}
            >
              {cat.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
