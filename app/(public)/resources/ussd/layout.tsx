import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'USSD Guide',
  description:
    'Learn how to use AgriHub Liberia via USSD on any phone to access market prices, weather forecasts, and agronomy tips.',
  path: '/resources/ussd',
  keywords: ['AgriHub USSD', 'Liberia USSD agriculture', 'dial *347#', 'farm prices USSD Liberia'],
})

export default function UssdLayout({ children }: { children: React.ReactNode }) {
  return children
}
