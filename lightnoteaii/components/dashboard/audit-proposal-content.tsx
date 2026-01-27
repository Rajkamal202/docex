"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCredits } from "@/lib/credit-store"
import { useProposals } from "@/lib/proposal-store"
import { AddCreditsModal } from "@/components/dashboard/add-credits-modal"
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  FileText,
  Award,
  Zap,
  BarChart3,
  PenLine,
  Sparkles,
  Shield,
  Eye,
  RefreshCw,
  History,
  Upload,
  X,
  Loader2,
  Trophy,
  AlertCircle,
  Info,
} from "lucide-react"

type UploadState = "idle" | "uploading" | "analyzing" | "complete" | "error" | "rate_limited"

interface SubMetric {
  name: string
  score: number
}

interface CategoryDetail {
  score: number
  label: string
  description: string
  subMetrics: SubMetric[]
}

interface Strength {
  title: string
  description: string
  impact: "High" | "Medium" | "Low"
}

interface Weakness {
  title: string
  description: string
  severity: "Critical" | "Major" | "Minor"
  location: string
}

interface Recommendation {
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  expectedImpact: string
  effort: "Quick Win" | "Moderate" | "Significant Rewrite"
}

interface SentenceIssue {
  original: string
  issue: string
  suggestion: string
  category: string
}

interface CompetitiveAnalysis {
  differentiators: string[]
  missingElements: string[]
  industryBenchmark: string
}

interface AnalysisResult {
  overallScore: number
  verdict: string
  executiveSummary: string
  winProbability: string
  estimatedReadTime: string
  wordCount: number
  categories: Record<string, CategoryDetail>
  strengths: Strength[]
  weaknesses: Weakness[]
  recommendations: Recommendation[]
  competitiveAnalysis: CompetitiveAnalysis
  sentenceIssues: SentenceIssue[]
}

// Animated circular score gauge component
function ScoreGauge({ score, size = 180 }: { score: number; size?: number }) {
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (s: number) => {
    if (s >= 85) return { stroke: "#10b981", bg: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-600" }
    if (s >= 70) return { stroke: "#22c55e", bg: "from-green-500/20 to-green-500/5", text: "text-green-600" }
    if (s >= 50) return { stroke: "#f59e0b", bg: "from-amber-500/20 to-amber-500/5", text: "text-amber-600" }
    return { stroke: "#ef4444", bg: "from-red-500/20 to-red-500/5", text: "text-red-600" }
  }

  const colors = getScoreColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("text-5xl font-bold", colors.text)}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-sm text-gray-500 font-medium">out of 100</span>
      </div>
    </div>
  )
}

// Mini score bar component
function MiniScoreBar({ score, label }: { score: number; label: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-emerald-500"
    if (s >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-24 truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getColor(score))}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">{score}</span>
    </div>
  )
}

