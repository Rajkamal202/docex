"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCredits } from "@/lib/credit-store"
import { AddCreditsModal } from "@/components/dashboard/add-credits-modal"
import {
  Upload,
  FileText,
  Sparkles,
  Check,
  Copy,
  Download,
  X,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
  LayoutGrid,
  MessageCircle,
  Shield,
  Zap,
  RefreshCw,
  Eye,
  GitCompare,
  ListChecks,
  DollarSign,
} from "lucide-react"

type ToneType = "formal" | "persuasive" | "executive"
type ViewMode = "improved" | "comparison" | "original" | "analysis"

interface UploadedFile {
  name: string
  size: number
  type: string
  content?: string
}

interface ProposalIssue {
  id: string
  category: string
  severity: "critical" | "major" | "minor"
  title: string
  description: string
  location: string
  suggestion: string
}

interface ProposalImprovement {
  id: string
  category: string
  impact: "high" | "medium" | "low"
  title: string
  before: string
  after: string
  rationale: string
}

interface AnalysisScore {
  category: string
  label: string
  originalScore: number
  improvedScore: number
  maxScore: number
}

interface AnalysisResponse {
  success: boolean
  issues: ProposalIssue[]
  scores: {
    structure: number
    credibility: number
    persuasion: number
    clarity: number
    cta: number
  }
  overallScore: number
  summary: string
  error?: string
}

interface RewriteResponse {
  success: boolean
  improvedContent: string
  improvements: ProposalImprovement[]
  improvedScores: {
    structure: number
    credibility: number
    persuasion: number
    clarity: number
    cta: number
  }
  overallImprovedScore: number
  error?: string
}

const STUDIO_COST = 3.0 // Cost for AI analysis/rewrite

