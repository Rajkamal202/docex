"use client"

import { Check } from "lucide-react"

const primaryItems = [
  {
    title: "Proposal Readiness Score",
    description:
      "Know exactly where your proposal stands before you submit. Our scoring system evaluates completeness, clarity, and alignment with client requirements.",
  },
  {
    title: "Targeted Improvement Recommendations",
    description:
      "Receive specific, actionable suggestions that highlight what to strengthen—so you can focus your effort where it matters most.",
  },
  {
    title: "Win-Rate Prediction",
    description:
      "Understand your likelihood of success based on proposal quality signals, helping you prioritize high-potential opportunities.",
  },
  {
    title: "Decision Confidence at Every Stage",
    description:
      "Move forward knowing your proposal meets professional standards. No second-guessing, no missed details.",
  },
]

const advancedItems = [
  {
    title: "AI-Powered Proposal Enhancement",
    description: "Let AI refine your language, structure, and tone while preserving your voice and intent.",
  },
  {
    title: "Structured Feedback Reports",
    description:
      "Detailed, section-by-section analysis for teams that want comprehensive visibility into proposal quality.",
  },
  {
    title: "Expert Human Review",
    description: "For high-stakes submissions, request review from experienced proposal specialists.",
  },
]

export function WhatYouGetSection() {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Ambient Glow Effects */}
      {/* <div className="pointer-events-none absolute inset-0">
        // Left side - blue glow
        <div className="absolute top-1/3 -left-20 w-[350px] h-[500px] bg-blue-400/8 rounded-full blur-[120px]" />
        // Right side - cyan glow
        <div className="absolute bottom-1/4 -right-20 w-[300px] h-[400px] bg-cyan-400/8 rounded-full blur-[100px]" />
        // Bottom center - violet glow
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-violet-400/5 rounded-full blur-[100px]" />
      </div> */}

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">What you get with LightNote AI</h2>
        <p className="text-lg text-gray-500 mb-14 max-w-2xl">
          Everything you need to submit proposals with clarity and confidence—built for teams that take winning
          seriously.
        </p>

        <div className="space-y-8 mb-16">
          {primaryItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4 group">
              <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-gray-200">
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-8">Advanced Support Options</p>
          <div className="space-y-6">
            {advancedItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <Check className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h4 className="text-base font-medium text-gray-600 mb-0.5">{item.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
