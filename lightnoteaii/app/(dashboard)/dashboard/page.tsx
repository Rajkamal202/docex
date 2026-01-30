"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCredits } from "@/lib/credit-store"
import { useProposals } from "@/lib/proposal-store"
import { WobbleCard } from "@/components/ui/wobble-card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// Circular Progress Component
function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
}: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className="text-emerald-500 progress-ring"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{value}%</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Win Rate</span>
      </div>
    </div>
  )
}

// Custom Tooltip Component
function CustomTooltip({
  active,
  payload,
  label,
}: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-xs font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs text-gray-600">
            <span style={{ color: entry.color }}>{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="ml-1.5 w-4 h-4 rounded-full bg-gray-100 hover:bg-gray-200 inline-flex items-center justify-center transition-colors"
      >
        <svg
          className="w-2.5 h-2.5 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 16v-4m0-4h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-xs text-gray-600 bg-white rounded-lg shadow-lg border border-gray-100 block">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white block" />
        </span>
      )}
    </span>
  )
}

const quickActions = [
  {
    title: "Audit Proposal",
    description: "Get AI-powered feedback",
    href: "/dashboard/upload",
    gradient: "from-gray-900 to-gray-700",
  },
  {
    title: "Generate New",
    description: "Create from scratch",
    href: "/dashboard/generate",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    title: "AI Studio",
    description: "Enhance existing proposals",
    href: "/dashboard/studio",
    gradient: "from-violet-600 to-violet-400",
  },
  {
    title: "View History",
    description: "Browse past proposals",
    href: "/dashboard/history",
    gradient: "from-amber-500 to-amber-400",
  },
]

