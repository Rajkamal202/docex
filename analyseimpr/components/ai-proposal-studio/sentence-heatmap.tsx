"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, AlertCircle, Lightbulb, Eye, EyeOff } from "lucide-react"

interface SentenceScore {
  sentence: string
  score: number // 0-100
  issues: Array<{
    type: "critical" | "warning" | "suggestion"
    message: string
  }>
}

interface SentenceHeatmapProps {
  content: string
  sentenceScores?: SentenceScore[]
  issues?: Array<{
    type: "critical" | "warning" | "suggestion"
    category: string
    title: string
    description: string
    location?: string
  }>
}

// Split content into sentences
const splitIntoSentences = (text: string): string[] => {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0)
}

// Calculate sentence score based on issues
const calculateSentenceScores = (
  sentences: string[],
  issues: SentenceHeatmapProps["issues"]
): SentenceScore[] => {
  return sentences.map((sentence, index) => {
    const sentenceIssues: SentenceScore["issues"] = []
    let score = 100

    // Check for common issues
    const wordCount = sentence.split(/\s+/).length
    
    // Long sentence penalty
    if (wordCount > 35) {
      score -= 30
      sentenceIssues.push({ type: "warning", message: "Very long sentence - consider breaking it up" })
    } else if (wordCount > 25) {
      score -= 15
      sentenceIssues.push({ type: "suggestion", message: "Sentence could be shorter for better readability" })
    }

    // Passive voice detection (simple heuristic)
    const passivePatterns = /\b(was|were|been|being|is|are|am)\s+\w+ed\b/i
    if (passivePatterns.test(sentence)) {
      score -= 10
      sentenceIssues.push({ type: "suggestion", message: "Consider using active voice" })
    }

    // Complex word detection
    const complexWordCount = sentence.split(/\s+/).filter(word => word.length > 12).length
    if (complexWordCount > 2) {
      score -= 15
      sentenceIssues.push({ type: "warning", message: "Contains complex vocabulary" })
    }

    // Check if any issues mention this sentence area
    if (issues) {
      issues.forEach(issue => {
        if (issue.location && sentence.toLowerCase().includes(issue.location.toLowerCase().slice(0, 30))) {
          if (issue.type === "critical") score -= 25
          else if (issue.type === "warning") score -= 15
          else score -= 5
          sentenceIssues.push({ type: issue.type, message: issue.title })
        }
      })
    }

    return {
      sentence,
      score: Math.max(0, Math.min(100, score)),
      issues: sentenceIssues,
    }
  })
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "bg-emerald-100 hover:bg-emerald-200 border-emerald-300"
  if (score >= 60) return "bg-amber-100 hover:bg-amber-200 border-amber-300"
  return "bg-rose-100 hover:bg-rose-200 border-rose-300"
}

const getScoreTextColor = (score: number): string => {
  if (score >= 80) return "text-emerald-700"
  if (score >= 60) return "text-amber-700"
  return "text-rose-700"
}

export function SentenceHeatmap({ content, sentenceScores, issues }: SentenceHeatmapProps) {
  const [selectedSentence, setSelectedSentence] = useState<SentenceScore | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(true)

  const sentences = useMemo(() => {
    if (sentenceScores) return sentenceScores
    const split = splitIntoSentences(content)
    return calculateSentenceScores(split, issues)
  }, [content, sentenceScores, issues])

  const stats = useMemo(() => {
    const total = sentences.length
    const good = sentences.filter(s => s.score >= 80).length
    const warning = sentences.filter(s => s.score >= 60 && s.score < 80).length
    const poor = sentences.filter(s => s.score < 60).length
    return { total, good, warning, poor }
  }, [sentences])

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Sentence Analysis</h3>
          <p className="text-sm text-slate-500">Click on any sentence to see details</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">{stats.good}</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-600">{stats.warning}</span>
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-600">{stats.poor}</span>
            </span>
          </div>
          
          {/* Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
          >
            {showHeatmap ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showHeatmap ? "Hide" : "Show"} Heatmap
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-base leading-relaxed">
          {sentences.map((item, index) => (
            <motion.span
              key={index}
              className={`
                inline cursor-pointer rounded px-0.5 py-0.5 transition-all border border-transparent
                ${showHeatmap ? getScoreColor(item.score) : "hover:bg-slate-100"}
                ${selectedSentence === item ? "ring-2 ring-slate-400 ring-offset-1" : ""}
              `}
              onClick={() => setSelectedSentence(selectedSentence === item ? null : item)}
              whileHover={{ scale: 1.01 }}
            >
              {item.sentence}{" "}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Selected Sentence Panel */}
      <AnimatePresence>
        {selectedSentence && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t border-slate-200 bg-slate-50 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(selectedSentence.score)} ${getScoreTextColor(selectedSentence.score)}`}>
                  Score: {selectedSentence.score}
                </div>
                <span className="text-sm text-slate-500">
                  {selectedSentence.sentence.split(/\s+/).length} words
                </span>
              </div>
              <button
                onClick={() => setSelectedSentence(null)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Original sentence */}
            <p className="text-slate-700 bg-white p-4 rounded-lg border border-slate-200 mb-4">
              "{selectedSentence.sentence}"
            </p>

            {/* Issues */}
            {selectedSentence.issues.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Issues Found:</h4>
                {selectedSentence.issues.map((issue, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      issue.type === "critical"
                        ? "bg-rose-50 border border-rose-200"
                        : issue.type === "warning"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    {issue.type === "critical" ? (
                      <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    ) : issue.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${
                      issue.type === "critical"
                        ? "text-rose-700"
                        : issue.type === "warning"
                        ? "text-amber-700"
                        : "text-blue-700"
                    }`}>
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">This sentence looks good!</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
