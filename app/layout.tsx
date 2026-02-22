import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { PWAProvider } from '@/components/shared/PWAProvider'
import PWAInstallBanner from '@/components/shared/PWAInstallBanner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'AgriHub Liberia',
    template: '%s | AgriHub Liberia',
  },
  description:
    'Real-time market prices, weather forecasts, and expert agronomy tips for Liberian farmers. Giving every Liberian farmer the data advantage.',
  keywords: ['agriculture', 'Liberia', 'market prices', 'weather', 'farming', 'agronomy', 'crops'],
  authors: [{ name: 'Tech 231 Liberia Ltd' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgriHub',
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
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="AgriHub" />
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <PWAProvider>
          {children}
          <PWAInstallBanner />
          <Toaster position="top-right" richColors closeButton />
        </PWAProvider>
      </body>
    </html>
  )
}
