'use client'

import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import StatsBar from '@/components/landing/StatsBar'
import PartnersBar from '@/components/landing/PartnersBar'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import MissionSection from '@/components/landing/MissionSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
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
  )
}
