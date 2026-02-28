import type { Metadata } from 'next'

function normalizeUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return `https://${url}`
}

export function getSiteUrl() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'https://agrihubliberia.com'

  return new URL(normalizeUrl(siteUrl))
}

export const defaultOgImage = '/images/liberian-farmer.jpg'

type SeoInput = {
  title: string
  description: string
  path?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  image = defaultOgImage,
  noIndex = false,
}: SeoInput): Metadata {
  const siteUrl = getSiteUrl()
  const canonical = new URL(path, siteUrl).toString()
  const imageUrl = new URL(image, siteUrl).toString()

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'AgriHub Liberia',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  }
}
