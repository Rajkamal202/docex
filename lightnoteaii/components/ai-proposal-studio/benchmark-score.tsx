"use client"

import { motion } from "framer-motion"
import { TrendingUp, Award, Users, Target } from "lucide-react"

interface BenchmarkProps {
  percentile: number
  industryAvg: number
  topPerformers: number
  comparisonNote: string
  yourScore: number
  industry?: string
}

export function BenchmarkScore({
  percentile,
  industryAvg,
  topPerformers,
  comparisonNote,
  yourScore,
  industry = "your industry",
}: BenchmarkProps) {
  const getPercentileColor = (p: number) => {
    if (p >= 75) return { text: "text-emerald-600", bg: "bg-emerald-500" }
    if (p >= 50) return { text: "text-amber-600", bg: "bg-amber-500" }
    return { text: "text-rose-600", bg: "bg-rose-500" }
  }

  const colors = getPercentileColor(percentile)

  const getPercentileLabel = (p: number) => {
    if (p >= 90) return "Exceptional"
    if (p >= 75) return "Above Average"
    if (p >= 50) return "Average"
    if (p >= 25) return "Below Average"
    return "Needs Work"
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Industry Benchmark</h3>
            <p className="text-sm text-slate-500">How your proposal compares</p>
          </div>
        </div>
      </div>

      {/* Main Percentile Display */}
      <div className="px-6 py-8 text-center border-b border-slate-100">
        <div className="relative inline-block">
          {/* Background ring */}
          <svg className="w-40 h-40" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 70}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - percentile / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              transform="rotate(-90 80 80)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900">{percentile}%</span>
            <span className="text-sm text-slate-500">percentile</span>
          </div>
        </div>

        <div className="mt-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${colors.text} bg-opacity-10 ${colors.bg} bg-opacity-10`}>
            <Award className="h-4 w-4" />
            {getPercentileLabel(percentile)}
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-600 max-w-sm mx-auto">
          Your proposal scores in the <strong>top {100 - percentile}%</strong> compared to similar {industry} proposals.
        </p>
      </div>

      {/* Comparison Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-100">
        <div className="px-4 py-5 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Target className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase">Your Score</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{yourScore}</div>
        </div>
        
        <div className="px-4 py-5 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Users className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500 uppercase">Industry Avg</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{industryAvg}</div>
        </div>
        
        <div className="px-4 py-5 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-slate-500 uppercase">Top 10%</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{topPerformers}</div>
        </div>
      </div>

      {/* Visual Comparison Bar */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium text-slate-500">Score Distribution</span>
        </div>
        <div className="relative h-8 bg-slate-200 rounded-full overflow-hidden">
          {/* Industry average marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
            style={{ left: `${industryAvg}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[10px] text-slate-500">Avg</span>
            </div>
          </div>
          
          {/* Top performers marker */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
            style={{ left: `${topPerformers}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[10px] text-amber-600">Top</span>
            </div>
          </div>
          
          {/* Your score */}
          <motion.div
            className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${yourScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          
          {/* Your position marker */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow-lg z-20"
            initial={{ left: 0 }}
            animate={{ left: `calc(${yourScore}% - 8px)` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Note */}
      {comparisonNote && (
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-600 italic">{comparisonNote}</p>
        </div>
      )}
    </div>
  )
}
