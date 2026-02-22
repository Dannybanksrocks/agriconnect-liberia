const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/market/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'market-data',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/weather/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'weather-data',
        expiration: { maxEntries: 20, maxAgeSeconds: 30 * 60 },
      },
    },
    {
      urlPattern: /\/api\/tips/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'tips-content',
        expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
  ],
})

module.exports = withPWA({
  turbopack: {},
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
})
