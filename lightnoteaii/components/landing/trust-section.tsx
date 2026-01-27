"use client"

import type React from "react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function TrustSection() {
  const [activeTab, setActiveTab] = useState<"brands" | "agencies">("brands")
  const { ref, isVisible } = useScrollAnimation()

  const brands = [
    { name: "ACME", style: "font-serif tracking-wider text-sm" },
    { name: "TechStart", style: "font-medium text-base" },
    { name: "DESIGNCO", style: "text-[10px] tracking-[0.2em]" },
    { name: "StartupX", style: "font-medium italic text-lg" },
    { name: "MEDIAHUB", style: "tracking-[0.15em] text-xs font-medium" },
    { name: "cloudify", style: "font-mono text-base" },
    { name: "DataFlow", style: "font-medium text-base" },
    { name: "nexus", style: "font-medium text-lg" },
    { name: "VENTURE CO", style: "text-xs tracking-wider" },
    { name: "SCALE", style: "font-bold tracking-wide text-lg" },
  ]

  const agencies = [
    { name: "creative", style: "font-medium text-lg" },
    { name: "digitalfirst.io", style: "text-xs" },
    { name: "GROWTH LAB", style: "text-[10px] tracking-[0.15em]" },
    { name: "Brandify", style: "font-medium text-blue-600 text-base" },
    { name: "Marketwise", style: "text-xs" },
    { name: "STRATEGY", style: "tracking-[0.2em] text-[10px]" },
    { name: "pulse", style: "font-medium text-sm" },
    { name: "AMPLIFY", style: "tracking-[0.15em] text-[10px]" },
    { name: "reach global", style: "text-xs" },
    { name: "LAUNCHPAD", style: "text-[10px] tracking-wider" },
  ]

  const displayLogos = activeTab === "brands" ? brands : agencies

  return (
    <section className="py-12 md:py-16" ref={ref as React.RefObject<HTMLElement>}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Domains Table */}
          <div
            className={`rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-md transition-all duration-500 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="flex gap-2 mb-4">
              <button className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-[#0f0f0f] hover:bg-gray-200 transition-colors duration-200">
                Win/Loss
              </button>
              <button className="rounded-md px-3 py-1.5 text-xs text-[#6b7280] hover:bg-gray-100 transition-colors duration-200">
                Score Trends
              </button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#9ca3af] border-b border-gray-100">
                  <th className="text-left font-normal pb-2">#</th>
                  <th className="text-left font-normal pb-2">Client</th>
                  <th className="text-left font-normal pb-2">Outcome</th>
                  <th className="text-right font-normal pb-2">Score</th>
                  <th className="text-right font-normal pb-2">Win Rate</th>
                </tr>
              </thead>
              <tbody className="text-[#0f0f0f]">
                {[
                  {
                    id: 1,
                    name: "acme.com",
                    icon: "circle",
                    color: "orange",
                    outcome: "Sent",
                    outcomeBg: "purple",
                    score: "32%",
                    winRate: "41%",
                  },
                  {
                    id: 2,
                    name: "techstart.io",
                    icon: "rect",
                    color: "gray",
                    outcome: "Won",
                    outcomeBg: "orange",
                    score: "43%",
                    winRate: "46%",
                  },
                  {
                    id: 3,
                    name: "startup.co",
                    icon: "S",
                    color: "gray",
                    outcome: "",
                    outcomeBg: "",
                    score: "",
                    winRate: "",
                  },
                  {
                    id: 4,
                    name: "designco.com",
                    icon: "arrow",
                    color: "red",
                    outcome: "",
                    outcomeBg: "",
                    score: "",
                    winRate: "",
                  },
                ].map((row, index) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <td className="py-2.5 text-[#9ca3af]">{row.id}</td>
                    <td className="flex items-center gap-2 py-2.5">
                      <span
                        className={`h-4 w-4 rounded bg-${row.color}-100 flex items-center justify-center text-${row.color}-600 text-[8px]`}
                      >
                        {row.icon === "circle" && (
                          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                        {row.icon === "rect" && (
                          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                          </svg>
                        )}
                        {row.icon === "S" && <span className="font-bold">S</span>}
                        {row.icon === "arrow" && (
                          <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23 12l-7.5 7.5v-15z M1 12l7.5 7.5v-15z" />
                          </svg>
                        )}
                      </span>
                      {row.name}
                    </td>
                    <td>
                      {row.outcome && (
                        <span
                          className={`rounded bg-${row.outcomeBg}-100 text-${row.outcomeBg}-700 px-2 py-0.5 text-[10px] font-medium`}
                        >
                          {row.outcome}
                        </span>
                      )}
                    </td>
                    <td className="text-right">{row.score}</td>
                    <td className="text-right">{row.winRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Domains by Type - Donut Chart */}
          <div
            className={`rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-md transition-all duration-500 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-[#0f0f0f]">Proposals by Status</span>
              <svg
                className="h-4 w-4 text-[#9ca3af] hover:text-[#6b7280] transition-colors duration-200 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </div>
            <p className="text-xs text-[#9ca3af] mb-4">Track your proposal pipeline status</p>
            <div className="flex items-center justify-center gap-8">
              <div className="relative h-28 w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="35" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="12"
                    strokeDasharray="55 165"
                    strokeDashoffset="0"
                    className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDelay: "400ms" }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="12"
                    strokeDasharray="40 180"
                    strokeDashoffset="-55"
                    className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDelay: "500ms" }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="12"
                    strokeDasharray="35 185"
                    strokeDashoffset="-95"
                    className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDelay: "600ms" }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="12"
                    strokeDasharray="25 195"
                    strokeDashoffset="-130"
                    className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                    style={{ transitionDelay: "700ms" }}
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="35"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    strokeDasharray="25 195"
                    strokeDashoffset="-155"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold text-[#0f0f0f]">68%</span>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                {[
                  { color: "bg-cyan-400", label: "Won" },
                  { color: "bg-green-500", label: "Sent" },
                  { color: "bg-blue-500", label: "Draft" },
                  { color: "bg-orange-500", label: "Lost" },
                  { color: "bg-gray-300", label: "Expired" },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`}></span>
                    <span className="text-[#6b7280]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`max-w-xl mx-auto mb-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="rounded-full border border-gray-200 bg-white px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300">
            <span className="text-xl">🚀</span>
            <input
              type="text"
              placeholder="Score a new proposal..."
              className="flex-1 text-sm text-[#0f0f0f] placeholder:text-[#9ca3af] bg-transparent border-none outline-none"
            />
            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-[#9ca3af]">AI Score</span>
            <button className="h-8 w-8 rounded-full bg-[#0f0f0f] flex items-center justify-center hover:bg-[#1a1a1a] hover:scale-105 transition-all duration-200">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>

        <p
          className={`text-center text-sm text-[#6b7280] mb-6 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <strong className="text-[#0f0f0f]">Built for freelancers and agencies sending high-stakes proposals.</strong>
        </p>

        <div
          className={`flex justify-center gap-2 mb-8 transition-all duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <button
            onClick={() => setActiveTab("brands")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
              activeTab === "brands"
                ? "bg-white border border-gray-200 text-[#0f0f0f] shadow-sm"
                : "text-[#6b7280] hover:text-[#0f0f0f]"
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab("agencies")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
              activeTab === "agencies"
                ? "bg-white border border-gray-200 text-[#0f0f0f] shadow-sm"
                : "text-[#6b7280] hover:text-[#0f0f0f]"
            }`}
          >
            Agencies
          </button>
        </div>

        <div className="grid grid-cols-5 gap-x-8 gap-y-6 max-w-4xl mx-auto items-center justify-items-center">
          {displayLogos.map((brand, index) => (
            <div
              key={brand.name}
              className={`text-[#9ca3af] hover:text-[#6b7280] transition-all duration-300 cursor-pointer hover:scale-110 ${brand.style} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${700 + index * 50}ms` }}
            >
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
