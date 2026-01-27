"use client"

import { ArrowRight } from "lucide-react"

export function TeamSection() {
  return (
    <section className="py-20 md:py-28 bg-transparent relative overflow-hidden">
      {/* Ambient Glow Effects */}

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-px max-w-5xl mx-auto bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          {/* Left: Text content */}
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-[24px] md:text-[28px] font-medium tracking-tight leading-[1.25] text-[#0f0f0f] mb-4">
              We're building proposal intelligence — so great work doesn't lose to poor positioning.
            </h2>
            <p className="text-[15px] text-[#6b7280] mb-6 leading-relaxed">
              AI is changing how clients evaluate proposals, and we're building the intelligence layer for teams who
              want to win.
            </p>
            <div className="flex items-center gap-6 mb-6">
              <a href="#" className="flex items-center gap-2 text-sm text-[#0f0f0f] font-medium group">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
                We are hiring
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="flex items-center gap-6 text-[#9ca3af]">
              <span className="text-base font-semibold">Y Combinator</span>
              <span className="text-base font-medium">a16z</span>
            </div>
          </div>

          {/* Right: Team photo */}
          <div className="bg-white/90 backdrop-blur-sm p-4">
            <div className="rounded-lg overflow-hidden h-full">
              <img
                src="/tech-startup-team-photo-group-of-diverse-professio.jpg"
                alt="LightNote AI Team"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-[#6b7280] mt-4 leading-relaxed">
              Come build, learn, and grow with us — a focused team building the future of proposal intelligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
