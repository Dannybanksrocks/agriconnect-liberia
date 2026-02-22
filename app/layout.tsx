import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
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
    default: 'AgriConnect Liberia',
    template: '%s | AgriConnect Liberia',
  },
  description:
    'Real-time market prices, weather forecasts, and expert agronomy tips for Liberian farmers. Built by Tech 231 Liberia Ltd.',
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
      </body>
    </html>
  )
}
