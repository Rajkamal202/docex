"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Info, Target, Clock, Lightbulb } from "lucide-react"
import {
  ProfessionalTemplate,
  ModernTemplate,
  CreativeTemplate,
  ClassicTemplate,
  BusinessTemplate,
  ProjectTemplate,
  StartupTemplate,
  MarketingTemplate,
  TechnicalTemplate,
  ConsultingTemplate,
  ExecutiveTemplate,
  MinimalTemplate,
  AgencyTemplate,
  EnterpriseTemplate,
  FinancialTemplate,
  PartnershipTemplate,
} from "@/components/dashboard/templates"

// Sample data for template previews
const sampleInfo = {
  proposalType: "Business Proposal",
  template: "professional",
  companyName: "Acme Corp",
  clientCompany: "Client Inc",
  clientName: "John Smith",
  clientEmail: "john@client.com",
  industry: "Technology",
  problem: "Streamline operations and improve efficiency across departments.",
  problemStatement: "Streamline operations and improve efficiency across departments.",
  deliverables: "Strategy document, Implementation plan, Training materials",
  timeline: "8 weeks",
  budget: "$25,000",
  tone: "Professional",
  solution: "Implement an integrated platform with automation capabilities.",
  uniqueValue: "10+ years of industry experience with proven results.",
  logo: "",
  images: [],
}

const sampleBranding = {
  primaryColor: "#3B82F6",
  fontFamily: "Inter",
  companyName: "Acme Corp",
}

const sampleSections = {
  executiveSummary: "A comprehensive solution designed to transform your business operations.",
  problemStatement: "Current challenges include manual processes and data silos.",
  proposedSolution: "Our platform offers end-to-end integration and real-time analytics.",
  methodology: "Agile implementation with weekly sprints and continuous feedback.",
  timeline: "Phase 1: Discovery (2 weeks), Phase 2: Development (6 weeks), Phase 3: Launch (2 weeks)",
  pricing: "Starting at $25,000 for the complete implementation package.",
  team: "Dedicated project manager, 2 senior developers, 1 UX designer.",
  caseStudies: "Successfully delivered similar solutions for Fortune 500 companies.",
  terms: "Standard terms apply with 30-day payment terms.",
}

const currentDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

interface TemplateObject {
  id: string
  name: string
  description: string
  color: string
  bestFor?: string
  whenToUse?: string
  whyChoose?: string
}

interface TemplatePreviewCardProps {
  template?: TemplateObject
  templateId?: string
  templateName?: string
  description?: string
  color?: string
  bestFor?: string
  whenToUse?: string
  whyChoose?: string
  isSelected?: boolean
  isRecommended?: boolean
  onClick?: () => void
  size?: "small" | "medium" | "large" | "sm" | "md" | "lg"
}

export function TemplatePreviewCard({
  template,
  templateId = template?.id || "professional",
  templateName = template?.name || "Professional",
  description = template?.description || "Clean and corporate look",
  color = template?.color || "#2563eb",
  bestFor = template?.bestFor || "",
  whenToUse = template?.whenToUse || "",
  whyChoose = template?.whyChoose || "",
  isSelected = false,
  isRecommended = false,
  onClick,
  size = "medium",
}: TemplatePreviewCardProps) {
  const [showGuidance, setShowGuidance] = useState(false)

  const sizeConfig = {
    small: { height: "h-[180px]", scale: 0.18, infoHeight: "min-h-[60px]" },
    sm: { height: "h-[180px]", scale: 0.18, infoHeight: "min-h-[60px]" },
    medium: { height: "h-[280px]", scale: 0.22, infoHeight: "min-h-[80px]" },
    md: { height: "h-[280px]", scale: 0.22, infoHeight: "min-h-[80px]" },
    large: { height: "h-[340px]", scale: 0.28, infoHeight: "min-h-[100px]" },
    lg: { height: "h-[340px]", scale: 0.28, infoHeight: "min-h-[100px]" },
  }

  const config = sizeConfig[size] || sizeConfig.medium

  const renderTemplatePreview = () => {
    const templateProps = {
      safeInfo: sampleInfo,
      safeBranding: sampleBranding,
      sections: sampleSections,
      currentDate,
      isFullPreview: false,
    }

    switch (templateId) {
      case "professional":
        return <ProfessionalTemplate {...templateProps} />
      case "modern":
        return <ModernTemplate {...templateProps} />
      case "creative":
        return <CreativeTemplate {...templateProps} />
      case "classic":
        return <ClassicTemplate {...templateProps} />
      case "business":
        return <BusinessTemplate {...templateProps} />
      case "project":
        return <ProjectTemplate {...templateProps} />
      case "startup":
        return <StartupTemplate {...templateProps} />
      case "marketing":
        return <MarketingTemplate {...templateProps} />
      case "technical":
        return <TechnicalTemplate {...templateProps} />
      case "consulting":
        return <ConsultingTemplate {...templateProps} />
      case "executive":
        return <ExecutiveTemplate {...templateProps} />
      case "minimal":
        return <MinimalTemplate {...templateProps} />
      case "agency":
        return <AgencyTemplate {...templateProps} />
      case "enterprise":
        return <EnterpriseTemplate {...templateProps} />
      case "financial":
        return <FinancialTemplate {...templateProps} />
      case "partnership":
        return <PartnershipTemplate {...templateProps} />
      default:
        return <ProfessionalTemplate {...templateProps} />
    }
  }

  const hasGuidance = bestFor || whenToUse || whyChoose

  return (
    <div className="relative">
      <Card
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-200 group
          ${isSelected ? "ring-2 ring-violet-500 ring-offset-2 shadow-lg" : "hover:shadow-md hover:scale-[1.02]"}
          ${isRecommended && !isSelected ? "ring-1 ring-blue-200" : ""}
        `}
        onClick={onClick}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute top-2 left-2 z-20">
            <Badge className="bg-blue-500 text-white text-[10px] px-2 py-0.5 font-medium shadow-sm">Recommended</Badge>
          </div>
        )}

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-20 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Info Button */}
        {hasGuidance && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowGuidance(!showGuidance)
            }}
            className={`absolute top-2 ${isSelected ? "right-10" : "right-2"} z-20 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors border border-gray-200`}
          >
            <Info className="w-3.5 h-3.5 text-gray-600" />
          </button>
        )}

        {/* Template Preview */}
        <div className={`${config.height} overflow-hidden bg-gray-50 relative`}>
          <div
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `scale(${config.scale})`,
              width: `${100 / config.scale}%`,
              height: `${100 / config.scale}%`,
            }}
          >
            {renderTemplatePreview()}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

          {/* Color Indicator on Hover */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1.5 transform translate-y-full group-hover:translate-y-0 transition-transform"
            style={{ backgroundColor: color }}
          />
        </div>

        {/* Info Section */}
        <div className={`p-4 ${config.infoHeight} bg-white border-t border-gray-100`}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{templateName}</h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>
            </div>
            <div
              className="w-4 h-4 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      </Card>

      {/* Guidance Panel - Shows when info button is clicked */}
      {showGuidance && hasGuidance && (
        <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-xl border border-gray-200 shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            {bestFor && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-900">Best for</span>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{bestFor}</p>
                </div>
              </div>
            )}

            {whenToUse && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-900">When to use</span>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{whenToUse}</p>
                </div>
              </div>
            )}

            {whyChoose && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-900">Why choose this</span>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{whyChoose}</p>
                </div>
              </div>
            )}
          </div>

          {/* Close hint */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowGuidance(false)
            }}
            className="mt-3 w-full text-center text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Click to close
          </button>
        </div>
      )}
    </div>
  )
}