export function AIProposalStudio() {
  const { balance, canAfford, deductCredit } = useCredits()
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRewriting, setIsRewriting] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [rewriteComplete, setRewriteComplete] = useState(false)
  const [selectedTone, setSelectedTone] = useState<ToneType>("formal")
  const [viewMode, setViewMode] = useState<ViewMode>("analysis")
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)
  const [expandedImprovement, setExpandedImprovement] = useState<string | null>(null)

  const [originalProposal, setOriginalProposal] = useState<string>("")
  const [improvedProposal, setImprovedProposal] = useState<string>("")
  const [proposalIssues, setProposalIssues] = useState<ProposalIssue[]>([])
  const [proposalImprovements, setProposalImprovements] = useState<ProposalImprovement[]>([])
  const [analysisScores, setAnalysisScores] = useState<AnalysisScore[]>([])
  const [error, setError] = useState<string | null>(null)

  const overallOriginalScore =
    analysisScores.length > 0
      ? Math.round(analysisScores.reduce((acc, s) => acc + s.originalScore, 0) / analysisScores.length)
      : 0
  const overallImprovedScore =
    analysisScores.length > 0
      ? Math.round(analysisScores.reduce((acc, s) => acc + s.improvedScore, 0) / analysisScores.length)
      : 0

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    // Check credits first
    if (balance < STUDIO_COST) {
      setShowCreditsModal(true)
      return
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".pdf") &&
      !file.name.endsWith(".docx")
    ) {
      setError("Please upload a PDF, DOCX, or TXT file")
      return
    }

    setError(null)

    let content = ""
    try {
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        content = await file.text()
      } else {
        content = await file.text()
      }
    } catch {
      setError("Failed to read file content")
      return
    }

    if (content.length < 50) {
      setError("Proposal content is too short to analyze. Please upload a more substantial document.")
      return
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      content,
    })
    setOriginalProposal(content)

    startAnalysis(content)
  }

  const startAnalysis = async (content: string) => {
    setIsAnalyzing(true)
    setProgress(0)
    setError(null)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90
        return prev + 5
      })
    }, 200)

    try {
      const response = await fetch("/api/studio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, tone: selectedTone }),
      })

      const data: AnalysisResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Analysis failed")
      }

      setProposalIssues(data.issues)
      setAnalysisScores([
        {
          category: "structure",
          label: "Structure & Flow",
          originalScore: data.scores.structure,
          improvedScore: 0,
          maxScore: 100,
        },
        {
          category: "credibility",
          label: "Credibility Signals",
          originalScore: data.scores.credibility,
          improvedScore: 0,
          maxScore: 100,
        },
        {
          category: "persuasion",
          label: "Persuasion Strength",
          originalScore: data.scores.persuasion,
          improvedScore: 0,
          maxScore: 100,
        },
        {
          category: "clarity",
          label: "Clarity & Readability",
          originalScore: data.scores.clarity,
          improvedScore: 0,
          maxScore: 100,
        },
        { category: "cta", label: "Call to Action", originalScore: data.scores.cta, improvedScore: 0, maxScore: 100 },
      ])

      // Deduct credits after successful analysis
      await deductCredit(STUDIO_COST, "AI Proposal Studio - Analysis")

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setIsAnalyzing(false)
        setAnalysisComplete(true)
      }, 300)
    } catch (err) {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
    }
  }

  const startRewrite = async () => {
    if (balance < STUDIO_COST) {
      setShowCreditsModal(true)
      return
    }

    setIsRewriting(true)
    setProgress(0)
    setError(null)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90
        return prev + 3
      })
    }, 200)

    try {
      const response = await fetch("/api/studio/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: originalProposal,
          tone: selectedTone,
          issues: proposalIssues,
        }),
      })

      const data: RewriteResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Rewrite failed")
      }

      setImprovedProposal(data.improvedContent)
      setProposalImprovements(data.improvements)

      setAnalysisScores((prev) =>
        prev.map((score) => ({
          ...score,
          improvedScore:
            data.improvedScores[score.category as keyof typeof data.improvedScores] || score.originalScore + 30,
        })),
      )

      // Deduct credits after successful rewrite
      await deductCredit(STUDIO_COST, "AI Proposal Studio - Rewrite")

      clearInterval(progressInterval)
      setProgress(100)

      setTimeout(() => {
        setIsRewriting(false)
        setRewriteComplete(true)
        setViewMode("analysis")
      }, 300)
    } catch (err) {
      clearInterval(progressInterval)
      setIsRewriting(false)
      setError(err instanceof Error ? err.message : "Rewrite failed. Please try again.")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedProposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([improvedProposal], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "improved-proposal.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetStudio = () => {
    setUploadedFile(null)
    setIsAnalyzing(false)
    setIsRewriting(false)
    setAnalysisComplete(false)
    setRewriteComplete(false)
    setProgress(0)
    setViewMode("analysis")
    setExpandedIssue(null)
    setExpandedImprovement(null)
    setOriginalProposal("")
    setImprovedProposal("")
    setProposalIssues([])
    setProposalImprovements([])
    setAnalysisScores([])
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200"
      case "major":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "minor":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-600 border-gray-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "structure":
        return <LayoutGrid className="h-4 w-4" />
      case "credibility":
        return <Shield className="h-4 w-4" />
      case "value proposition":
        return <Target className="h-4 w-4" />
      case "call to action":
        return <MessageCircle className="h-4 w-4" />
      case "personalization":
        return <Lightbulb className="h-4 w-4" />
      case "methodology":
        return <BarChart3 className="h-4 w-4" />
      case "tone":
        return <MessageCircle className="h-4 w-4" />
      case "clarity":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  // Upload state - Mac-style UI
  if (!uploadedFile && !isAnalyzing) {
    return (
      <div className="h-full bg-white p-6">
        <div className="max-w-5xl mx-auto">
          {/* Mac Window Chrome */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Window Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-600">AI Proposal Studio</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium text-emerald-600">${balance.toFixed(2)}</span>
                  <span className="text-gray-400">($3.00/session)</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 mb-4 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">AI Proposal Studio</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                  Upload your proposal and let AI analyze weaknesses, then rewrite it for maximum impact.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Upload zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200",
                  isDragging
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                )}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors",
                      isDragging ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {isDragging ? "Drop your file here" : "Drag and drop your proposal"}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">DOCX</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">TXT</span>
                  </div>
                </div>
              </div>

              {/* Tone selector */}
              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-3 text-center">Select desired output tone</p>
                <div className="flex justify-center gap-2">
                  {(["formal", "persuasive", "executive"] as ToneType[]).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        selectedTone === tone
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      )}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: <Zap className="h-5 w-5" />,
                    title: "AI Analysis",
                    desc: "Identify weaknesses in structure, tone, and persuasion",
                  },
                  {
                    icon: <RefreshCw className="h-5 w-5" />,
                    title: "Smart Rewrite",
                    desc: "Get AI-powered suggestions and full rewrites",
                  },
                  {
                    icon: <TrendingUp className="h-5 w-5" />,
                    title: "Score Improvement",
                    desc: "Track your proposal score before and after",
                  },
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg text-gray-600 shadow-sm">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AddCreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
      </div>
    )
  }

  // Analyzing/Rewriting state
  if (isAnalyzing || isRewriting) {
    return (
      <div className="h-full bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-600">
                  {isAnalyzing ? "Analyzing Proposal..." : "Rewriting Proposal..."}
                </span>
              </div>
            </div>

            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-24 h-24 mb-6">
                <svg className="w-24 h-24 -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="#111827"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={276.46}
                    strokeDashoffset={276.46 - (276.46 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-900">{progress}%</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isAnalyzing ? "Analyzing Proposal" : "Rewriting Proposal"}
              </h2>
              <p className="text-gray-500 text-sm">
                {isAnalyzing
                  ? "Identifying weaknesses and scoring effectiveness..."
                  : `Applying ${selectedTone} tone and fixing identified issues...`}
              </p>
              {uploadedFile && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Results state - Mac-style UI with split panes
  return (
    <div className="h-full bg-white p-6">
      <div className="max-w-7xl mx-auto h-full">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-3 text-sm font-medium text-gray-600">AI Proposal Studio</span>
              {uploadedFile && (
                <div className="ml-4 flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-gray-200">
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">{uploadedFile.name}</span>
                  <span className="text-xs text-gray-400">({formatFileSize(uploadedFile.size)})</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {analysisComplete && !rewriteComplete && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">
                  Analysis Complete
                </span>
              )}
              {rewriteComplete && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-md">
                  Rewrite Complete
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={resetStudio} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4 mr-1" />
                Start Over
              </Button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            {/* Left Sidebar - Scores */}
            <div className="w-72 border-r border-gray-200 bg-gray-50/50 flex flex-col overflow-hidden flex-shrink-0">
              <div className="p-4 overflow-y-auto flex-1">
                {/* Overall Score */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Proposal Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{overallOriginalScore}</div>
                      <div className="text-xs text-gray-500 mt-1">Original</div>
                    </div>
                    {rewriteComplete && (
                      <>
                        <ArrowRight className="h-5 w-5 text-gray-300" />
                        <div className="text-center">
                          <div className="text-3xl font-bold text-emerald-600">{overallImprovedScore}</div>
                          <div className="text-xs text-gray-500 mt-1">Improved</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1 text-emerald-600">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-semibold">+{overallImprovedScore - overallOriginalScore}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Category Scores */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Score Breakdown</h3>
                  <div className="space-y-3">
                    {analysisScores.map((score) => (
                      <div key={score.category}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{score.label}</span>
                          <span className="font-medium text-gray-900">
                            {score.originalScore}
                            {rewriteComplete && <span className="text-emerald-600"> → {score.improvedScore}</span>}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div
                              className="h-full bg-gray-300 transition-all duration-500"
                              style={{ width: `${score.originalScore}%` }}
                            />
                            {rewriteComplete && (
                              <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{ width: `${score.improvedScore - score.originalScore}%` }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewrite CTA */}
                {analysisComplete && !rewriteComplete && (
                  <Button onClick={startRewrite} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Rewrite Proposal
                  </Button>
                )}

                {/* Export Actions */}
                {rewriteComplete && (
                  <div className="space-y-2">
                    <Button onClick={handleCopy} variant="outline" className="w-full bg-transparent">
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Copied!" : "Copy to Clipboard"}
                    </Button>
                    <Button onClick={handleDownload} variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download TXT
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              {/* View Mode Tabs */}
              <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                  {[
                    { id: "analysis", label: "Analysis", icon: <ListChecks className="h-3.5 w-3.5" /> },
                    { id: "original", label: "Original", icon: <Eye className="h-3.5 w-3.5" /> },
                    ...(rewriteComplete
                      ? [
                          { id: "improved", label: "Improved", icon: <Sparkles className="h-3.5 w-3.5" /> },
                          { id: "comparison", label: "Compare", icon: <GitCompare className="h-3.5 w-3.5" /> },
                        ]
                      : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ViewMode)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                        viewMode === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Analysis View */}
                {viewMode === "analysis" && (
                  <div className="space-y-4">
                    {/* Issues Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-gray-900">Issues Identified</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {proposalIssues.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {proposalIssues.length === 0 ? (
                          <p className="text-gray-500 text-sm">No issues identified yet.</p>
                        ) : (
                          proposalIssues.map((issue) => (
                            <div key={issue.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className="text-gray-400">{getCategoryIcon(issue.category)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 text-sm">{issue.title}</span>
                                    <span
                                      className={cn(
                                        "px-1.5 py-0.5 text-xs font-medium rounded border",
                                        getSeverityColor(issue.severity),
                                      )}
                                    >
                                      {issue.severity}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">{issue.category}</span>
                                </div>
                                <ArrowRight
                                  className={cn(
                                    "h-4 w-4 text-gray-400 transition-transform",
                                    expandedIssue === issue.id && "rotate-90",
                                  )}
                                />
                              </button>
                              {expandedIssue === issue.id && (
                                <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                                  <p className="text-sm text-gray-600 mb-2 mt-3">{issue.description}</p>
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Suggestion</p>
                                    <p className="text-sm text-gray-700">{issue.suggestion}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Improvements Section (after rewrite) */}
                    {rewriteComplete && proposalImprovements.length > 0 && (
                      <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Check className="h-5 w-5 text-emerald-500" />
                          <h3 className="font-semibold text-gray-900">Improvements Made</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {proposalImprovements.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {proposalImprovements.map((improvement) => (
                            <div key={improvement.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  setExpandedImprovement(expandedImprovement === improvement.id ? null : improvement.id)
                                }
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 transition-colors"
                              >
                                <div className="text-gray-400">{getCategoryIcon(improvement.category)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900 text-sm">{improvement.title}</span>
                                    <span
                                      className={cn(
                                        "px-1.5 py-0.5 text-xs font-medium rounded border",
                                        getImpactColor(improvement.impact),
                                      )}
                                    >
                                      {improvement.impact} impact
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">{improvement.category}</span>
                                </div>
                                <ArrowRight
                                  className={cn(
                                    "h-4 w-4 text-gray-400 transition-transform",
                                    expandedImprovement === improvement.id && "rotate-90",
                                  )}
                                />
                              </button>
                              {expandedImprovement === improvement.id && (
                                <div className="px-3 pb-3 pt-0 border-t border-gray-100">
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div className="bg-red-50 rounded-lg p-3">
                                      <p className="text-xs text-red-600 font-medium mb-1">Before</p>
                                      <p className="text-sm text-red-800">{improvement.before}</p>
                                    </div>
                                    <div className="bg-emerald-50 rounded-lg p-3">
                                      <p className="text-xs text-emerald-600 font-medium mb-1">After</p>
                                      <p className="text-sm text-emerald-800">{improvement.after}</p>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 rounded-lg p-3 mt-3">
                                    <p className="text-xs text-gray-500 mb-1">Why this matters</p>
                                    <p className="text-sm text-gray-700">{improvement.rationale}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Original View */}
                {viewMode === "original" && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Original Proposal</h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-gray-50 p-4 rounded-lg leading-relaxed">
                      {originalProposal || "No original proposal content available."}
                    </pre>
                  </div>
                )}

                {/* Improved View */}
                {viewMode === "improved" && rewriteComplete && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Improved Proposal</h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans bg-emerald-50 p-4 rounded-lg border border-emerald-100 leading-relaxed">
                      {improvedProposal}
                    </pre>
                  </div>
                )}

                {/* Comparison View */}
                {viewMode === "comparison" && rewriteComplete && (
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
                      <h3 className="text-sm font-medium text-red-600 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Original
                      </h3>
                      <pre className="whitespace-pre-wrap text-xs text-gray-600 font-sans bg-red-50 p-3 rounded-lg flex-1 overflow-y-auto leading-relaxed">
                        {originalProposal}
                      </pre>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col">
                      <h3 className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Improved
                      </h3>
                      <pre className="whitespace-pre-wrap text-xs text-gray-600 font-sans bg-emerald-50 p-3 rounded-lg flex-1 overflow-y-auto leading-relaxed">
                        {improvedProposal}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddCreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
    </div>
  )
}