const gettingStartedSteps = [
  {
    step: 1,
    title: "Upload Your Proposal",
    description: "Start by uploading a PDF or text file of your existing proposal for AI analysis.",
    action: "Upload Now",
    href: "/dashboard/upload",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Get AI Score & Feedback",
    description: "Receive detailed scoring across 5 categories with specific improvement recommendations.",
    action: "Learn More",
    href: "/dashboard/upload",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Refine with AI Studio",
    description: "Use our AI Studio to automatically rewrite and improve weak sections of your proposal.",
    action: "Open Studio",
    href: "/dashboard/studio",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Track & Win",
    description: "Monitor proposal status, track win rates, and continuously improve your approach.",
    action: "View History",
    href: "/dashboard/history",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const featureHighlights = [
  {
    title: "AI-Powered Scoring",
    description:
      "Get instant feedback on structure, credibility, persuasion, clarity, and call-to-action effectiveness.",
    metric: "5 Categories",
  },
  {
    title: "Smart Rewriting",
    description: "Our AI rewrites weak sections while maintaining your voice and style preferences.",
    metric: "3 Tone Options",
  },
  {
    title: "Win Rate Tracking",
    description: "Track proposal outcomes to understand what works and improve over time.",
    metric: "Real-time Analytics",
  },
]

const CHART_COLORS = {
  primary: "#111827",
  secondary: "#10b981",
  tertiary: "#6366f1",
  quaternary: "#f59e0b",
  muted: "#9ca3af",
}

const STATUS_COLORS = {
  won: "#10b981",
  lost: "#ef4444",
  pending: "#f59e0b",
  submitted: "#3b82f6",
  draft: "#9ca3af",
}

export default function DashboardPage() {
  const { balance, tableMissing: creditsTableMissing } = useCredits()
  const {
    proposals = [],
    isLoading,
    getStats,
    getRecentProposals,
    getUpcomingDeadlines,
    getTopPerformers,
    tableMissing: proposalsTableMissing,
  } = useProposals()
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "quarter">("month")

  const stats = useMemo(() => getStats(), [getStats])
  const recentProposals = useMemo(() => getRecentProposals(5) || [], [getRecentProposals])
  const upcomingDeadlines = useMemo(() => getUpcomingDeadlines(3) || [], [getUpcomingDeadlines])
  const topPerformers = useMemo(() => getTopPerformers(3) || [], [getTopPerformers])

  const avgScoreBreakdown = useMemo(() => {
    if (!proposals || proposals.length === 0) {
      return { structure: 0, credibility: 0, persuasion: 0, clarity: 0, callToAction: 0 }
    }
    const proposalsWithScores = proposals.filter((p) => p.scoreBreakdown)
    if (proposalsWithScores.length === 0) {
      return { structure: 0, credibility: 0, persuasion: 0, clarity: 0, callToAction: 0 }
    }

    const totals = proposalsWithScores.reduce(
      (acc, p) => ({
        structure: acc.structure + (p.scoreBreakdown?.structure || 0),
        credibility: acc.credibility + (p.scoreBreakdown?.credibility || 0),
        persuasion: acc.persuasion + (p.scoreBreakdown?.persuasion || 0),
        clarity: acc.clarity + (p.scoreBreakdown?.clarity || 0),
        callToAction: acc.callToAction + (p.scoreBreakdown?.callToAction || 0),
      }),
      { structure: 0, credibility: 0, persuasion: 0, clarity: 0, callToAction: 0 },
    )

    const count = proposalsWithScores.length
    return {
      structure: Math.round(totals.structure / count),
      credibility: Math.round(totals.credibility / count),
      persuasion: Math.round(totals.persuasion / count),
      clarity: Math.round(totals.clarity / count),
      callToAction: Math.round(totals.callToAction / count),
    }
  }, [proposals])

  // Prepare data for charts
  const radarData = useMemo(
    () => [
      { subject: "Structure", value: avgScoreBreakdown.structure, fullMark: 100 },
      { subject: "Credibility", value: avgScoreBreakdown.credibility, fullMark: 100 },
      { subject: "Persuasion", value: avgScoreBreakdown.persuasion, fullMark: 100 },
      { subject: "Clarity", value: avgScoreBreakdown.clarity, fullMark: 100 },
      { subject: "CTA", value: avgScoreBreakdown.callToAction, fullMark: 100 },
    ],
    [avgScoreBreakdown],
  )

  const statusDistribution = useMemo(() => {
    const distribution = [
      { name: "Won", value: stats.wonProposals, color: STATUS_COLORS.won },
      { name: "Lost", value: stats.lostProposals, color: STATUS_COLORS.lost },
      { name: "Pending", value: stats.pendingProposals, color: STATUS_COLORS.pending },
      { name: "Draft", value: stats.draftProposals, color: STATUS_COLORS.draft },
    ].filter((item) => item.value > 0)
    return distribution
  }, [stats])

  const pipelineData = useMemo(() => {
    return stats.monthlyData.map((m) => ({
      ...m,
      avgScore:
        proposals
          .filter((p) => {
            const created = new Date(p.createdAt)
            const monthDate = new Date()
            monthDate.setMonth(monthDate.getMonth() - (5 - stats.monthlyData.indexOf(m)))
            return created.getMonth() === monthDate.getMonth() && p.score !== null
          })
          .reduce((sum, p, _, arr) => sum + (p.score || 0) / (arr.length || 1), 0) || 0,
    }))
  }, [stats.monthlyData, proposals])

  const insights = useMemo(() => {
    const result = []

    if (stats.winRate > 50) {
      result.push({
        title: "Strong Win Rate",
        description: `Your ${stats.winRate}% win rate is performing well. Keep focusing on quality proposals.`,
        type: "positive",
      })
    } else if (stats.winRate > 0) {
      result.push({
        title: "Room for Improvement",
        description: `Your ${stats.winRate}% win rate could be improved. Focus on addressing proposal weaknesses.`,
        type: "suggestion",
      })
    }

    if (avgScoreBreakdown.callToAction < 75 && avgScoreBreakdown.callToAction > 0) {
      result.push({
        title: "Strengthen Call-to-Action",
        description: "Your CTA sections average below 75. Stronger CTAs can improve conversion.",
        type: "suggestion",
      })
    }

    if (stats.totalPipelineValue > 100000) {
      result.push({
        title: "Strong Pipeline",
        description: `$${(stats.totalPipelineValue / 1000).toFixed(0)}k in active pipeline value.`,
        type: "positive",
      })
    }

    if (upcomingDeadlines.length > 0) {
      result.push({
        title: "Upcoming Deadlines",
        description: `${upcomingDeadlines.length} proposal${upcomingDeadlines.length > 1 ? "s" : ""} with upcoming deadlines need attention.`,
        type: "warning",
      })
    }

    return result.slice(0, 3)
  }, [stats, avgScoreBreakdown, upcomingDeadlines])

  if (isLoading) {
    return (
      <div className="min-h-screen dashboard-gradient-bg flex items-center justify-center">
        <div className="glass-panel-strong rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const hasData = proposals.length > 0
  const needsSetup = creditsTableMissing || proposalsTableMissing

  return (
    <div className="min-h-screen dashboard-gradient-bg relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-violet-100/40 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-100/40 to-cyan-100/40 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative z-10 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {needsSetup && (
          <div className="glass-panel-strong rounded-2xl p-5 border border-amber-200/60 bg-amber-50/60">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-900">Database setup required</p>
                <p className="text-xs text-amber-800 mt-1">
                  Some dashboard sections can’t load because required tables are missing in Supabase.
                  Run the SQL scripts in `lightnoteaii/scripts` to create `profiles`, `credits`,
                  `credit_transactions`, and `proposals`.
                </p>
              </div>
              <div className="text-xs text-amber-700">
                Missing:{" "}
                {[creditsTableMissing && "credits/credit_transactions", proposalsTableMissing && "proposals"]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {hasData ? "Overview" : "Welcome to LightNote AI"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {hasData
                ? "Your proposal intelligence at a glance"
                : "AI-powered proposal analysis to help you win more deals"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50">
              <span className="text-xs text-gray-500">Credit Balance:</span>
              <span className={`text-sm font-semibold ${balance < 5 ? "text-red-600" : "text-gray-900"}`}>
                ${balance.toFixed(2)}
              </span>
              <InfoTooltip text="Credits are used for AI features. $2.00 per audit, $2.50 per generation." />
            </div>
            {hasData && (
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as "week" | "month" | "quarter")}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            )}
          </div>
        </div>

        {!hasData && (
          <>
            {/* Getting Started Steps */}
            <div className="glass-panel-strong rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50">
                <h2 className="text-base font-semibold text-gray-900">Getting Started</h2>
                <p className="text-xs text-gray-500 mt-0.5">Follow these steps to improve your proposal win rate</p>
              </div>
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {gettingStartedSteps.map((item) => (
                    <div
                      key={item.step}
                      className="relative p-5 rounded-xl bg-white/50 border border-gray-100 hover:border-gray-200 hover:bg-white/80 transition-all group"
                    >
                      <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                        {item.step}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-3 text-gray-600 group-hover:from-gray-900 group-hover:to-gray-700 group-hover:text-white transition-all">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                      <Link
                        href={item.href}
                        className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
                      >
                        {item.action}
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid gap-4 sm:grid-cols-3">
              {featureHighlights.map((feature, index) => (
                <div key={index} className="glass-panel-strong rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{feature.metric}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* How Scoring Works */}
            <div className="glass-panel-strong rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50">
                <h2 className="text-base font-semibold text-gray-900">How Our AI Scoring Works</h2>
                <p className="text-xs text-gray-500 mt-0.5">Understanding the 5 key scoring categories</p>
              </div>
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-5">
                  {[
                    { name: "Structure", desc: "Document organization, flow, and logical progression", score: "0-100" },
                    {
                      name: "Credibility",
                      desc: "Trust signals, evidence, case studies, and credentials",
                      score: "0-100",
                    },
                    {
                      name: "Persuasion",
                      desc: "Compelling arguments, benefits focus, and value proposition",
                      score: "0-100",
                    },
                    { name: "Clarity", desc: "Clear language, readability, and easy comprehension", score: "0-100" },
                    {
                      name: "Call-to-Action",
                      desc: "Clear next steps and compelling reasons to act now",
                      score: "0-100",
                    },
                  ].map((category, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center mb-3">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{category.desc}</p>
                      <div className="mt-2 text-xs text-gray-400">Score: {category.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="glass-panel-strong rounded-2xl p-8 text-center bg-gradient-to-br from-gray-900 to-gray-800">
              <div className="max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-2">Ready to Improve Your Win Rate?</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Upload your first proposal and get instant AI-powered feedback with actionable recommendations.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/dashboard/upload"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Upload First Proposal
                  </Link>
                  <Link
                    href="/dashboard/generate"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Or Generate New
                  </Link>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  You have ${balance.toFixed(2)} in welcome credits — enough for {Math.floor(balance / 2)} audits
                </p>
              </div>
            </div>
          </>
        )}

        {/* Stats Grid - Only show when user has data */}
        {hasData && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Win Rate */}
              <div className="glass-stat-card rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                      Win Rate
                      <InfoTooltip text="Percentage of submitted proposals that were won. Higher is better — aim for 30%+." />
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{stats.winRate}%</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs text-gray-500">
                        {stats.wonProposals} won / {stats.wonProposals + stats.lostProposals} completed
                      </span>
                    </div>
                  </div>
                  <CircularProgress value={stats.winRate} size={90} strokeWidth={6} />
                </div>
              </div>

              {/* Total Proposals */}
              <div className="glass-stat-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <InfoTooltip text="Total number of proposals you've created or uploaded to LightNote AI." />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Proposals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProposals}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-emerald-600 font-medium">{stats.wonProposals} won</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-amber-600 font-medium">{stats.pendingProposals} pending</span>
                </div>
              </div>

              {/* Average Score */}
              <div className="glass-stat-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-violet-600/5">
                    <svg
                      className="h-5 w-5 text-violet-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <InfoTooltip text="Average AI score across all proposals. 80+ is excellent, 60-79 is good, below 60 needs improvement." />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Avg. Score</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-bold text-gray-900">{stats.averageScore}</p>
                  <span className="text-lg text-gray-300">/100</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-700"
                    style={{ width: `${stats.averageScore}%` }}
                  />
                </div>
              </div>

              {/* Pipeline Value */}
              <div className="glass-stat-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                    <svg
                      className="h-5 w-5 text-amber-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <InfoTooltip text="Total monetary value of all pending and submitted proposals in your pipeline." />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">${(stats.totalPipelineValue / 1000).toFixed(0)}k</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-emerald-600 font-medium">
                    ${(stats.wonValue / 1000).toFixed(0)}k won
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions - Wobble Card Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              <WobbleCard
                href="/dashboard/upload"
                containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-gray-900 to-gray-800 min-h-[300px]"
              >
                <div className="max-w-sm">
                  <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Audit Your Proposal
                  </h2>
                  <p className="mt-4 text-left text-base/6 text-neutral-200">
                    Get instant AI-powered feedback with detailed scoring across 5 key categories. Identify weaknesses
                    and get actionable recommendations.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                    Start Audit
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <Image
                  src="/ai-audit-analytics-dashboard-with-scores-and-chart.jpg"
                  width={400}
                  height={300}
                  alt="AI Audit Dashboard"
                  className="absolute -right-4 lg:-right-[20%] -bottom-10 object-contain rounded-2xl opacity-80 grayscale filter"
                />
              </WobbleCard>

              <WobbleCard
                href="/dashboard/generate"
                containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-blue-600 to-blue-500"
              >
                <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  Generate New Proposal
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  Create winning proposals from scratch with AI assistance. Choose templates and let AI do the heavy
                  lifting.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  Create New
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14m-7-7h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </WobbleCard>

              <WobbleCard
                href="/dashboard/studio"
                containerClassName="col-span-1 min-h-[250px] bg-gradient-to-br from-violet-600 to-purple-500"
              >
                <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  AI Studio
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  Enhance and rewrite existing proposals with advanced AI capabilities.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  Open Studio
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </WobbleCard>

              <WobbleCard
                href="/dashboard/history"
                containerClassName="col-span-1 lg:col-span-2 min-h-[250px] bg-gradient-to-br from-amber-500 to-orange-500"
              >
                <div className="max-w-md">
                  <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    View Proposal History
                  </h2>
                  <p className="mt-4 text-left text-base/6 text-neutral-200">
                    Track all your proposals, monitor win rates, and learn from past submissions. Filter by status,
                    search by client, and export reports.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                    Browse History
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <Image
                  src="/proposal-history-list-with-status-badges-and-analy.jpg"
                  width={300}
                  height={200}
                  alt="Proposal History"
                  className="absolute -right-4 lg:-right-[10%] -bottom-6 object-contain rounded-2xl opacity-80 grayscale filter"
                />
              </WobbleCard>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Performance Trend - Line & Bar Chart */}
              <div className="lg:col-span-2 relative">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
                  <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
                    <div>
                      <h2 className="text-base font-semibold text-gray-900 flex items-center">
                        Performance Trend
                        <InfoTooltip text="Shows monthly comparison of total proposals submitted vs proposals won." />
                      </h2>
                      <p className="text-xs text-gray-500 mt-0.5">Proposals, wins, and pipeline value over 6 months</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="proposals" name="Proposals" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="wins" name="Wins" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Status Distribution - Donut Chart */}
              <div className="relative">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-gray-100/50">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center">
                      Status Distribution
                      <InfoTooltip text="Visual breakdown of all proposals by their current status." />
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Breakdown by proposal status</p>
                  </div>
                  <div className="p-6">
                    {statusDistribution.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie
                              data={statusDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {statusDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                          {statusDistribution.map((item, index) => (
                            <div key={index} className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="text-xs text-gray-600">
                                {item.name} ({item.value})
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data yet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pipeline Value - Area Chart */}
              <div className="lg:col-span-2 relative">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-gray-100/50">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center">
                      Pipeline Value Trend
                      <InfoTooltip text="Total monetary value of proposals created each month." />
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Total value of proposals over time</p>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CHART_COLORS.tertiary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={CHART_COLORS.tertiary} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="month"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          name="Value ($)"
                          stroke={CHART_COLORS.tertiary}
                          fillOpacity={1}
                          fill="url(#colorValue)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Score Breakdown - Radar Chart */}
              <div className="relative">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-gray-100/50">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center">
                      Score Breakdown
                      <InfoTooltip text="Average scores across the 5 AI scoring categories for all your proposals." />
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Average across all proposals</p>
                  </div>
                  <div className="p-6">
                    {avgScoreBreakdown.structure > 0 ? (
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                          <Radar
                            name="Score"
                            dataKey="value"
                            stroke={CHART_COLORS.primary}
                            fill={CHART_COLORS.primary}
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-52 flex items-center justify-center text-sm text-gray-400">
                        No scored proposals yet
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Weekly Activity - Small Line Chart */}
              <div className="lg:col-span-2 relative">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-gray-100/50">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center">
                      Weekly Activity
                      <InfoTooltip text="Your proposal activity over the last 7 days." />
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Last 7 days of proposal activity</p>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={stats.recentActivity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="proposals"
                          name="Proposals"
                          stroke={CHART_COLORS.primary}
                          strokeWidth={2}
                          dot={{ fill: CHART_COLORS.primary, strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="wins"
                          name="Wins"
                          stroke={CHART_COLORS.secondary}
                          strokeWidth={2}
                          dot={{ fill: CHART_COLORS.secondary, strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Proposals Table */}
              <div className="relative">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
                  <div className="p-6 border-b border-gray-100/50">
                    <h2 className="text-base font-semibold text-gray-900">Recent Proposals</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Latest activity</p>
                  </div>
                  <div className="divide-y divide-gray-100/50">
                    {recentProposals.length > 0 ? (
                      recentProposals.slice(0, 4).map((proposal) => (
                        <div key={proposal.id} className="p-4 hover:bg-white/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{proposal.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{proposal.client}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {proposal.score && (
                                <span className="text-xs font-medium text-gray-600">{proposal.score}</span>
                              )}
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${STATUS_COLORS[proposal.status]}15`,
                                  color: STATUS_COLORS[proposal.status],
                                }}
                              >
                                {proposal.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-gray-400">No proposals yet</div>
                    )}
                  </div>
                  {recentProposals.length > 0 && (
                    <div className="p-4 border-t border-gray-100/50">
                      <Link href="/dashboard/history" className="text-xs text-gray-600 hover:text-gray-900 font-medium">
                        View all proposals →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="relative">
            <GlowingEffect
              spread={60}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative glass-panel-strong rounded-2xl overflow-hidden border border-white/20">
              <div className="p-6 border-b border-gray-100/50">
                <h2 className="text-base font-semibold text-gray-900 flex items-center">
                  AI Recommendations
                  <InfoTooltip text="Personalized insights based on your proposal performance data." />
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Insights based on your proposal data</p>
              </div>
              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border ${
                        insight.type === "positive"
                          ? "bg-emerald-50/50 border-emerald-200/50"
                          : insight.type === "warning"
                            ? "bg-amber-50/50 border-amber-200/50"
                            : "bg-blue-50/50 border-blue-200/50"
                      }`}
                    >
                      <h3
                        className={`text-sm font-semibold mb-1 ${
                          insight.type === "positive"
                            ? "text-emerald-900"
                            : insight.type === "warning"
                              ? "text-amber-900"
                              : "text-blue-900"
                        }`}
                      >
                        {insight.title}
                      </h3>
                      <p
                        className={`text-xs ${
                          insight.type === "positive"
                            ? "text-emerald-700"
                            : insight.type === "warning"
                              ? "text-amber-700"
                              : "text-blue-700"
                        }`}
                      >
                        {insight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credit Warning */}
        {balance < 5 && (
          <div className="relative">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative glass-panel-strong rounded-2xl p-6 border-l-4 border-amber-500 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <svg
                    className="h-5 w-5 text-amber-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Low Credit Balance</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    You have ${balance.toFixed(2)} remaining. Add credits to continue using premium features.
                  </p>
                </div>
                <Link
                  href="/dashboard/billing"
                  className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add Credits
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
