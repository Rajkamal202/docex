"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, RotateCcw, Copy, Check, TrendingUp } from "lucide-react"
import type { AnalysisResult, ImprovementResult } from "./index"
import { DiffView } from "./diff-view"

interface ImprovementPanelProps {
  original: string
  improvement: ImprovementResult
  analysis: AnalysisResult
  onAccept: () => void
  onReset: () => void
}

export function ImprovementPanel({ original, improvement, onAccept, onReset }: ImprovementPanelProps) {
  const [viewMode, setViewMode] = useState<"improved" | "original" | "changes" | "diff">("improved")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(improvement.improvedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Success Header */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Proposal Improved</h2>
            <p className="text-sm text-slate-500 mt-0.5">Your content has been enhanced and optimized</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">+{improvement.overallImprovement}%</span>
          </div>
        </div>

        {improvement.keyImprovements.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
            {improvement.keyImprovements.map((imp, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                {imp}
              </span>
            ))}
          </div>
        )}
      </div>

{/* Content Viewer */}
      <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70">
          {[
            { id: "improved", label: "Improved" },
            { id: "original", label: "Original" },
            { id: "diff", label: "Side-by-Side" },
            { id: "changes", label: "Changes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as typeof viewMode)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                viewMode === tab.id
                  ? "text-slate-900 border-b-2 border-slate-900 -mb-px bg-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {viewMode === "improved" && (
              <motion.div
                key="improved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-[420px] overflow-y-auto"
              >
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {improvement.improvedContent}
                </p>
              </motion.div>
            )}

            {viewMode === "original" && (
              <motion.div
                key="original"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-[420px] overflow-y-auto"
              >
                <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{original}</p>
              </motion.div>
            )}

            {viewMode === "diff" && (
              <motion.div
                key="diff"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DiffView
                  original={original}
                  improved={improvement.improvedContent}
                  changes={improvement.changes}
                />
              </motion.div>
            )}

            {viewMode === "changes" && (
              <motion.div
                key="changes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 max-h-[420px] overflow-y-auto"
              >
                {improvement.changes.map((change, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded font-medium uppercase ${
                          change.type === "addition"
                            ? "bg-emerald-100 text-emerald-700"
                            : change.type === "removal"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {change.type}
                      </span>
                      <span className="text-xs text-slate-500">{change.reason}</span>
                    </div>
                    {change.type !== "addition" && (
                      <p className="text-sm text-slate-400 line-through mb-2">{change.original}</p>
                    )}
                    {change.type !== "removal" && (
                      <p className="text-sm text-slate-700">{change.improved}</p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onAccept}
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Use Improved Version
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleCopy}
            className={`px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
              copied
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Copied
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </span>
            )}
          </button>

          <button
            onClick={onReset}
            className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            title="Start over"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
