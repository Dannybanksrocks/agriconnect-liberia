import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'About AgriHub Liberia',
  description:
    'Learn about AgriHub Liberia, the mission behind the platform, and how Tech 231 Liberia is building digital tools for farmers.',
  path: '/about',
  keywords: ['About AgriHub Liberia', 'Tech 231 Liberia', 'Liberia agri-tech', 'farmer platform Liberia'],
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
