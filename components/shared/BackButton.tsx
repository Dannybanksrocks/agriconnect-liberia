'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  href?: string
  label?: string
  className?: string
  variant?: 'default' | 'ghost' | 'white'
}

export default function BackButton({ href, label = 'Back', className = '', variant = 'default' }: Props) {
  const router = useRouter()

  const base = 'inline-flex items-center gap-1.5 text-sm font-medium transition-colors'
  const styles = {
    default: 'text-gray-600 hover:text-gray-900',
    ghost: 'text-white/70 hover:text-white',
    white: 'text-white hover:text-white/80',
  }

  const content = (
    <>
      <ArrowLeft className="w-4 h-4" />
      {label}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {content}
    </button>
  )
}
