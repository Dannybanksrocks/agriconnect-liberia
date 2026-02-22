'use client'

import { MapPin } from 'lucide-react'
import { counties } from '@/lib/mock-data/counties'

interface CountySelectorProps {
  value: string
  onChange: (county: string) => void
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function CountySelector({
  value,
  onChange,
  className = '',
  showIcon = true,
  size = 'md',
}: CountySelectorProps) {
  const sizeClasses = {
    sm: 'h-8 text-sm px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {showIcon && (
        <MapPin className="pointer-events-none absolute left-3 h-4 w-4 text-agri-muted dark:text-muted-foreground" />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-xl border border-agri-border bg-white pr-8 font-medium text-agri-text transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-card dark:text-foreground ${
          sizeClasses[size]
        } ${showIcon ? 'pl-9' : ''}`}
        aria-label="Select county"
      >
        {counties.map((county) => (
          <option key={county.id} value={county.name}>
            {county.name}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 h-4 w-4 text-agri-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  )
}
