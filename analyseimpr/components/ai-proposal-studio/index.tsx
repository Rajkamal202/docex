"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "./header"
import { SubHeader } from "./sub-header"
import { ProposalInput } from "./proposal-input"
import { AnalysisPanel } from "./analysis-panel"
import { ImprovementPanel } from "./improvement-panel"
import { SettingsSidebar, type IndustryType } from "./settings-sidebar"
import { HistoryPanel } from "./history-panel"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"

export interface AnalysisResult {
  overallScore: number
  scores: {
    clarity: number
    persuasion: number
    readability: number
    professionalism: number
  }
  issues: Array<{
    id: string
    type: "critical" | "warning" | "suggestion"
    category: string
    title: string
    description: string
    location?: string
    priority?: number
  }>
  summary: string
  strengths: string[]
  recommendations: string[]
  wordCount?: number
  readabilityGrade?: string
  analyzedAt?: string
  // Extended readability metrics
  readabilityMetrics?: {
    fleschKincaid: number
    gradeLevel: string
    avgSentenceLength: number
    avgWordLength: number
    passiveVoicePercent: number
    jargonDensity: number
    readingTimeMinutes: number
    sentenceCount: number
    paragraphCount: number
    complexWordPercent: number
  }
  // Section extraction
  sections?: Array<{
    id: string
    type: "problem" | "solution" | "pricing" | "timeline" | "casestudy" | "intro" | "conclusion" | "other"
    title: string
    content: string
    score: number
    suggestions: string[]
  }>
  // Competitor benchmarking
  benchmark?: {
    percentile: number
    industryAvg: number
    topPerformers: number
    comparisonNote: string
  }
  // Executive summary
  executiveSummary?: {
    summary: string
    keyDifferentiators: string[]
    valueProposition: string
  }
}

export interface ImprovementResult {
  improvedContent: string
  changes: Array<{
    type: "addition" | "removal" | "modification"
    original: string
    improved: string
    reason: string
    impact?: "high" | "medium" | "low"
  }>
  overallImprovement: number
  keyImprovements: string[]
  metrics?: {
    clarityGain: number
    persuasionGain: number
    readabilityGain: number
    professionalismGain: number
  }
}

export interface HistoryEntry {
  id: string
  content: string
  analysis: AnalysisResult
  improvement?: ImprovementResult
  createdAt: string
}

type WorkflowStep = "input" | "analyzing" | "results" | "improving" | "improved"

