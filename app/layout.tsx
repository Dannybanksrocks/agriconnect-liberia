import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PWAProvider } from '@/components/shared/PWAProvider'
import PWAInstallBanner from '@/components/shared/PWAInstallBanner'
import { getSiteUrl } from '@/lib/seo'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'AgriHub Liberia',
    template: '%s | AgriHub Liberia',
  },
  description:
    'AgriHub Liberia helps farmers access market prices, weather forecasts, agronomy guidance, and digital tools for smarter farm decisions.',
  keywords: ['AgriHub Liberia', 'Liberia agriculture', 'farm market prices', 'Liberia weather forecasts', 'agronomy tips', 'farm marketplace', 'smallholder farming', 'Liberian farmers'],
  authors: [{ name: 'Tech 231 Liberia Ltd' }],
  creator: 'Tech 231 Liberia Ltd',
  publisher: 'Tech 231 Liberia Ltd',
  manifest: '/manifest.json',
  category: 'Agriculture',
  applicationName: 'AgriHub Liberia',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AgriHub Liberia',
    description:
      'Agricultural market prices, weather forecasts, agronomy tips, and digital tools built for farmers across Liberia.',
    url: '/',
    siteName: 'AgriHub Liberia',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/liberian-farmer.jpg',
        width: 1200,
        height: 630,
        alt: 'AgriHub Liberia farmer in a rice field',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgriHub Liberia',
    description:
      'Agricultural market prices, weather forecasts, agronomy tips, and digital tools built for farmers across Liberia.',
    images: ['/images/liberian-farmer.jpg'],
  },
  robots: {
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
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgriHub',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: '#1B4332',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <PWAProvider>
          {children}
          <PWAInstallBanner />
          <Toaster position="top-right" richColors closeButton />
          <SpeedInsights />
        </PWAProvider>
      </body>
    </html>
  )
}
