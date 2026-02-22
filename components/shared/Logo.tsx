'use client'

import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white' | 'dark'
  linkTo?: string
}

const sizes = {
  sm: { icon: 24, text: 'text-sm', sub: 'text-[10px]' },
  md: { icon: 32, text: 'text-lg', sub: 'text-xs' },
  lg: { icon: 48, text: 'text-2xl', sub: 'text-sm' },
}

function getColors(variant: LogoProps['variant']) {
  switch (variant) {
    case 'white':
      return { leaf: '#FFFFFF', wifi: '#FFFFFF', text: '#FFFFFF', sub: '#FFFFFF' }
    case 'dark':
      return { leaf: '#2E7D32', wifi: '#F9A825', text: '#FFFFFF', sub: '#FFFFFF' }
    default:
      return { leaf: '#2E7D32', wifi: '#F9A825', text: '#2E7D32', sub: '#F9A825' }
  }
}

export function LogoIcon({
  size = 'md',
  variant = 'default',
}: {
  size?: LogoProps['size']
  variant?: LogoProps['variant']
}) {
  const s = sizes[size ?? 'md']
  const c = getColors(variant)

  return (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Leaf body */}
      <path
        d="M12 36C12 36 8 24 16 14C20 9 28 6 34 8C36 14 33 22 28 28C22 34 12 36 12 36Z"
        fill={c.leaf}
        opacity={0.9}
      />
      <path
        d="M12 36C16 28 22 20 34 8"
        stroke={c.leaf === '#FFFFFF' ? 'rgba(255,255,255,0.5)' : '#1B5E20'}
        strokeWidth="1.5"
        fill="none"
      />
      {/* WiFi arcs from leaf tip */}
      <path
        d="M30 12A6 6 0 0 1 36 6"
        stroke={c.wifi}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 16A12 12 0 0 1 40 4"
        stroke={c.wifi}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={0.75}
      />
      <path
        d="M26 20A18 18 0 0 1 44 2"
        stroke={c.wifi}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
    </svg>
  )
}

export default function Logo({
  size = 'md',
  variant = 'default',
  linkTo = '/',
}: LogoProps) {
  const s = sizes[size]
  const c = getColors(variant)

  const content = (
    <div className="flex items-center gap-2">
      <LogoIcon size={size} variant={variant} />
      <div className="flex flex-col leading-tight">
        <span
          className={`${s.text} font-bold tracking-tight`}
          style={{ color: c.text }}
        >
          Agri Hub
        </span>
        <span
          className={`${s.sub} font-medium -mt-0.5`}
          style={{ color: c.sub }}
        >
          Liberia
        </span>
      </div>
    </div>
  )

  if (linkTo) {
    return (
      <Link href={linkTo} aria-label="Agri Hub Liberia home">
        {content}
      </Link>
    )
  }

  return content
}
