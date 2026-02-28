import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Code, Key, BookOpen, Zap } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'API Documentation',
  description: 'Agri Hub Liberia API documentation for developers',
  path: '/resources/api',
  keywords: ['AgriHub API', 'Liberia agriculture API', 'developer documentation'],
})

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B4332] to-[#2D6A4F]">
      {/* Header */}
      <div className="bg-[#1B4332] border-b border-white/10">
        <div className="container py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              API Documentation
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Access Agri Hub Liberia market data, weather forecasts, and agricultural content programmatically.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid gap-8">
              {/* Coming Soon Notice */}
              <div className="rounded-xl bg-green-50 border border-green-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">API Coming Soon</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      The Agri Hub Liberia API is currently in development. We're building REST and GraphQL endpoints for developers, NGOs, and research institutions to access agricultural data across all 15 counties.
                    </p>
                  </div>
                </div>
              </div>

              {/* Planned Endpoints */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Planned API Endpoints</h2>
                <div className="space-y-4">
                  {[
                    {
                      icon: Code,
                      title: 'Market Prices API',
                      description: 'Real-time crop prices across all counties with historical data',
                      endpoint: 'GET /api/v1/prices',
                    },
                    {
                      icon: BookOpen,
                      title: 'Weather API',
                      description: 'County-specific weather forecasts and agricultural alerts',
                      endpoint: 'GET /api/v1/weather/:county',
                    },
                    {
                      icon: Key,
                      title: 'Agronomy Tips API',
                      description: 'Farming guides and expert advice by crop type',
                      endpoint: 'GET /api/v1/tips',
                    },
                  ].map((item) => (
                    <div key={item.title} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <item.icon className="w-5 h-5 text-[#2D6A4F] mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2 inline-block font-mono">
                            {item.endpoint}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-xl bg-gray-50 p-6">
                <h3 className="font-bold text-gray-900 mb-2">Interested in API Access?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Register your interest and we'll notify you when the API launches. Priority access for NGOs, research institutions, and government agencies.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2D6A4F] transition-colors"
                >
                  Contact Us About API Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
