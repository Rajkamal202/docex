"use client"

import React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronDown, 
  ChevronRight, 
  AlertCircle, 
  Target, 
  DollarSign, 
  Clock, 
  FileText, 
  Lightbulb,
  BookOpen,
  CheckCircle2
} from "lucide-react"

type SectionType = "problem" | "solution" | "pricing" | "timeline" | "casestudy" | "intro" | "conclusion" | "other"

interface Section {
  id: string
  type: SectionType
  title: string
  content: string
  score: number
  suggestions: string[]
}

interface SectionAnalysisProps {
  sections: Section[]
}

const sectionConfig: Record<SectionType, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  problem: { icon: AlertCircle, color: "text-rose-600", bgColor: "bg-rose-100", label: "Problem Statement" },
  solution: { icon: Lightbulb, color: "text-emerald-600", bgColor: "bg-emerald-100", label: "Solution" },
  pricing: { icon: DollarSign, color: "text-amber-600", bgColor: "bg-amber-100", label: "Pricing" },
  timeline: { icon: Clock, color: "text-blue-600", bgColor: "bg-blue-100", label: "Timeline" },
  casestudy: { icon: BookOpen, color: "text-purple-600", bgColor: "bg-purple-100", label: "Case Study" },
  intro: { icon: FileText, color: "text-slate-600", bgColor: "bg-slate-100", label: "Introduction" },
  conclusion: { icon: Target, color: "text-indigo-600", bgColor: "bg-indigo-100", label: "Conclusion" },
  other: { icon: FileText, color: "text-slate-500", bgColor: "bg-slate-100", label: "Other" },
}

const ScoreIndicator = ({ score }: { score: number }) => {
  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-600 bg-emerald-100"
    if (s >= 60) return "text-amber-600 bg-amber-100"
    return "text-rose-600 bg-rose-100"
  }

  return (
    <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${getColor(score)}`}>
      {score}
    </div>
  )
}

export function SectionAnalysis({ sections }: SectionAnalysisProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const avgScore = sections.length > 0 
    ? Math.round(sections.reduce((acc, s) => acc + s.score, 0) / sections.length)
    : 0

  const detectedTypes = [...new Set(sections.map(s => s.type))]
  const missingTypes: SectionType[] = ["problem", "solution", "pricing", "timeline", "conclusion"]
    .filter(t => !detectedTypes.includes(t as SectionType)) as SectionType[]

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Section Analysis</h3>
            <p className="text-sm text-slate-500">Your proposal structure breakdown</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-900">{avgScore}</div>
            <div className="text-xs text-slate-500">Avg. Score</div>
          </div>
        </div>

        {/* Section Type Pills */}
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const config = sectionConfig[section.type]
            const Icon = config.icon
            return (
              <button
                key={section.id}
                onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedSection === section.id
                    ? `${config.bgColor} ${config.color} ring-2 ring-offset-1 ring-slate-300`
                    : `bg-slate-100 text-slate-600 hover:bg-slate-200`
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </button>
            )
          })}
        </div>

        {/* Missing Sections Warning */}
        {missingTypes.length > 0 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">Missing recommended sections:</p>
                <p className="text-xs text-amber-700 mt-1">
                  {missingTypes.map(t => sectionConfig[t].label).join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sections List */}
      <div className="divide-y divide-slate-100">
        {sections.map((section, index) => {
          const config = sectionConfig[section.type]
          const Icon = config.icon
          const isExpanded = expandedSections.has(section.id)
          const isSelected = selectedSection === section.id

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${isSelected ? "bg-slate-50" : ""}`}
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.id)}
                className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400 uppercase">{config.label}</span>
                  </div>
                  <h4 className="font-medium text-slate-900 truncate">{section.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <ScoreIndicator score={section.score} />
                  {section.suggestions.length > 0 && (
                    <span className="text-xs text-slate-400">
                      {section.suggestions.length} suggestion{section.suggestions.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 space-y-4">
                      {/* Content Preview */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                          {section.content}
                        </p>
                      </div>

                      {/* Suggestions */}
                      {section.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium text-slate-500">Suggestions</span>
                          {section.suggestions.map((suggestion, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                              <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-700">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.suggestions.length === 0 && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          <p className="text-sm text-emerald-700">This section looks great!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <div className="p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-slate-700 mb-2">No Sections Detected</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Once you analyze your proposal, we'll automatically detect and evaluate each section.
          </p>
        </div>
      )}
    </div>
  )
}
