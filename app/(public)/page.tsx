import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsBar from '@/components/landing/StatsBar'
import PartnersBar from '@/components/landing/PartnersBar'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import MissionSection from '@/components/landing/MissionSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import LandingFooter from '@/components/landing/LandingFooter'
import { buildMetadata, getSiteUrl } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Market Prices, Weather, and Farm Tools',
  description:
    'Access Liberia market prices, county weather forecasts, agronomy tips, and digital tools that help farmers make better decisions.',
  path: '/',
  keywords: [
    'AgriHub Liberia',
    'Liberia farm prices',
    'Liberia agriculture app',
    'county weather forecasts Liberia',
    'Liberia agronomy tips',
    'farm marketplace Liberia',
  ],
})

export default function LandingPage() {
  const siteUrl = getSiteUrl()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AgriHub Liberia',
    url: siteUrl.toString(),
    description:
      'AgriHub Liberia helps farmers access market prices, weather forecasts, agronomy guidance, and farm business tools.',
    publisher: {
      '@type': 'Organization',
      name: 'Tech 231 Liberia Ltd',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl.toString()}market?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <StatsBar />
        <PartnersBar />
        <FeaturesSection />
        <MissionSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <LandingFooter />
      </div>
    </>
  )
}
