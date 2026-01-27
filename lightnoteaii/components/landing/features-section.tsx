"use client"

import { Settings, Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#fafafa]/80 backdrop-blur-sm relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium">
            <Settings className="h-4 w-4" />
            Key features
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-6">
          <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[#0f0f0f]">
            Turn proposal intelligence into
            <br />
            improved win-rate with LightNote AI
          </h2>
          <p className="text-[17px] text-[#6b7280] md:pt-2">
            Score proposals against winning patterns, monitor improvement over time, and act before your competitors do.
          </p>
        </div>

        {/* Feature Cards - Row 1 */}
        <div className="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto mb-4">
          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-[#0f0f0f] mb-2">Benchmark Against Winners</h3>
              <p className="text-[15px] text-[#6b7280] mb-6 leading-relaxed">
                Score your proposals against proven winning patterns. Uncover gaps and optimize each section for maximum
                impact.
              </p>

              {/* UI Mockup */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="flex items-center gap-2 text-[#6b7280]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <span className="font-medium text-[#0f0f0f]">Tracked Proposals</span>
                  </span>
                  <div className="flex gap-2">
                    <button className="rounded border border-gray-200 bg-white px-2 py-1 text-[10px]">
                      Add Manually
                    </button>
                    <button className="rounded bg-[#0f0f0f] px-2 py-1 text-[10px] text-white">Bulk Import CSV</button>
                  </div>
                </div>

                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-[#9ca3af] border-b border-gray-100">
                      <th className="text-left font-normal pb-2">Proposal</th>
                      <th className="text-left font-normal pb-2">Score</th>
                      <th className="text-left font-normal pb-2">Status</th>
                      <th className="text-left font-normal pb-2">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#0f0f0f]">
                    <tr className="border-b border-gray-50">
                      <td className="py-2">Enterprise SaaS Proposal 2025</td>
                      <td>
                        <span className="flex items-center gap-1">
                          84% <span className="text-green-500">●</span>
                        </span>
                      </td>
                      <td>
                        <span className="rounded bg-green-100 text-green-700 px-1.5 py-0.5 text-[9px]">Optimized</span>
                      </td>
                      <td>
                        <span className="rounded bg-yellow-100 text-yellow-700 px-1 py-0.5 text-[9px]">
                          Problem-aware
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 text-[#6b7280]">Agency retainer pitch</td>
                      <td>
                        <span className="flex items-center gap-1">
                          72% <span className="text-yellow-500">●</span>
                        </span>
                      </td>
                      <td>
                        <span className="rounded bg-yellow-100 text-yellow-700 px-1.5 py-0.5 text-[9px]">Review</span>
                      </td>
                      <td>
                        <span className="rounded bg-blue-100 text-blue-700 px-1 py-0.5 text-[9px]">Mid-market</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Expanded detail */}
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#0f0f0f]">Enterprise SaaS Proposal 2025</span>
                    <span className="text-[10px] text-[#6b7280]">2 Unique Tags · US IP address · Rising Position</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div>
                      <div className="text-[10px] text-[#0f0f0f] font-medium mb-1">Tags</div>
                      <div className="text-[9px] text-[#6b7280]">Choose which tags are important.</div>
                      <div className="flex gap-1 mt-1">
                        <span className="rounded bg-yellow-100 text-yellow-700 px-1.5 py-0.5 text-[8px]">
                          Problem-aware
                        </span>
                        <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[8px]">Mid-market</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#0f0f0f] font-medium mb-1">Location</div>
                      <div className="text-[9px] text-[#6b7280]">Set your target IP address.</div>
                      <div className="flex items-center gap-1 mt-1 text-[10px]">🇺🇸 US</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#0f0f0f] font-medium mb-1">Estimated Value</div>
                      <div className="text-[9px] text-[#6b7280]">See deal size for this proposal.</div>
                      <div className="text-[10px] mt-1">
                        | Median: $75k <span className="text-green-500">Rising ↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-[#0f0f0f] mb-2">Predictive Win Analytics</h3>
              <p className="text-[15px] text-[#6b7280] mb-6 leading-relaxed">
                Leverage AI-suggested improvements and scoring patterns to focus on the highest-impact opportunities.
              </p>

              {/* Scattered prompts design */}
              <div className="relative h-64 rounded-lg border border-gray-200 bg-white overflow-hidden">
                <div className="absolute inset-0 p-4">
                  <div className="text-xs font-medium text-[#0f0f0f] mb-1">
                    Suggested Improvements <span className="text-[#9ca3af]">(14)</span>
                  </div>
                  <div className="text-[10px] text-[#6b7280]">Based on what wins in your industry</div>

                  {/* Scattered cards */}
                  <div className="absolute top-16 left-4 rotate-[-6deg] rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] shadow-sm max-w-[200px]">
                    <span className="text-[#0f0f0f]">ROI section with intuitive user interfaces</span>
                  </div>

                  <div className="absolute top-12 right-4 rotate-[4deg] rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[10px]">
                    <span className="text-blue-700">Auto-generated Tags</span>
                  </div>

                  <div className="absolute top-28 right-8 rotate-[-2deg] rounded-lg border border-green-200 bg-green-50 px-2 py-1 text-[10px]">
                    <span className="text-green-700">High Volume</span>
                  </div>

                  <div className="absolute bottom-16 left-8 rotate-[3deg] rounded-lg border border-gray-200 bg-white px-3 py-2 text-[11px] shadow-sm max-w-[180px] opacity-70">
                    <span className="text-[#6b7280]">Best CRM software with customizable workflows...</span>
                  </div>

                  <div className="absolute bottom-8 right-4 rotate-[-4deg] rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[10px]">
                    <span className="text-amber-700">Solution Aware</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards - Row 2 */}
        <div className="grid md:grid-cols-3 max-w-5xl mx-auto gap-4 mb-4">
          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200 h-full">
              <h3 className="text-lg font-semibold text-[#0f0f0f] mb-1">Client Win History</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                See how you rank against past proposals and track performance by client.
              </p>

              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <svg
                    className="h-4 w-4 text-[#6b7280]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span className="font-medium text-[#0f0f0f]">Clients</span>
                  <span className="text-[#9ca3af]">(5)</span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-lg border border-gray-100 bg-white p-2.5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">H</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0f0f0f]">
                        HubSpot <span className="text-[#9ca3af] font-normal">+3</span>
                      </div>
                      <div className="text-xs text-[#6b7280]">hubspot.com</div>
                    </div>
                    <button className="rounded bg-[#0f0f0f] text-white px-2.5 py-1 text-[10px] flex items-center gap-1">
                      + Start Tracking
                    </button>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-white p-2.5 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#0f0f0f]">
                        Pipedrive <span className="text-[#9ca3af] font-normal">+2</span>
                      </div>
                      <div className="text-xs text-[#6b7280]">pipedrive.com</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#6b7280]">
                      <Check className="h-3.5 w-3.5" />
                      Actively Tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200 h-full">
              <h3 className="text-lg font-semibold text-[#0f0f0f] mb-1">Scoring Models</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                Track rankings across the models that drive the highest win-rate.
              </p>

              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between text-xs text-[#6b7280] mb-3">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Models
                  </span>
                  <span className="text-[#0f0f0f]">
                    Set Frequency: <span className="font-medium">Daily</span>
                  </span>
                </div>
                {[
                  { name: "Win Predictor", icon: "🎯", checked: true },
                  { name: "ROI Analyzer", icon: "💰", checked: true },
                  { name: "Proof Scorer", icon: "⭐", checked: false },
                  { name: "Clarity Index", icon: "📊", checked: false },
                  { name: "Competitor Gap", icon: "🔍", checked: false },
                  { name: "Pricing Model", icon: "💵", checked: false },
                ].map((model) => (
                  <div key={model.name} className="flex items-center gap-2 text-sm py-1.5">
                    <div
                      className={`h-4 w-4 rounded border flex items-center justify-center ${model.checked ? "bg-[#0f0f0f] border-[#0f0f0f]" : "border-gray-300"}`}
                    >
                      {model.checked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-[#0f0f0f]">{model.name}</span>
                    <span className="ml-auto text-xs">{model.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200 h-full">
              <h3 className="text-lg font-semibold text-[#0f0f0f] mb-1">Recent Analyses</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                Quick access to your latest proposal evaluations and insights.
              </p>

              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between text-xs text-[#6b7280] mb-3">
                  <span>Recent Chats</span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Export
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-[11px]">
                    <div className="font-medium text-[#0f0f0f] mb-1">
                      What's the best way to structure a CRM for a fast-growing startup?
                    </div>
                    <div className="text-[#9ca3af]">A good starting point is to keep things simple. Organize...</div>
                    <div className="flex items-center gap-3 mt-2 text-[9px]">
                      <span className="flex items-center gap-0.5">
                        1🎯 <span className="text-orange-500">●</span> 80
                      </span>
                      <span className="flex items-center gap-0.5">
                        W <span className="text-red-500">●</span>
                      </span>
                      <span className="text-[#9ca3af]">1d ago</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-2.5 text-[11px]">
                    <div className="font-medium text-[#0f0f0f] mb-1">
                      Which CRM platforms offer the best customer support?
                    </div>
                    <div className="text-[#9ca3af]">CRMs such as Attio and Pipedrive help by automating da...</div>
                    <div className="flex items-center gap-3 mt-2 text-[9px]">
                      <span className="flex items-center gap-0.5">
                        2🎯 <span className="text-green-500">●</span> 81
                      </span>
                      <span className="text-[#9ca3af]">2d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3 - Find Key Sources & Act on Insights */}
        <div className="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-[#0f0f0f] mb-1">Find Key Sources</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                Spot the citations shaping your results and refine your strategy.
              </p>

              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    placeholder="Search Sources"
                    className="text-xs text-[#6b7280] bg-transparent outline-none"
                  />
                  <select className="text-xs text-[#6b7280] bg-transparent outline-none">
                    <option>All Types</option>
                  </select>
                </div>
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="text-[#9ca3af] border-b border-gray-100">
                      <th className="text-left font-normal pb-2">Domain</th>
                      <th className="text-left font-normal pb-2">Type</th>
                      <th className="text-left font-normal pb-2">Used</th>
                      <th className="text-left font-normal pb-2">Avg. Citations</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#0f0f0f]">
                    <tr className="border-b border-gray-50">
                      <td className="py-2 flex items-center gap-2">
                        <span className="text-orange-500">●</span> reddit.com
                      </td>
                      <td>
                        <span className="rounded bg-green-100 text-green-700 px-1.5 py-0.5 text-[9px]">UGC</span>
                      </td>
                      <td>32%</td>
                      <td>3.2</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 flex items-center gap-2">
                        <span className="text-blue-500">●</span> attio.com
                      </td>
                      <td>
                        <span className="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[9px]">You</span>
                      </td>
                      <td>43%</td>
                      <td>5.2</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 flex items-center gap-2">
                        <span className="text-gray-400">W</span> wikipedia.org
                      </td>
                      <td>
                        <span className="rounded bg-purple-100 text-purple-700 px-1.5 py-0.5 text-[9px]">
                          Reference
                        </span>
                      </td>
                      <td>31%</td>
                      <td>1.4</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-3 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#0f0f0f] text-white px-3 py-1.5 text-[10px]">
                    <Check className="h-3 w-3" />
                    You have 5 strategy recommendations
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-[#0f0f0f] mb-1">Act on Insights</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                Use recommendations to capture high-impact opportunities and boost your ranking.
              </p>

              <div className="space-y-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 opacity-60">
                  <div className="text-xs font-medium text-[#0f0f0f] mb-1">
                    The review website G2 is regularly cited
                  </div>
                  <div className="text-[10px] text-[#6b7280]">Make sure you have a profile with reviews</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 opacity-80">
                  <div className="text-xs font-medium text-[#0f0f0f] mb-1">LinkedIn is a common source</div>
                  <div className="text-[10px] text-[#6b7280]">Consider joining the conversation</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-[#0f0f0f] p-3 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium mb-1">Join r/CRM subreddit discussions</div>
                      <div className="text-[10px] text-gray-400">Discussions show frequently in sources.</div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 opacity-60">
                  <div className="text-xs font-medium text-[#0f0f0f] mb-1">
                    Articles from NYT regularly show up in...
                  </div>
                  <div className="text-[10px] text-[#6b7280]">Consider placing a story via digital PR</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/signup" className="text-sm text-[#6b7280] hover:text-[#0f0f0f] transition-colors">
            Get $20 Free Credits →
          </Link>
        </div>
      </div>
    </section>
  )
}
