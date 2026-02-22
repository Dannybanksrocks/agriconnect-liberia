interface AlertBadgeProps {
  count: number
}

export default function AlertBadge({ count }: AlertBadgeProps) {
  if (count <= 0) return null

  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  )
}
