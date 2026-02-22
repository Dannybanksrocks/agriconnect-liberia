import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FarmPulse Liberia',
    template: '%s | FarmPulse Liberia',
  },
  description:
    'Real-time market prices, weather forecasts, and expert agronomy tips for Liberian farmers. Giving every Liberian farmer the data advantage.',
  keywords: [
    'agriculture',
    'Liberia',
    'market prices',
    'weather',
    'farming',
    'agronomy',
    'crops',
  ],
  authors: [{ name: 'Tech 231 Liberia Ltd' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AgriConnect',
  },
}

export const viewport: Viewport = {
  themeColor: '#2E7D32',
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
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} ${dmSans.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
