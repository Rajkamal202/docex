"use client"

import { Button } from "@/components/ui/button"
import { NoiseBackground } from "@/components/ui/noise-background"
import { Eye, BarChart3, Smile } from "lucide-react"
import Link from "next/link"
import { InteractiveDashboard } from "./interactive-dashboard"

export function HeroSection() {
  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-12 relative overflow-hidden">
      {/* Ambient Glow Effects */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            Now with AI-powered proposal scoring
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-[42px] md:text-[56px] lg:text-[64px] font-medium tracking-tight leading-[1.08]">
            <span className="text-[#0f0f0f]">Proposal intelligence</span>
            <br />
            <span className="text-[#9ca3af]">for winning teams</span>
          </h1>

          <p className="mb-8 text-[17px] text-[#6b7280] leading-relaxed max-w-2xl mx-auto">
            Score, analyze, and improve your proposals through key metrics like{" "}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-0.5 text-[13px] text-[#0f0f0f]">
              <Eye className="h-3.5 w-3.5" />
              Quality
            </span>
            ,{" "}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-0.5 text-[13px] text-[#0f0f0f]">
              <BarChart3 className="h-3.5 w-3.5" />
              Win Rate
            </span>
            , and{" "}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-3 py-0.5 text-[13px] text-[#0f0f0f]">
              <Smile className="h-3.5 w-3.5" />
              Confidence
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="h-11 rounded-lg border-gray-200 px-5 bg-white/80 backdrop-blur-sm text-[#0f0f0f] text-[15px] font-medium hover:bg-gray-50"
              asChild
            >
              <Link href="/contact">
                <span className="flex h-2 w-2 mr-2">
                  <span className="inline-flex h-2 w-2 rounded-sm bg-[#0f0f0f]"></span>
                </span>
                Talk to Sales
              </Link>
            </Button>
            <NoiseBackground className="rounded-lg" speed={0.004}>
              <Link
                href="/signup"
                className="flex items-center justify-center h-11 px-5 text-white text-[15px] font-medium hover:opacity-90 transition-opacity"
              >
                Get $20 Free Credits
              </Link>
            </NoiseBackground>
          </div>

          <p className="mt-6 text-[14px] text-[#9ca3af] text-center">
            Designed to complement — not replace — human judgment.
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mx-auto mt-16 max-w-5xl">
          <InteractiveDashboard />
        </div>
      </div>
    </section>
  )
}
