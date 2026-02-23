import Image from 'next/image'

interface PoweredByProps {
  variant?: 'horizontal' | 'stacked'
  size?: 'sm' | 'md'
}

export default function PoweredBy({
  variant = 'stacked',
  size = 'md',
}: PoweredByProps) {
  const logoSize = size === 'sm' ? 36 : 48
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm'
  const isHorizontal = variant === 'horizontal'

  return (
    <div
      className={`flex ${
        isHorizontal ? 'flex-row items-center gap-6' : 'flex-col gap-3'
      } ${textClass} text-agri-muted dark:text-muted-foreground`}
    >
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="Tech 231 Liberia Ltd"
          width={logoSize}
          height={logoSize}
          className="shrink-0"
        />
        <span>Built by Tech 231 Liberia Limited</span>
      </div>
    </div>
  )
}
