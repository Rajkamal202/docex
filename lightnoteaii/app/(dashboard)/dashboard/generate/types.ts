import type { LucideIcon } from "lucide-react"

export interface ChatMessage {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: Date
  options?: string[]
  inputType?: "text" | "textarea" | "select" | "budget" | "timeline" | "options" | "generate" | "clarification"
  field?: string
  isTemplateSelection?: boolean
  whyAsking?: string
  suggestions?: string[]
  clarificationQuestions?: Array<{ question: string; reason: string; field: string }>
  multiSelect?: boolean
}

export interface CollectedInfo {
  proposalType?: string
  template?: string
  clientCompany?: string
  clientIndustry?: string
  problem?: string
  solution?: string
  budget?: string
  timeline?: string
  proposalPages?: number
  tone?: string
  deliverables?: string
  additionalContext?: string
  clarificationAnswers?: Record<string, string>
  clientName?: string
  goals?: string
  uniqueValue?: string
  companyName?: string
  yourEmail?: string
  yourWebsite?: string
  yourPhone?: string
  clientEmail?: string
  preparedBy?: string
  preparedByEmail?: string
  industry?: string
  websitePages?: string
  websiteFeatures?: string[]
  primaryAction?: string
  website_features?: string[]
  primary_action?: string
  website_pages?: string
}

export interface ExtractedFields {
  proposalType?: string
  clientCompany?: string
  clientIndustry?: string
  problem?: string
  solution?: string
  budget?: string
  timeline?: string
  tone?: string
  goal?: string
  confidence: {
    proposalType: number
    clientCompany: number
    problem: number
    budget: number
    timeline: number
  }
}

export interface AuditResult {
  score: number
  verdict: string
  weaknesses: Array<{ section: string; issue: string }>
  lockedPreview?: Array<{ section: string; teaser: string }>
  hasMoreFeedback: boolean
}

export interface ConversationStep {
  id: string
  label: string
  icon: LucideIcon
  question: string
  condition?: (info: CollectedInfo) => boolean
  multiSelect?: boolean
}
