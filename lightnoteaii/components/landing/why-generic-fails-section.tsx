"use client"

import type React from "react"

import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function WhyGenericFailsSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-white" ref={ref as React.RefObject<HTMLElement>}>
      <div className="max-w-3xl mx-auto px-6">
        <h2
          className={`text-3xl md:text-4xl font-semibold text-gray-900 text-center mb-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Why generic AI tools fail at proposals
        </h2>

        <ul className="space-y-6 mb-12">
          {[
            "They don't evaluate proposal strength",
            "They don't understand decision-maker criteria",
            "They don't improve win-rate, only wording",
          ].map((item, index) => (
            <li
              key={index}
              className={`text-lg text-gray-600 leading-relaxed pl-6 border-l-2 border-gray-200 hover:border-gray-400 hover:text-gray-800 transition-all duration-500 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              {item}
            </li>
          ))}
        </ul>

        <p
          className={`text-xl md:text-2xl font-medium text-gray-900 text-center leading-relaxed mb-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "650ms" }}
        >
          LightNote AI is built specifically to evaluate, score, and improve proposals — not just generate text.
        </p>

        <div
          className={`text-center transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "800ms" }}
        >
          <Link href="#features" className="text-sm text-[#6b7280] hover:text-[#0f0f0f] transition-colors duration-300">
            See proposal scoring in action →
          </Link>
        </div>
      </div>
    </section>
  )
}
