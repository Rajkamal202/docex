"use client"

import type React from "react"

import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card } from "@/components/ui/card"

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation()

  const steps = [
    {
      number: "1",
      title: "Create or upload your proposal",
      description: "Start fresh or import existing proposals for instant analysis",
    },
    {
      number: "2",
      title: "Get scored, audited, and receive clear improvement suggestions",
      description: "AI-powered evaluation with actionable feedback in seconds",
    },
    {
      number: "3",
      title: "Track engagement and win-rate over time",
      description: "Monitor performance and optimize your proposal strategy",
    },
  ]

  return (
    <section className="py-24 bg-white" ref={ref as React.RefObject<HTMLElement>}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">How LightNote AI works</h2>
        </div>

        {/* Steps Container - Using standard Card with premium styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-12">
          {steps.map((step, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-500 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-6 h-full">
                {/* Step Number */}
                <div className="text-5xl font-light text-gray-200 mb-4 transition-all duration-300 group-hover:text-gray-300">
                  {step.number}
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-medium text-gray-900 mb-2 leading-snug">{step.title}</h3>

                {/* Step Description */}
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div
          className={`text-center transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "700ms" }}
        >
          <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300">
            Start Free Trial →
          </Link>
        </div>
      </div>
    </section>
  )
}
