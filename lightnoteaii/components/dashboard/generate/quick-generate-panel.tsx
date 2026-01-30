"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Check, ClipboardPaste, FileText, Loader2, Target, Wand2, Zap, Building2, Sparkles } from "lucide-react"
import type { ExtractedFields } from "@/app/(dashboard)/dashboard/generate/types"

interface QuickGeneratePanelProps {
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
  isExtracting: boolean
  onExtract: () => void
  showExtractedReview: boolean
  extractedFields: ExtractedFields | null
  onExtractedFieldsChange: (next: ExtractedFields | null) => void
  onApplyExtracted: () => void
  onBackToPaste: () => void
}

export function QuickGeneratePanel({
  jobDescription,
  onJobDescriptionChange,
  isExtracting,
  onExtract,
  showExtractedReview,
  extractedFields,
  onExtractedFieldsChange,
  onApplyExtracted,
  onBackToPaste,
}: QuickGeneratePanelProps) {
  if (showExtractedReview) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white overflow-y-auto">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Review Extracted Details</h3>
                  <p className="text-sm text-gray-500">Verify and edit before generating</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <div className="w-5 h-5 rounded bg-violet-50 flex items-center justify-center">
                      <FileText className="h-3 w-3 text-violet-600" />
                    </div>
                    Proposal Type
                  </label>
                  <Input
                    value={extractedFields?.proposalType || ""}
                    onChange={(e) =>
                      onExtractedFieldsChange(
                        extractedFields ? { ...extractedFields, proposalType: e.target.value } : null,
                      )
                    }
                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                    <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                      <Building2 className="h-3 w-3 text-blue-600" />
                    </div>
                    Client Company
                  </label>
                  <Input
                    value={extractedFields?.clientCompany || ""}
                    onChange={(e) =>
                      onExtractedFieldsChange(
                        extractedFields ? { ...extractedFields, clientCompany: e.target.value } : null,
                      )
                    }
                    placeholder="Enter client name"
                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                  <div className="w-5 h-5 rounded bg-amber-50 flex items-center justify-center">
                    <Target className="h-3 w-3 text-amber-600" />
                  </div>
                  Problem / Need
                </label>
                <Textarea
                  value={extractedFields?.problem || ""}
                  onChange={(e) =>
                    onExtractedFieldsChange(extractedFields ? { ...extractedFields, problem: e.target.value } : null)
                  }
                  className="min-h-[120px] bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/60">
              <Button variant="outline" onClick={onBackToPaste}>
                Back
              </Button>
              <Button
                onClick={onApplyExtracted}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                Generate Proposal
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-2xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative inline-flex items-center justify-center mb-5">
            <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 blur-xl opacity-40 animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Quick Generate</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            Paste any job description and let AI instantly extract details to create your proposal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
          <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-50 group-focus-within:opacity-70 transition-opacity duration-500" />

          <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
                  <ClipboardPaste className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Paste Job Description</span>
                  <p className="text-xs text-gray-500">From any job board, email, or document</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-[10px] font-medium px-2 py-0.5">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>

            <div className="p-4">
              <Textarea
                value={jobDescription}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                placeholder={`Paste the full job posting or project brief here...\n\nExample:\n\"We are looking for a skilled web developer to redesign our e-commerce platform. The project involves creating a modern, mobile-responsive design with improved checkout flow.\n\nCompany: TechStart Inc.\nBudget: $15,000 - $20,000\nTimeline: 6-8 weeks\nRequirements: React, Node.js, responsive design\n\nPlease include your portfolio and estimated timeline in your proposal.\"`}
                className="min-h-[220px] bg-gray-50/50 border-0 text-gray-900 placeholder:text-gray-400 resize-none focus:ring-0 focus:bg-white transition-colors text-sm leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 -rotate-90">
                      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-200" />
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={75.4}
                        strokeDashoffset={75.4 - (Math.min(jobDescription.length, 50) / 50) * 75.4}
                        className={jobDescription.length >= 50 ? "text-emerald-500" : "text-amber-500"}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-gray-600">
                      {Math.min(Math.round((jobDescription.length / 50) * 100), 100)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {jobDescription.length < 50 ? (
                      <span className="text-amber-600">Need {50 - jobDescription.length} more chars</span>
                    ) : (
                      <span className="text-emerald-600">Ready to extract</span>
                    )}
                  </span>
                </div>
              </div>

              <Button
                onClick={onExtract}
                disabled={jobDescription.length < 50 || isExtracting}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Extract & Review
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
