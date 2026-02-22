'use client'

import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsBar from '@/components/landing/StatsBar'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <LandingFooter />
    </div>
  )
}
