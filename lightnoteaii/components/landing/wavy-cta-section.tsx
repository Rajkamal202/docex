"use client"

import { NoiseBackground } from "@/components/ui/noise-background"
import { Button } from "@/components/ui/button"
import { WavyBackground } from "@/components/ui/wavy-background"
import Link from "next/link"

export function WavyCTASection() {
  return (
    <section className="relative overflow-hidden">
      <WavyBackground
        className="max-w-4xl mx-auto px-6"
        containerClassName="h-[500px] md:h-[600px]"
        colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#6366f1"]}
        backgroundFill="#ffffff"
        waveOpacity={0.15}
        blur={20}
        speed="fast"
        waveWidth={60}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-neutral-700 mb-8 shadow-sm">
            Join 2,500+ winning teams
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 mb-6">
            Ready to win
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              more deals?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing what works. Let AI analyze your proposals and show you exactly how to improve your win rate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mb-10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">47%</div>
              <div className="text-sm text-neutral-500 mt-1">Higher Win Rate</div>
            </div>
            <div className="h-10 w-px bg-neutral-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">3.2x</div>
              <div className="text-sm text-neutral-500 mt-1">Faster Creation</div>
            </div>
            <div className="h-10 w-px bg-neutral-200 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-neutral-900">$2M+</div>
              <div className="text-sm text-neutral-500 mt-1">Deals Closed</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NoiseBackground className="rounded-full shadow-lg hover:scale-105 transition-transform" speed={0.004}>
              <Link href="/signup" className="flex items-center justify-center h-12 px-8 text-white font-medium">
                Get $20 Free Credits
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </NoiseBackground>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 rounded-full border-neutral-300 bg-white/80 text-neutral-900 font-medium hover:bg-neutral-50 backdrop-blur-sm"
              asChild
            >
              <Link href="/contact">Book a Demo</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            No credit card required • $20 free credits for new users • Cancel anytime
          </p>
        </div>
      </WavyBackground>
    </section>
  )
}