export function AuditProposalContent() {
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<UploadState>("idle")
  const [progress, setProgress] = useState(0)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "recommendations" | "writing">("overview")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { balance, deductCredit, isCreditExhausted } = useCredits()
  const { addProposal } = useProposals()
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false)

  useEffect(() => {
    if (rateLimitCountdown > 0) {
      const timer = setTimeout(() => {
        setRateLimitCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (rateLimitCountdown === 0 && state === "rate_limited") {
      setState("idle")
      setError(null)
    }
  }, [rateLimitCountdown, state])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setError(null)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const removeFile = () => {
    setFile(null)
    setState("idle")
    setProgress(0)
    setAnalysisResult(null)
    setError(null)
    setActiveTab("overview")
  }

  const startAudit = async () => {
    if (!file) return

    if (isCreditExhausted) {
      setShowAddCreditsModal(true)
      return
    }

    setState("uploading")
    setProgress(10)
    setError(null)

    try {
      const text = await file.text()
      setProgress(30)

      setState("analyzing")
      setProgress(50)

      const response = await fetch("/api/audit-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, fileName: file.name }),
      })

      if (response.status === 429) {
        const errorData = await response.json()
        const retryAfterSeconds = Math.ceil((errorData.retryAfter || 60000) / 1000)
        setState("rate_limited")
        setRateLimitCountdown(retryAfterSeconds)
        setError(`API quota exceeded. You can retry in ${retryAfterSeconds} seconds.`)
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Analysis failed")
      }

      setProgress(80)
      const result = await response.json()
      setProgress(100)

      await deductCredit("proposal_audit", `Audit: ${file.name}`)

      // Get first category score for legacy support
      const categoryScores = result.categories
        ? Object.fromEntries(
            Object.entries(result.categories).map(([key, val]) => [key, (val as CategoryDetail).score]),
          )
        : {}

      addProposal({
        name: file.name.replace(/\.[^/.]+$/, ""),
        client: "Unknown Client",
        status: "draft",
        score: result.overallScore,
        value: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        industry: "Other",
        content: text,
        scores: categoryScores,
      })

      setAnalysisResult(result)
      setState("complete")
    } catch (err) {
      setState("error")
      setError(err instanceof Error ? err.message : "Failed to analyze proposal. Please try again.")
    }
  }

  const getWinProbabilityColor = (prob: string) => {
    switch (prob) {
      case "Very High":
        return "text-emerald-600 bg-emerald-50 border-emerald-200"
      case "High":
        return "text-green-600 bg-green-50 border-green-200"
      case "Medium":
        return "text-amber-600 bg-amber-50 border-amber-200"
      default:
        return "text-red-600 bg-red-50 border-red-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "Major":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-blue-100 text-blue-700 border-blue-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700"
      case "Medium":
        return "bg-amber-100 text-amber-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Quick Win":
        return "bg-emerald-100 text-emerald-700"
      case "Moderate":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-purple-100 text-purple-700"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-emerald-100 text-emerald-700"
      case "Medium":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
      <div className="relative max-w-6xl mx-auto">
        {/* Mac-style window */}
        <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-2xl shadow-gray-200/50">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-inner" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-inner" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-gray-600">Proposal Audit Report</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-1 rounded-md",
                  isCreditExhausted ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600",
                )}
              >
                ${balance.toFixed(2)} credits
              </span>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {!analysisResult ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 mb-4">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">AI-Powered Deep Analysis</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Audit Your Proposal</h1>
                    <p className="text-gray-500 max-w-lg mx-auto">
                      Get comprehensive AI feedback with detailed scoring, actionable recommendations, and
                      sentence-level improvements.
                    </p>
                  </div>

                  {/* Upload zone */}
                  <div
                    className={cn(
                      "relative rounded-2xl border-2 border-dashed transition-all duration-300 mb-8",
                      dragActive
                        ? "border-blue-500 bg-blue-50/50"
                        : file
                          ? "border-emerald-400 bg-emerald-50/30"
                          : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100/50",
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {!file && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        disabled={state !== "idle"}
                      />
                    )}

                    {!file ? (
                      <div className="flex flex-col items-center justify-center py-16 px-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                          <Upload className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your proposal here</h3>
                        <p className="text-gray-500 mb-6">or click anywhere to browse files</p>
                        <div className="flex items-center gap-3">
                          {["PDF", "DOC", "DOCX", "TXT"].map((type) => (
                            <span
                              key={type}
                              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-sm"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm mb-6">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          {state === "idle" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFile()
                              }}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <X className="w-5 h-5 text-gray-400" />
                            </button>
                          )}
                        </div>

                        {/* Progress indicator */}
                        {state !== "idle" && state !== "error" && state !== "rate_limited" && (
                          <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                              {state === "complete" ? (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {state === "uploading" && "Processing document..."}
                                  {state === "analyzing" && "AI is performing deep analysis..."}
                                  {state === "complete" && "Analysis complete!"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {state === "analyzing" && "Analyzing clarity, persuasion, specificity, and more"}
                                </p>
                              </div>
                              <span className="text-lg font-bold text-gray-700">{progress}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%]"
                                style={{ backgroundPosition: "0% 0%" }}
                                animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"], width: `${progress}%` }}
                                transition={{
                                  backgroundPosition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                                  width: { duration: 0.5 },
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Rate limit warning */}
                        {state === "rate_limited" && (
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-amber-600" />
                              <div className="flex-1">
                                <p className="font-medium text-amber-800">Rate limit reached</p>
                                <p className="text-sm text-amber-600">Retry available in {rateLimitCountdown}s</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Error message */}
                        {error && state !== "rate_limited" && (
                          <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              <p className="text-sm text-red-600">{error}</p>
                            </div>
                          </div>
                        )}

                        {/* Audit button */}
                        {(state === "idle" || state === "rate_limited") && (
                          <button
                            onClick={startAudit}
                            disabled={isCreditExhausted || rateLimitCountdown > 0}
                            className={cn(
                              "w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2",
                              isCreditExhausted || rateLimitCountdown > 0
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] hover:bg-[position:100%_0] shadow-lg shadow-blue-500/30",
                            )}
                          >
                            <Sparkles className="w-5 h-5" />
                            Start Deep Analysis
                            <span className="text-blue-200 text-sm ml-2">($2.00)</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Features grid */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { icon: BarChart3, label: "5 Category Scores", desc: "With sub-metrics" },
                      { icon: Target, label: "Win Probability", desc: "AI prediction" },
                      { icon: PenLine, label: "Sentence Fixes", desc: "Line-by-line" },
                      { icon: Zap, label: "Priority Actions", desc: "Quick wins first" },
                    ].map((feature, i) => (
                      <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <feature.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <p className="font-medium text-gray-900 text-sm">{feature.label}</p>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Hero section with score */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Main score card */}
                    <div className="col-span-1 p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 flex flex-col items-center justify-center">
                      <ScoreGauge score={analysisResult.overallScore} />
                      <div
                        className={cn(
                          "mt-4 px-4 py-2 rounded-full border text-sm font-semibold",
                          getWinProbabilityColor(analysisResult.winProbability || "Medium"),
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          {analysisResult.winProbability || "Medium"} Win Chance
                        </div>
                      </div>
                    </div>

                    {/* Executive summary */}
                    <div className="col-span-2 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-gray-900 mb-1">Executive Summary</h2>
                          <p className="text-gray-700 leading-relaxed mb-4">
                            {analysisResult.executiveSummary || analysisResult.verdict}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {analysisResult.estimatedReadTime || "5 min read"}
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600">
                              <FileText className="w-4 h-4" />
                              {analysisResult.wordCount?.toLocaleString() || "N/A"} words
                            </div>
                            <div
                              className={cn(
                                "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                                analysisResult.competitiveAnalysis?.industryBenchmark === "Above Average"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : analysisResult.competitiveAnalysis?.industryBenchmark === "Below Average"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-amber-100 text-amber-700",
                              )}
                            >
                              <TrendingUp className="w-3 h-3" />
                              {analysisResult.competitiveAnalysis?.industryBenchmark || "Average"} vs Industry
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tab navigation */}
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                    {[
                      { id: "overview", label: "Score Breakdown", icon: BarChart3 },
                      { id: "details", label: "Strengths & Issues", icon: Eye },
                      { id: "recommendations", label: "Action Plan", icon: Lightbulb },
                      { id: "writing", label: "Writing Fixes", icon: PenLine },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all",
                          activeTab === tab.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900",
                        )}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-5 gap-4"
                      >
                        {Object.entries(analysisResult.categories || {}).map(([key, category]) => (
                          <div
                            key={key}
                            className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={cn(
                                  "text-3xl font-bold",
                                  category.score >= 80
                                    ? "text-emerald-600"
                                    : category.score >= 60
                                      ? "text-amber-600"
                                      : "text-red-600",
                                )}
                              >
                                {category.score}
                              </span>
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center",
                                  category.score >= 80
                                    ? "bg-emerald-100"
                                    : category.score >= 60
                                      ? "bg-amber-100"
                                      : "bg-red-100",
                                )}
                              >
                                {category.score >= 80 ? (
                                  <CheckCircle2
                                    className={cn("w-5 h-5", category.score >= 80 ? "text-emerald-600" : "")}
                                  />
                                ) : category.score >= 60 ? (
                                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                                ) : (
                                  <AlertCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.label}</h3>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{category.description}</p>
                            <div className="space-y-2">
                              {(category.subMetrics || []).map((metric, i) => (
                                <MiniScoreBar key={i} score={metric.score} label={metric.name} />
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === "details" && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-2 gap-6"
                      >
                        {/* Strengths */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Strengths</h3>
                              <p className="text-sm text-gray-500">
                                {(analysisResult.strengths || []).length} identified
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {(analysisResult.strengths || []).map((strength, i) => (
                              <div key={i} className="p-4 rounded-lg bg-white border border-emerald-100">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {strength.title || `Strength ${i + 1}`}
                                  </h4>
                                  <span
                                    className={cn(
                                      "text-xs px-2 py-1 rounded-full font-medium",
                                      getImpactColor(strength.impact || "Medium"),
                                    )}
                                  >
                                    {strength.impact || "Medium"} Impact
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{strength.description || strength}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-white border border-amber-200">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Areas for Improvement</h3>
                              <p className="text-sm text-gray-500">
                                {(analysisResult.weaknesses || []).length} identified
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {(analysisResult.weaknesses || []).map((weakness, i) => (
                              <div key={i} className="p-4 rounded-lg bg-white border border-amber-100">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <h4 className="font-semibold text-gray-900">{weakness.title || `Issue ${i + 1}`}</h4>
                                  <span
                                    className={cn(
                                      "text-xs px-2 py-1 rounded-full font-medium border",
                                      getSeverityColor(weakness.severity || "Minor"),
                                    )}
                                  >
                                    {weakness.severity || "Minor"}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{weakness.description || weakness}</p>
                                {weakness.location && (
                                  <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <Info className="w-3 h-3" />
                                    Found in: {weakness.location}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "recommendations" && (
                      <motion.div
                        key="recommendations"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-200">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">Action Plan</h3>
                              <p className="text-sm text-gray-500">
                                Prioritized recommendations to improve your proposal
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {(analysisResult.recommendations || []).map((rec, i) => (
                              <div
                                key={i}
                                className="p-5 rounded-xl bg-white border border-blue-100 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                                    {i + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                      <h4 className="font-semibold text-gray-900">
                                        {rec.title || `Recommendation ${i + 1}`}
                                      </h4>
                                      <div className="flex items-center gap-2 shrink-0">
                                        <span
                                          className={cn(
                                            "text-xs px-2 py-1 rounded-full font-medium",
                                            getPriorityColor(rec.priority || "Medium"),
                                          )}
                                        >
                                          {rec.priority || "Medium"} Priority
                                        </span>
                                        <span
                                          className={cn(
                                            "text-xs px-2 py-1 rounded-full font-medium",
                                            getEffortColor(rec.effort || "Moderate"),
                                          )}
                                        >
                                          {rec.effort || "Moderate"}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{rec.description || rec}</p>
                                    {rec.expectedImpact && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        <span className="text-emerald-700 font-medium">
                                          Expected impact: {rec.expectedImpact}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Competitive Analysis */}
                        {analysisResult.competitiveAnalysis && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl bg-white border border-gray-200">
                              <div className="flex items-center gap-2 mb-4">
                                <Award className="w-5 h-5 text-emerald-600" />
                                <h4 className="font-semibold text-gray-900">Differentiators</h4>
                              </div>
                              <ul className="space-y-2">
                                {(analysisResult.competitiveAnalysis.differentiators || []).map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-5 rounded-xl bg-white border border-gray-200">
                              <div className="flex items-center gap-2 mb-4">
                                <Shield className="w-5 h-5 text-amber-600" />
                                <h4 className="font-semibold text-gray-900">Missing Elements</h4>
                              </div>
                              <ul className="space-y-2">
                                {(analysisResult.competitiveAnalysis.missingElements || []).map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === "writing" && (
                      <motion.div
                        key="writing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-200"
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <PenLine className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Sentence-Level Improvements</h3>
                            <p className="text-sm text-gray-500">Specific text fixes with before/after examples</p>
                          </div>
                        </div>
                        <div className="space-y-6">
                          {(analysisResult.sentenceIssues || []).length > 0 ? (
                            analysisResult.sentenceIssues.map((issue, i) => (
                              <div key={i} className="p-5 rounded-xl bg-white border border-purple-100">
                                <div className="flex items-center gap-2 mb-4">
                                  <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                                    {issue.category || "Writing"}
                                  </span>
                                  <span className="text-sm text-gray-500">{issue.issue}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                    <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                                      <X className="w-3 h-3" /> Original
                                    </p>
                                    <p className="text-sm text-gray-700 italic">"{issue.original}"</p>
                                  </div>
                                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                                    <p className="text-xs font-medium text-emerald-600 mb-2 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Suggested
                                    </p>
                                    <p className="text-sm text-gray-700 italic">"{issue.suggestion}"</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <PenLine className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                              <p>No sentence-level issues found</p>
                              <p className="text-sm">Your writing is clean!</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={removeFile}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Audit Another
                    </button>
                    <button
                      onClick={() => router.push("/dashboard/history")}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-colors shadow-lg shadow-blue-500/25"
                    >
                      <History className="w-4 h-4" />
                      View History
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <AddCreditsModal
        isOpen={showAddCreditsModal}
        onClose={() => setShowAddCreditsModal(false)}
        onSuccess={() => setError(null)}
      />
    </div>
  )
}
