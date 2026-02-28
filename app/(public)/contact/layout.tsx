import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Contact AgriHub Liberia',
  description:
    'Contact AgriHub Liberia for partnerships, platform questions, support, or agricultural technology collaboration.',
  path: '/contact',
  keywords: ['Contact AgriHub Liberia', 'AgriHub support', 'Liberia agri-tech contact'],
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
