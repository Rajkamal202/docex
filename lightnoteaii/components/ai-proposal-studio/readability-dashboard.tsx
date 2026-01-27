"use client"

import React from "react"
import { motion } from "framer-motion"
import { Clock, FileText, Type, MessageSquare, AlertTriangle, BookOpen, BarChart3 } from "lucide-react"

interface ReadabilityMetrics {
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

interface ReadabilityDashboardProps {
  metrics: ReadabilityMetrics
}

const MetricCard = ({
  label,
  value,
  unit,
  icon: Icon,
  status,
  description,
}: {
  label: string
  value: string | number
  unit?: string
  icon: React.ElementType
  status: "good" | "warning" | "poor"
  description?: string
}) => {
  const statusColors = {
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    poor: "bg-rose-50 text-rose-700 border-rose-200",
  }

  const iconColors = {
    good: "text-emerald-500",
    warning: "text-amber-500",
    poor: "text-rose-500",
  }

  return (
    <div className={`p-4 rounded-xl border ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-2">
        <Icon className={`h-5 w-5 ${iconColors[status]}`} />
        <span className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm opacity-70">{unit}</span>}
      </div>
      {description && <p className="text-xs mt-2 opacity-80">{description}</p>}
    </div>
  )
}

const CircularProgress = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label,
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label: string
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percent = Math.min(value / max, 1)
  const offset = circumference - percent * circumference

  const getColor = (val: number) => {
    if (val >= 70) return "#10b981"
    if (val >= 50) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(value)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{Math.round(value)}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-slate-600">{label}</span>
    </div>
  )
}

export function ReadabilityDashboard({ metrics }: ReadabilityDashboardProps) {
  const getPassiveStatus = (percent: number): "good" | "warning" | "poor" => {
    if (percent <= 10) return "good"
    if (percent <= 20) return "warning"
    return "poor"
  }

  const getJargonStatus = (density: number): "good" | "warning" | "poor" => {
    if (density <= 5) return "good"
    if (density <= 15) return "warning"
    return "poor"
  }

  const getSentenceLengthStatus = (avg: number): "good" | "warning" | "poor" => {
    if (avg <= 20) return "good"
    if (avg <= 30) return "warning"
    return "poor"
  }

  const getComplexWordStatus = (percent: number): "good" | "warning" | "poor" => {
    if (percent <= 15) return "good"
    if (percent <= 25) return "warning"
    return "poor"
  }

  return (
    <div className="bg-gradient-to-br from-white via-white to-violet-50/30 rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-sm">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Readability Metrics</h3>
            <p className="text-sm text-slate-500">Detailed analysis of your proposal's readability</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 rounded-xl text-violet-700">
          <Clock className="h-4 w-4" />
          <span className="font-semibold">{metrics.readingTimeMinutes} min read</span>
        </div>
      </div>

      {/* Main Score */}
      <div className="flex items-center justify-center py-6 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-12">
          <CircularProgress value={metrics.fleschKincaid} label="Flesch-Kincaid Score" />
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-900 mb-1">{metrics.gradeLevel}</div>
            <div className="text-sm text-slate-500">Reading Level</div>
            <p className="text-xs text-slate-400 mt-2 max-w-[200px]">
              Ideal for business proposals is 8th-10th grade level
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Avg Sentence"
          value={metrics.avgSentenceLength.toFixed(1)}
          unit="words"
          icon={Type}
          status={getSentenceLengthStatus(metrics.avgSentenceLength)}
          description={metrics.avgSentenceLength <= 20 ? "Good length" : "Consider shorter sentences"}
        />
        <MetricCard
          label="Passive Voice"
          value={metrics.passiveVoicePercent.toFixed(0)}
          unit="%"
          icon={MessageSquare}
          status={getPassiveStatus(metrics.passiveVoicePercent)}
          description={metrics.passiveVoicePercent <= 10 ? "Active and direct" : "Reduce passive voice"}
        />
        <MetricCard
          label="Jargon Density"
          value={metrics.jargonDensity.toFixed(0)}
          unit="%"
          icon={AlertTriangle}
          status={getJargonStatus(metrics.jargonDensity)}
          description={metrics.jargonDensity <= 5 ? "Clear language" : "Simplify terminology"}
        />
        <MetricCard
          label="Complex Words"
          value={metrics.complexWordPercent.toFixed(0)}
          unit="%"
          icon={BookOpen}
          status={getComplexWordStatus(metrics.complexWordPercent)}
          description={metrics.complexWordPercent <= 15 ? "Easy to understand" : "Use simpler words"}
        />
        <MetricCard
          label="Sentences"
          value={metrics.sentenceCount}
          icon={FileText}
          status="good"
        />
        <MetricCard
          label="Paragraphs"
          value={metrics.paragraphCount}
          icon={FileText}
          status="good"
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-slate-500">Needs attention</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-xs text-slate-500">Improve</span>
        </div>
      </div>
    </div>
  )
}
