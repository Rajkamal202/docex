"use client"
import { useState } from "react"
import { Eye, BarChart3, Smile, Target } from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    id: "evaluation",
    icon: Eye,
    title: "Evaluation Criteria Insights",
    subtitle: "Know what clients look for",
    description:
      "Understand the specific factors that drive client decisions. Our analysis reveals the evaluation criteria most commonly associated with winning proposals in your industry, helping you tailor content to match buyer expectations.",
    chatQuestion: "What evaluation criteria matter most for enterprise buyers?",
    chatResponse: "Based on analysis of client evaluation patterns, here are the criteria that drive decisions:",
    insights: [
      {
        emoji: "🎯",
        label: "ROI Clarity",
        highlight: "quantified business impact",
        stat: "47% higher in evaluations",
      },
      {
        emoji: "⭐",
        label: "Social Proof",
        highlight: "relevant case studies",
        stat: "38% more buyer confidence",
      },
      {
        emoji: "💰",
        label: "Value Alignment",
        highlight: "pricing tied to outcomes",
        stat: "28% improved win-rate",
      },
    ],
  },
  {
    id: "winrate",
    icon: BarChart3,
    title: "Win-Rate Prediction",
    subtitle: "Data-driven decision confidence",
    description:
      "See your proposal's predicted win-rate before you submit. Historical pattern analysis identifies strengths and gaps, enabling you to make strategic improvements that directly impact your probability of success.",
    chatQuestion: "What's the predicted win-rate for my current proposal?",
    chatResponse: "Based on your proposal analysis, here's your win-rate breakdown:",
    insights: [
      {
        emoji: "📊",
        label: "Current Score",
        highlight: "72% win probability",
        stat: "Above industry average",
      },
      {
        emoji: "✅",
        label: "Strengths",
        highlight: "clear value proposition",
        stat: "Top 15% of proposals",
      },
      {
        emoji: "⚠️",
        label: "Improvement Area",
        highlight: "add case studies",
        stat: "+12% potential lift",
      },
    ],
  },
  {
    id: "preference",
    icon: Smile,
    title: "Client Preference Mapping",
    subtitle: "Align with buyer priorities",
    description:
      "Discover what resonates with your target clients. LightNote AI identifies the messaging, proof points, and value propositions that consistently influence favorable evaluations, strengthening client relationships over time.",
    chatQuestion: "What messaging resonates with this client segment?",
    chatResponse: "Here are the key preferences for your target client profile:",
    insights: [
      {
        emoji: "💬",
        label: "Tone Preference",
        highlight: "consultative approach",
        stat: "3x engagement rate",
      },
      {
        emoji: "📈",
        label: "Content Priority",
        highlight: "outcome-focused language",
        stat: "52% higher response",
      },
      {
        emoji: "🤝",
        label: "Trust Signals",
        highlight: "industry certifications",
        stat: "Key decision factor",
      },
    ],
  },
  {
    id: "competitive",
    icon: Target,
    title: "Competitive Positioning",
    subtitle: "Stand out in evaluations",
    description:
      "Learn how your proposals compare against industry benchmarks. Identify differentiators that set winning proposals apart and position your offering to capture attention during competitive reviews.",
    chatQuestion: "How does my proposal compare to competitors?",
    chatResponse: "Your competitive positioning analysis reveals these insights:",
    insights: [
      {
        emoji: "🏆",
        label: "Differentiator",
        highlight: "unique methodology",
        stat: "Strong competitive edge",
      },
      {
        emoji: "📉",
        label: "Gap Identified",
        highlight: "pricing transparency",
        stat: "Below benchmark",
      },
      {
        emoji: "🎯",
        label: "Opportunity",
        highlight: "emphasize support model",
        stat: "+18% win potential",
      },
    ],
  },
]