export function AIProposalStudio() {
  // Core state
  const [proposalContent, setProposalContent] = useState("")
  const [selectedTone, setSelectedTone] = useState<"formal" | "persuasive" | "executive">("executive")
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>("general")
  const [optimizationGoals, setOptimizationGoals] = useState({
    clarity: true,
    persuasion: false,
    readability: true,
    legalRisk: false,
  })
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("input")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [improvement, setImprovement] = useState<ImprovementResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // History state
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // Analyze handler
  const handleAnalyze = useCallback(async () => {
    if (!proposalContent || proposalContent.length < 50) {
      setError("Please enter at least 50 characters to analyze")
      return
    }

    setError(null)
    setCurrentStep("analyzing")

    try {
      const response = await fetch("/api/studio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: proposalContent,
          tone: selectedTone,
          industry: selectedIndustry,
          goals: optimizationGoals,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Analysis failed")
      }

      setAnalysis(data)
      setCurrentStep("results")

      // Add to history
      const historyEntry: HistoryEntry = {
        id: `history-${Date.now()}`,
        content: proposalContent.slice(0, 200) + "...",
        analysis: data,
        createdAt: new Date().toISOString(),
      }
      setHistory((prev) => [historyEntry, ...prev.slice(0, 9)])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze proposal"
      setError(message)
      setCurrentStep("input")
    }
  }, [proposalContent, selectedTone, optimizationGoals])

  // Improve handler
  const handleImprove = useCallback(async () => {
    if (!analysis) return

    setCurrentStep("improving")

    try {
      const response = await fetch("/api/studio/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: proposalContent,
          tone: selectedTone,
          issues: analysis.issues,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Improvement failed")
      }

      setImprovement(data)
      setCurrentStep("improved")

      // Update history entry with improvement
      setHistory((prev) => {
        const updated = [...prev]
        if (updated[0]) {
          updated[0] = { ...updated[0], improvement: data }
        }
        return updated
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to improve proposal"
      setError(message)
      setCurrentStep("results")
    }
  }, [proposalContent, selectedTone, analysis])

  // Reset handler
  const handleReset = useCallback(() => {
    setProposalContent("")
    setAnalysis(null)
    setImprovement(null)
    setError(null)
    setCurrentStep("input")
  }, [])

  // Accept improvement handler
  const handleAcceptImprovement = useCallback(() => {
    if (improvement?.improvedContent) {
      setProposalContent(improvement.improvedContent)
      setAnalysis(null)
      setImprovement(null)
      setCurrentStep("input")
    }
  }, [improvement])

  // Load from history handler
  const handleLoadFromHistory = useCallback((entry: HistoryEntry) => {
    setProposalContent(entry.content)
    setAnalysis(entry.analysis)
    setImprovement(entry.improvement || null)
    setCurrentStep(entry.improvement ? "improved" : "results")
    setShowHistory(false)
  }, [])

  const toggleGoal = (goal: keyof typeof optimizationGoals) => {
    setOptimizationGoals((prev) => ({ ...prev, [goal]: !prev[goal] }))
  }

  const analyzeLoadingStates = [
    { text: "Reading your proposal..." },
    { text: "Analyzing structure and flow..." },
    { text: "Evaluating clarity metrics..." },
    { text: "Checking persuasion elements..." },
    { text: "Assessing readability score..." },
    { text: "Reviewing professional tone..." },
    { text: "Identifying improvement areas..." },
    { text: "Generating recommendations..." },
  ]

  const improveLoadingStates = [
    { text: "Processing your proposal..." },
    { text: "Applying clarity improvements..." },
    { text: "Enhancing persuasive language..." },
    { text: "Optimizing sentence structure..." },
    { text: "Refining professional tone..." },
    { text: "Polishing transitions..." },
    { text: "Finalizing improvements..." },
    { text: "Preparing comparison view..." },
  ]

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <MultiStepLoader
          loadingStates={analyzeLoadingStates}
          loading={currentStep === "analyzing"}
          duration={1500}
          loop={true}
        />

        <MultiStepLoader
          loadingStates={improveLoadingStates}
          loading={currentStep === "improving"}
          duration={1500}
          loop={true}
        />

        <Header />
        <SubHeader activeTab="improve" />

        <main className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-6 min-w-0">
                {/* Error Banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between"
                    >
                      <span className="text-sm">{error}</span>
                      <button
                        onClick={() => setError(null)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm"
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Workflow Content */}
                <AnimatePresence mode="wait">
                  {(currentStep === "input" || currentStep === "analyzing") && (
                    <ProposalInput
                      key="input"
                      content={proposalContent}
                      onChange={setProposalContent}
                      isAnalyzing={currentStep === "analyzing"}
                    />
                  )}

                  {(currentStep === "results" || currentStep === "improving") && analysis && (
                    <AnalysisPanel
                      key="analysis"
                      analysis={analysis}
                      isImproving={currentStep === "improving"}
                      onImprove={handleImprove}
                      onReset={handleReset}
                      proposalText={proposalContent}
                      industry={selectedIndustry}
                    />
                  )}

                  {currentStep === "improved" && improvement && analysis && (
                    <ImprovementPanel
                      key="improvement"
                      original={proposalContent}
                      improvement={improvement}
                      analysis={analysis}
                      onAccept={handleAcceptImprovement}
                      onReset={handleReset}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-72 flex-shrink-0">
                <SettingsSidebar
                  selectedTone={selectedTone}
                  onToneChange={setSelectedTone}
                  selectedIndustry={selectedIndustry}
                  onIndustryChange={setSelectedIndustry}
                  optimizationGoals={optimizationGoals}
                  onToggleGoal={toggleGoal}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={currentStep === "analyzing"}
                  hasContent={proposalContent.length >= 50}
                  currentStep={currentStep}
                  onShowHistory={() => setShowHistory(true)}
                  historyCount={history.length}
/>
              </div>
            </div>
          </div>
        </main>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
            <HistoryPanel history={history} onSelect={handleLoadFromHistory} onClose={() => setShowHistory(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
