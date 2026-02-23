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
        </PWAProvider>
      </body>
    </html>
  )
}
