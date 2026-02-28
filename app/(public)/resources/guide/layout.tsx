import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Farmer Guide',
  description:
    'Read the AgriHub Liberia farmer guide to learn how to use market prices, weather forecasts, agronomy tips, and farm tools effectively.',
  path: '/resources/guide',
  keywords: ['AgriHub farmer guide', 'Liberia farmer guide', 'farm app guide Liberia'],
})

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
