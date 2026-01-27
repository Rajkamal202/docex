"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, AlertCircle, Lightbulb, RotateCcw, Loader2, ArrowRight, BarChart3, FileText, Layers, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AnalysisResult } from "./index"
import { ReadabilityDashboard } from "./readability-dashboard"
import { SentenceHeatmap } from "./sentence-heatmap"
import { SectionAnalysis } from "./section-analysis"
import { BenchmarkScore } from "./benchmark-score"
import { ExecutiveSummary } from "./executive-summary"

interface AnalysisPanelProps {
  analysis: AnalysisResult
  isImproving: boolean
  onImprove: () => void
  onReset: () => void
  proposalText?: string
  industry?: string
}

type ViewTab = "overview" | "readability" | "heatmap" | "sections" | "benchmark"

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-rose-500"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-semibold text-slate-900">{score}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getScoreColor(score))}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  )
}

const IssueItem = ({ issue }: { issue: AnalysisResult["issues"][0] }) => {
  const getIssueStyles = (type: string) => {
    switch (type) {
      case "critical":
        return { icon: AlertCircle, iconColor: "text-rose-500", label: "Critical", labelBg: "bg-rose-50 text-rose-600" }
      case "warning":
        return { icon: AlertTriangle, iconColor: "text-amber-500", label: "Warning", labelBg: "bg-amber-50 text-amber-600" }
      default:
        return { icon: Lightbulb, iconColor: "text-blue-500", label: "Suggestion", labelBg: "bg-blue-50 text-blue-600" }
    }
  }

  const styles = getIssueStyles(issue.type)
  const Icon = styles.icon

  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-start gap-3">
        <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", styles.iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-slate-900">{issue.title}</h4>
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", styles.labelBg)}>{styles.label}</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">{issue.description}</p>
        </div>
      </div>
    </div>
  )
}

export function AnalysisPanel({ analysis, isImproving, onImprove, onReset, proposalText, industry }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("overview")
  const criticalCount = analysis.issues.filter((i) => i.type === "critical").length
  const warningCount = analysis.issues.filter((i) => i.type === "warning").length

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Work"
  }

  const tabs = [
    { id: "overview" as ViewTab, label: "Overview", icon: FileText },
    { id: "readability" as ViewTab, label: "Readability", icon: BarChart3 },
    { id: "heatmap" as ViewTab, label: "Heatmap", icon: Layers },
    { id: "sections" as ViewTab, label: "Sections", icon: FileText },
    { id: "benchmark" as ViewTab, label: "Benchmark", icon: TrendingUp },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>
{/* Tab Content */}
      {activeTab === "overview" && (
        <>
          {/* Score Overview */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 mb-1">Overall Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-semibold text-slate-900">{analysis.overallScore}</span>
                  <span className="text-sm text-slate-400">/100</span>
                  <span className="text-sm font-medium text-slate-600 ml-2">{getScoreLabel(analysis.overallScore)}</span>
                </div>
              </div>
              {(criticalCount > 0 || warningCount > 0) && (
                <div className="flex items-center gap-2 text-xs">
                  {criticalCount > 0 && (
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded font-medium">
                      {criticalCount} critical
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded font-medium">
                      {warningCount} warnings
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreBar label="Clarity" score={analysis.scores.clarity} />
              <ScoreBar label="Persuasion" score={analysis.scores.persuasion} />
              <ScoreBar label="Readability" score={analysis.scores.readability} />
              <ScoreBar label="Professional" score={analysis.scores.professionalism} />
            </div>

            <p className="text-sm text-slate-600 mt-5 pt-5 border-t border-slate-100">{analysis.summary}</p>
          </div>

          {/* Executive Summary */}
          {analysis.executiveSummary && (
            <ExecutiveSummary
              summary={analysis.executiveSummary.summary}
              keyDifferentiators={analysis.executiveSummary.keyDifferentiators}
              valueProposition={analysis.executiveSummary.valueProposition}
            />
          )}

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.strengths.map((strength, i) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Issues Found</h3>
              <div className="divide-y divide-slate-100">
                {analysis.issues.map((issue) => (
                  <IssueItem key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Recommendations</h3>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-slate-400 font-medium">{i + 1}.</span>
                    <p className="text-slate-600">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Readability Tab */}
      {activeTab === "readability" && analysis.readabilityMetrics && (
        <ReadabilityDashboard metrics={analysis.readabilityMetrics} />
      )}
      
      {activeTab === "readability" && !analysis.readabilityMetrics && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">Readability Analysis</h4>
          <p className="text-sm text-slate-500">Detailed readability metrics will appear here after analysis.</p>
        </div>
      )}

      {/* Heatmap Tab */}
      {activeTab === "heatmap" && proposalText && (
        <SentenceHeatmap content={proposalText} issues={analysis.issues} />
      )}
      
      {activeTab === "heatmap" && !proposalText && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Layers className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">Sentence Heatmap</h4>
          <p className="text-sm text-slate-500">Visual sentence analysis will appear here.</p>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === "sections" && analysis.sections && (
        <SectionAnalysis sections={analysis.sections} />
      )}
      
      {activeTab === "sections" && !analysis.sections && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">Section Analysis</h4>
          <p className="text-sm text-slate-500">Detailed section breakdown will appear here after analysis.</p>
        </div>
      )}

      {/* Benchmark Tab */}
      {activeTab === "benchmark" && analysis.benchmark && (
        <BenchmarkScore
          percentile={analysis.benchmark.percentile}
          industryAvg={analysis.benchmark.industryAvg}
          topPerformers={analysis.benchmark.topPerformers}
          comparisonNote={analysis.benchmark.comparisonNote}
          yourScore={analysis.overallScore}
          industry={industry}
        />
      )}
      
      {activeTab === "benchmark" && !analysis.benchmark && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">Industry Benchmark</h4>
          <p className="text-sm text-slate-500">Compare your proposal to industry standards after analysis.</p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-900">Ready to improve?</h3>
            <p className="text-xs text-slate-500 mt-0.5">Apply AI-powered enhancements to your proposal</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              disabled={isImproving}
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onImprove}
              disabled={isImproving}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  Improve Proposal
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
