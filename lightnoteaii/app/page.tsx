import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { MetricsSection } from "@/components/landing/metrics-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FeaturedQuoteSection } from "@/components/landing/featured-quote-section"
import { FAQSection } from "@/components/landing/faq-section"
import { TeamSection } from "@/components/landing/team-section"
import { AudienceSection } from "@/components/landing/audience-section"
import { WhatYouGetSection } from "@/components/landing/what-you-get-section"
import { WavyCTASection } from "@/components/landing/wavy-cta-section"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { EvolutionTimelineSection } from "@/components/landing/evolution-timeline-section"

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(250, 250, 255)"
        firstColor="96, 165, 250"
        secondColor="167, 139, 250"
        thirdColor="34, 211, 238"
        fourthColor="244, 114, 182"
        fifthColor="129, 140, 248"
        pointerColor="96, 165, 250"
        size="120%"
        blendingValue="hard-light"
        interactive={true}
        containerClassName="!fixed"
      />

      {/* Content layer above the animated background */}
      <div className="relative z-10">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <AudienceSection />
          <WhatYouGetSection />
          <EvolutionTimelineSection />
          <MetricsSection />
          <FeaturesSection />
          <FeaturedQuoteSection />
          <TestimonialsSection />
          <TeamSection />
          <WavyCTASection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}
