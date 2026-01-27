"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Copy, Check, RefreshCw, FileText, Target, Zap } from "lucide-react"

interface ExecutiveSummaryProps {
  summary?: string
  keyDifferentiators?: string[]
  valueProposition?: string
  onGenerate?: () => void
  isGenerating?: boolean
}

export function ExecutiveSummary({
  summary,
  keyDifferentiators,
  valueProposition,
  onGenerate,
  isGenerating = false,
}: ExecutiveSummaryProps) {
  const [copied, setCopied] = useState<"summary" | "value" | null>(null)

  const handleCopy = (text: string, type: "summary" | "value") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const hasContent = summary || keyDifferentiators?.length || valueProposition

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Executive Summary</h3>
            <p className="text-sm text-slate-500">AI-generated overview of your proposal</p>
          </div>
        </div>
        
        {onGenerate && (
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {hasContent ? "Regenerate" : "Generate Summary"}
              </>
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {!hasContent && !isGenerating ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-medium text-slate-700 mb-2">No Summary Yet</h4>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Generate an AI-powered executive summary to quickly communicate your proposal's key points.
            </p>
            {onGenerate && (
              <button
                onClick={onGenerate}
                className="px-6 py-2.5 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
              >
                Generate Executive Summary
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Summary */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">Summary</span>
                  </div>
                  <button
                    onClick={() => handleCopy(summary, "summary")}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  >
                    {copied === "summary" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 leading-relaxed">{summary}</p>
                </div>
              </motion.div>
            )}

            {/* Value Proposition */}
            {valueProposition && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700">Value Proposition</span>
                  </div>
                  <button
                    onClick={() => handleCopy(valueProposition, "value")}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  >
                    {copied === "value" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-800 leading-relaxed font-medium">{valueProposition}</p>
                </div>
              </motion.div>
            )}

            {/* Key Differentiators */}
            {keyDifferentiators && keyDifferentiators.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-slate-700">Key Differentiators</span>
                </div>
                <div className="grid gap-3">
                  {keyDifferentiators.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-indigo-800 text-sm leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
