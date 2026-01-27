"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DarkCtaSection() {
  return (
    <section className="py-20 md:py-28 mx-6 mb-6">
      <div className="max-w-5xl mx-auto rounded-2xl bg-[#0f0f0f] overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Left: Text */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-white mb-4">
              Stop guessing. Know when your proposals are ready to win.
            </h2>
            <p className="text-[16px] text-gray-400 leading-relaxed mb-6">
              Get clarity, confidence, and measurable improvement — before you hit send.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="h-11 rounded-lg bg-white px-5 text-[#0f0f0f] text-[15px] font-medium hover:bg-gray-100"
                asChild
              >
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-lg border-gray-600 px-5 bg-transparent text-white text-[15px] font-medium hover:bg-white/10"
                asChild
              >
                <Link href="/demo">See proposal scoring in action</Link>
              </Button>
            </div>
            <p className="text-[13px] text-gray-500 mt-5">
              Your proposals remain private. We do not train models on your data.
            </p>
          </div>

          {/* Right: Dashboard preview */}
          <div className="rounded-lg overflow-hidden border border-gray-700">
            <img
              src="/dark-dashboard-analytics-proposal-scoring.jpg"
              alt="LightNote AI Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
