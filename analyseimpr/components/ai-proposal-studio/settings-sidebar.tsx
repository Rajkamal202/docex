"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export type IndustryType = "general" | "saas" | "consulting" | "legal" | "government" | "sales" | "healthcare"

interface SettingsSidebarProps {
  selectedTone: "formal" | "persuasive" | "executive"
  onToneChange: (tone: "formal" | "persuasive" | "executive") => void
  selectedIndustry: IndustryType
  onIndustryChange: (industry: IndustryType) => void
  optimizationGoals: {
    clarity: boolean
    persuasion: boolean
    readability: boolean
    legalRisk: boolean
  }
  onToggleGoal: (goal: keyof SettingsSidebarProps["optimizationGoals"]) => void
  onAnalyze: () => void
  isAnalyzing: boolean
  hasContent: boolean
  currentStep: string
  onShowHistory?: () => void
  historyCount?: number
}

const industryOptions = [
  { value: "general", label: "General", desc: "Universal standards" },
  { value: "saas", label: "SaaS / Tech", desc: "Product-focused" },
  { value: "consulting", label: "Consulting", desc: "Service delivery" },
  { value: "legal", label: "Legal", desc: "Compliance focus" },
  { value: "government", label: "Government RFP", desc: "Formal structure" },
  { value: "sales", label: "Sales", desc: "Conversion focused" },
  { value: "healthcare", label: "Healthcare", desc: "Regulatory aware" },
]

const toneOptions = [
  { value: "formal", label: "Formal", desc: "Professional tone" },
  { value: "persuasive", label: "Persuasive", desc: "Action-oriented" },
  { value: "executive", label: "Executive", desc: "Concise & direct" },
]

const goalOptions = [
  { id: "clarity", label: "Clarity", desc: "Simplify language", color: "blue" },
  { id: "persuasion", label: "Persuasion", desc: "Strengthen impact", color: "green" },
  { id: "readability", label: "Readability", desc: "Improve flow", color: "orange" },
  { id: "legalRisk", label: "Legal Review", desc: "Flag risks", color: "red" },
]

function getGoalColors(color: string, isChecked: boolean) {
  const colors = {
    blue: { bg: "bg-blue-500", border: "border-blue-500", check: "border-white", checkBg: "bg-blue-500", text: "text-white" },
    green: { bg: "bg-green-500", border: "border-green-500", check: "border-white", checkBg: "bg-green-500", text: "text-white" },
    orange: { bg: "bg-orange-500", border: "border-orange-500", check: "border-white", checkBg: "bg-orange-500", text: "text-white" },
    red: { bg: "bg-red-500", border: "border-red-500", check: "border-white", checkBg: "bg-red-500", text: "text-white" },
  };

  return isChecked ? colors[color] : { bg: "bg-white", border: "border-slate-200", check: "border-slate-200", checkBg: "bg-white", text: "text-slate-700" };
}

export function SettingsSidebar({
  selectedTone,
  onToneChange,
  selectedIndustry,
  onIndustryChange,
  optimizationGoals,
  onToggleGoal,
  onAnalyze,
  isAnalyzing,
  hasContent,
  currentStep,
  onShowHistory,
  historyCount = 0,
}: SettingsSidebarProps) {
  const isDisabled = !hasContent || isAnalyzing || currentStep !== "input"
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false)

  const selectedIndustryOption = industryOptions.find(i => i.value === selectedIndustry) || industryOptions[0]

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
        <h3 className="text-sm font-medium text-slate-900">Analysis Settings</h3>
        {onShowHistory && historyCount > 0 && (
          <button
            onClick={onShowHistory}
            className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            History ({historyCount})
          </button>
        )}
      </div>

      {/* Industry Selection */}
      <div className="mb-5">
        <label className="text-xs font-medium text-slate-500 mb-2.5 block">Industry Template</label>
        <div className="relative">
          <button
            onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
            className="w-full flex items-center justify-between py-2.5 px-3 text-sm rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col items-start">
              <span className="font-medium text-slate-900">{selectedIndustryOption.label}</span>
              <span className="text-xs text-slate-400">{selectedIndustryOption.desc}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showIndustryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 max-h-64 overflow-y-auto">
              {industryOptions.map((industry) => (
                <button
                  key={industry.value}
                  onClick={() => {
                    onIndustryChange(industry.value as IndustryType)
                    setShowIndustryDropdown(false)
                  }}
                  className={`w-full flex items-center justify-between py-2 px-3 text-sm hover:bg-slate-50 transition-colors ${
                    selectedIndustry === industry.value ? 'bg-slate-50' : ''
                  }`}
                >
                  <span className="font-medium text-slate-700">{industry.label}</span>
                  <span className="text-xs text-slate-400">{industry.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="mb-5">
        <label className="text-xs font-medium text-slate-500 mb-2.5 block">Tone</label>
        <div className="space-y-1.5">
          {toneOptions.map((tone) => {
            const isSelected = selectedTone === tone.value
            return (
              <button
                key={tone.value}
                onClick={() => onToneChange(tone.value as typeof selectedTone)}
                className={`w-full flex items-center justify-between py-2.5 px-3 text-sm rounded-lg border transition-all ${
                  isSelected 
                    ? "border-slate-900 bg-slate-900 text-white" 
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                <span className="font-medium">{tone.label}</span>
                <span className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-400"}`}>{tone.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Goals */}
      <div className="mb-5">
        <label className="text-xs font-medium text-slate-500 mb-2.5 block">Focus Areas</label>
        <div className="space-y-1.5">
          {goalOptions.map((goal) => {
            const isChecked = optimizationGoals[goal.id as keyof typeof optimizationGoals]
            return (
              <button
                key={goal.id}
                onClick={() => onToggleGoal(goal.id as keyof typeof optimizationGoals)}
                className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg border transition-all text-left ${
                  isChecked 
                    ? "border-slate-300 bg-slate-50" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all flex-shrink-0 ${
                  isChecked 
                    ? "border-slate-900 bg-slate-900" 
                    : "border-slate-300"
                }`}>
                  {isChecked && (
                    <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm ${isChecked ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                    {goal.label}
                  </span>
                  <span className="text-xs text-slate-400">{goal.desc}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={onAnalyze}
        disabled={isDisabled}
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Proposal"}
      </button>
      
      {!hasContent && (
        <p className="text-[11px] text-slate-400 text-center mt-2.5">
          Add content to enable
        </p>
      )}
    </div>
  )
}