export function MetricsSection() {
  const [activeMetric, setActiveMetric] = useState(metrics[0])

  return (
    <section className="py-20 md:py-28 bg-transparent relative overflow-hidden">
      {/* Ambient Glow Effects */}

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-[36px] md:text-[44px] font-medium tracking-tight leading-[1.1] text-[#0f0f0f] mb-4">
            Understand how clients
            <br />
            evaluate your proposals
          </h2>
          <p className="text-[17px] text-[#6b7280] max-w-2xl mx-auto">
            Gain visibility into the criteria that shape client decisions. LightNote AI surfaces the patterns behind
            winning proposals so you can align your content with what evaluators prioritize most.
          </p>
        </div>

        <div className="grid gap-px lg:grid-cols-2 max-w-5xl mx-auto bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          {/* Left Column - Interactive Metrics Tabs */}
          <div className="bg-white/90 backdrop-blur-sm p-8 space-y-0">
            {metrics.map((metric, index) => (
              <button
                key={metric.id}
                onClick={() => setActiveMetric(metric)}
                className={cn(
                  "w-full text-left py-6 transition-all duration-300",
                  index !== metrics.length - 1 ? "border-b border-gray-100" : "",
                  activeMetric.id === metric.id
                    ? "bg-gray-50 -mx-4 px-4 rounded-lg border-transparent"
                    : "hover:bg-gray-50/50 -mx-4 px-4 rounded-lg",
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <metric.icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-300",
                      activeMetric.id === metric.id ? "text-[#0f0f0f]" : "text-[#6b7280]",
                    )}
                  />
                  <h3
                    className={cn(
                      "font-semibold transition-colors duration-300",
                      activeMetric.id === metric.id ? "text-[#0f0f0f]" : "text-[#0f0f0f]",
                    )}
                  >
                    {metric.title}
                  </h3>
                  {activeMetric.id === metric.id && (
                    <span className="ml-auto text-xs text-[#9ca3af] bg-gray-200 px-2 py-0.5 rounded-full">Active</span>
                  )}
                </div>
                <p className="text-xs text-[#9ca3af] mb-2">{metric.subtitle}</p>
                <p
                  className={cn(
                    "text-sm leading-relaxed transition-all duration-300",
                    activeMetric.id === metric.id ? "text-[#0f0f0f]" : "text-[#6b7280]",
                  )}
                >
                  {metric.description}
                </p>
              </button>
            ))}
          </div>

          {/* Right Column - Dynamic Chat UI Preview */}
          <div className="bg-white/90 backdrop-blur-sm p-8">
            {/* Question - animated on change */}
            <div className="flex justify-end mb-4">
              <div
                key={activeMetric.id + "-question"}
                className="rounded-2xl rounded-br-sm bg-gray-100 px-4 py-2.5 text-sm text-[#0f0f0f] max-w-xs animate-in fade-in slide-in-from-right-2 duration-300"
              >
                {activeMetric.chatQuestion}
              </div>
            </div>

            {/* AI Response - animated on change */}
            <div
              key={activeMetric.id + "-response"}
              className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="h-4 w-4 text-[#6b7280]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4M12 8h.01"></path>
                </svg>
              </div>
              <div className="text-sm text-[#6b7280] flex-1">
                <p className="mb-4 leading-relaxed">{activeMetric.chatResponse}</p>
                <div className="space-y-2">
                  {activeMetric.insights.map((insight, idx) => (
                    <div
                      key={insight.label}
                      className="rounded-lg bg-gray-50 px-3 py-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#9ca3af]">≡ {idx + 1}</span>
                        <span className="text-sm">{insight.emoji}</span>
                        <span className="font-medium text-[#0f0f0f] text-sm">{insight.label}</span>
                      </div>
                      <p className="text-xs text-[#6b7280]">
                        Key insight: <span className="text-green-600">{insight.highlight}</span> — {insight.stat}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic tooltip showing active metric summary */}
            <div
              key={activeMetric.id + "-tooltip"}
              className="mt-4 ml-11 inline-flex rounded-lg bg-[#0f0f0f] text-white px-3 py-2 animate-in fade-in duration-300"
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs font-medium">{activeMetric.title.split(" ")[0]}</div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    {activeMetric.insights.slice(0, 3).map((insight, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        <span className="text-xs">≡ {idx + 1}</span>
                        <span>{insight.emoji}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
