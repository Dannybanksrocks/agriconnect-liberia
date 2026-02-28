import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/auth/', '/admin/'],
      },
    ],
    sitemap: `${siteUrl.toString()}sitemap.xml`,
    host: siteUrl.origin,
  }
}
