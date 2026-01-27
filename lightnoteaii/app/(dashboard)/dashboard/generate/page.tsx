"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { ProposalPreview } from "@/components/dashboard/proposal-preview"
import { KeyboardShortcutsDialog } from "@/components/dashboard/keyboard-shortcuts-dialog"
import { VersionHistoryDialog } from "@/components/dashboard/version-history-dialog"
import { ImportUrlDialog } from "@/components/dashboard/import-url-dialog"
import { DuplicateProposalDialog } from "@/components/dashboard/duplicate-proposal-dialog"
import { AddCreditsModal } from "@/components/dashboard/add-credits-modal"
import { useAutosave } from "@/hooks/use-autosave"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useCredits } from "@/lib/credit-store"
import { useProposals, type ProposalIndustry, type ProposalStatus } from "@/lib/proposal-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Loader2,
  FileText,
  DollarSign,
  Clock,
  Building2,
  Target,
  Palette,
  Save,
  History,
  Keyboard,
  PanelRightClose,
  PanelRight,
  RotateCcw,
  LayoutTemplate,
  Send,
  Zap,
  MessageSquare,
  ClipboardPaste,
  ArrowRight,
  Check,
  Wand2,
  Lightbulb,
  Star,
  Download,
  FileDown,
  AlertCircle,
  Mail,
  Calendar,
  ImageIcon,
  MapPin,
  Phone,
  Share2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { TemplatePreviewCard } from "@/components/dashboard/template-preview-card"

interface ChatMessage {
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
}

interface CollectedInfo {
  proposalType?: string
  template?: string
  clientCompany?: string
  clientIndustry?: string
  problem?: string
  solution?: string
  budget?: string
  timeline?: string
  tone?: string
  deliverables?: string
  additionalContext?: string
  // Add clarification answers to collectedInfo
  clarificationAnswers?: Record<string, string>
  // Add fields for quick generate mode
  clientName?: string
  goals?: string // Renamed from goal to goals for clarity
  uniqueValue?: string
  // Branding info for editor
  companyName?: string
  yourEmail?: string
  yourWebsite?: string
  yourPhone?: string
  clientEmail?: string // Add clientEmail to collectedInfo
  // For preview component
  preparedBy?: string
  preparedByEmail?: string
  industry?: string // Added industry to collectedInfo for clarity
  // Website specific fields
  websitePages?: string
  websiteFeatures?: string[]
  primaryAction?: string
  // Temporary for website features multi-select
  website_features?: string[]
  primary_action?: string
  website_pages?: string
}

interface ExtractedFields {
  proposalType?: string
  clientCompany?: string
  clientIndustry?: string
  problem?: string
  solution?: string
  budget?: string
  timeline?: string
  tone?: string
  goal?: string // Added goal to ExtractedFields
  confidence: {
    proposalType: number
    clientCompany: number
    problem: number
    budget: number
    timeline: number
  }
}

interface AuditResult {
  score: number
  verdict: string
  weaknesses: Array<{ section: string; issue: string }>
  lockedPreview?: Array<{ section: string; teaser: string }>
  hasMoreFeedback: boolean
}

const formatProposalToContent = (proposal: any): string => {
  if (!proposal) return ""

  let content = ""

  if (proposal.title) {
    content += `## TITLE\n${proposal.title}\n\n`
  }
  if (proposal.summary) {
    content += `## EXECUTIVE SUMMARY\n${proposal.summary}\n\n`
  }
  if (proposal.problemStatement) {
    content += `## PROBLEM STATEMENT\n${proposal.problemStatement}\n\n`
  }
  if (proposal.solution) {
    content += `## PROPOSED SOLUTION\n${proposal.solution}\n\n`
  }
  if (proposal.deliverables) {
    const deliverablesList = Array.isArray(proposal.deliverables)
      ? proposal.deliverables.join("\n- ")
      : proposal.deliverables
    content += `## DELIVERABLES\n- ${deliverablesList}\n\n`
  }
  if (proposal.marketOpportunity) {
    content += `## VALUE PROPOSITION\n${proposal.marketOpportunity}\n\n`
  }
  if (proposal.timeline) {
    content += `## TIMELINE\n${proposal.timeline}\n\n`
  }
  if (proposal.investment) {
    content += `## INVESTMENT\n${proposal.investment}\n\n`
  }
  if (proposal.financialSummary) {
    content += `## FINANCIAL SUMMARY\n${proposal.financialSummary}\n\n`
  }
  if (proposal.whyUs) {
    content += `## WHY CHOOSE US\n${proposal.whyUs}\n\n`
  }
  if (proposal.nextSteps) {
    const stepsList = Array.isArray(proposal.nextSteps) ? proposal.nextSteps.join("\n- ") : proposal.nextSteps
    content += `## NEXT STEPS\n- ${stepsList}\n\n`
  }

  return content.trim()
}

const proposalTypes = [
  "Sales Proposal",
  "Service Proposal",
  "Freelance Proposal",
  "Consulting Proposal",
  "Software Development Proposal",
  "Marketing Proposal",
  "Partnership Proposal",
  "RFP Response",
  "Website Design Proposal", // Added for website proposals
  "Mobile App Proposal", // Added for mobile app proposals
]

const industryOptions = [
  { id: "saas", label: "SaaS / Software", icon: "💻" },
  { id: "ecommerce", label: "E-commerce / Retail", icon: "🛒" },
  { id: "healthcare", label: "Healthcare / Medical", icon: "🏥" },
  { id: "finance", label: "Finance / Fintech", icon: "💰" },
  { id: "education", label: "Education / EdTech", icon: "🎓" },
  { id: "realestate", label: "Real Estate", icon: "🏠" },
  { id: "hospitality", label: "Restaurant / Hospitality", icon: "🍽️" },
  { id: "agency", label: "Agency / Creative", icon: "🎨" },
  { id: "consulting", label: "Consulting / Professional Services", icon: "💼" },
  { id: "manufacturing", label: "Manufacturing / Industrial", icon: "🏭" },
  { id: "nonprofit", label: "Non-profit / NGO", icon: "🤝" },
  { id: "other", label: "Other", icon: "📦" },
]

const businessGoalOptions = [
  { id: "increase_revenue", label: "Increase Revenue", description: "Drive more sales or higher-value transactions" },
  { id: "reduce_costs", label: "Reduce Costs", description: "Cut operational expenses or inefficiencies" },
  { id: "save_time", label: "Save Time", description: "Automate or streamline manual processes" },
  { id: "acquire_customers", label: "Acquire Customers", description: "Attract new leads or expand market reach" },
  { id: "retain_customers", label: "Retain Customers", description: "Improve loyalty, reduce churn" },
  { id: "improve_brand", label: "Improve Brand", description: "Strengthen market positioning or reputation" },
  { id: "launch_product", label: "Launch Product/Service", description: "Bring something new to market" },
  { id: "scale_operations", label: "Scale Operations", description: "Handle growth without breaking" },
  { id: "compliance", label: "Compliance / Security", description: "Meet regulatory or security requirements" },
]

const websitePageOptions = [
  { label: "4-5 pages (Standard)", description: "Home, About, Services, Contact" },
  { label: "6-8 pages (Comprehensive)", description: "Adds menu/portfolio, testimonials, FAQ" },
  { label: "10+ pages (Large)", description: "Multiple service pages, blog, resources" },
]

const websiteFeatureOptions = [
  { label: "Contact form", icon: Mail },
  { label: "Online booking/reservations", icon: Calendar },
  { label: "Menu/Price list display", icon: FileText },
  { label: "Photo gallery", icon: ImageIcon },
  { label: "Google Maps integration", icon: MapPin },
  { label: "Click-to-call button", icon: Phone },
  { label: "Social media links", icon: Share2 },
  { label: "Customer reviews display", icon: Star },
]

const primaryGoalOptions = [
  { label: "More phone calls", description: "Get customers to call you" },
  { label: "More reservations/bookings", description: "Fill your schedule" },
  { label: "More walk-in traffic", description: "Get people through the door" },
  { label: "More online inquiries", description: "Generate leads via contact form" },
]

const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and corporate look",
    color: "#2563eb",
    recommended: ["Sales Proposal", "Service Proposal", "Software Development Proposal", "RFP Response"],
    bestFor: "Client-facing business proposals, corporate services, formal engagements",
    whenToUse: "When you need a clean, credible, and traditional proposal layout that establishes trust",
    whyChoose: "Prioritizes clarity, structure, and professionalism. Works well for conservative industries.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design",
    color: "#7c3aed",
    recommended: ["Marketing Proposal", "Freelance Proposal"],
    bestFor: "Tech companies, digital agencies, forward-thinking startups",
    whenToUse: "When your client values innovation and you want to signal that you're up-to-date",
    whyChoose: "Clean lines and modern typography convey competence without being flashy.",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional business style",
    color: "#059669",
    recommended: ["Consulting Proposal", "Partnership Proposal"],
    bestFor: "Law firms, financial services, established enterprises",
    whenToUse: "When working with traditional industries or clients who prefer proven formats",
    whyChoose: "Timeless design that conveys stability and reliability.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and unique",
    color: "#ea580c",
    recommended: ["Marketing Proposal", "Freelance Proposal"],
    bestFor: "Design agencies, creative studios, brand projects",
    whenToUse: "When your proposal itself needs to demonstrate creative capability",
    whyChoose: "Makes a memorable impression. Best when creativity is part of your value proposition.",
  },
  {
    id: "business",
    name: "Business",
    description: "Formal enterprise style",
    color: "#0891b2",
    recommended: ["Consulting Proposal", "Partnership Proposal", "RFP Response"],
    bestFor: "B2B proposals, enterprise clients, procurement processes",
    whenToUse: "When dealing with formal purchasing departments or structured decision-making",
    whyChoose: "Comprehensive sections and formal tone satisfy compliance requirements.",
  },
  {
    id: "project",
    name: "Project",
    description: "Multi-page project proposal",
    color: "#be185d",
    recommended: ["Software Development Proposal", "Service Proposal"],
    bestFor: "Complex projects with multiple phases, technical implementations",
    whenToUse: "When you need to outline detailed deliverables, timelines, and milestones",
    whyChoose: "Built for clarity on scope. Helps prevent misunderstandings on complex work.",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern SaaS aesthetic",
    color: "#6366f1",
    recommended: ["Software Development Proposal", "Marketing Proposal", "Freelance Proposal"],
    bestFor: "Tech startups, SaaS companies, venture-backed businesses",
    whenToUse: "When pitching to other startups or tech-savvy clients",
    whyChoose: "Speaks the language of modern tech. Gradient accents and card layouts feel native.",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Metrics-focused design",
    color: "#f97316",
    recommended: ["Marketing Proposal", "Sales Proposal"],
    bestFor: "Marketing campaigns, growth initiatives, ROI-focused projects",
    whenToUse: "When results and metrics are the primary decision factors",
    whyChoose: "Built-in sections for KPIs and projected outcomes. Numbers stand out.",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Developer-focused theme",
    color: "#1e293b",
    recommended: ["Software Development Proposal", "RFP Response"],
    bestFor: "Engineering projects, API integrations, infrastructure work",
    whenToUse: "When your audience is technical and appreciates detail",
    whyChoose: "Monospace elements and dark theme signal technical competence.",
  },
  {
    id: "consulting",
    name: "Consulting",
    description: "Elegant serif typography",
    color: "#b45309",
    recommended: ["Consulting Proposal", "Service Proposal"],
    bestFor: "Strategy consulting, advisory services, high-touch engagements",
    whenToUse: "When positioning yourself as a trusted advisor rather than a vendor",
    whyChoose: "Serif fonts and refined spacing convey thoughtfulness and expertise.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "C-suite presentation style",
    color: "#334155",
    recommended: ["Sales Proposal", "Partnership Proposal", "RFP Response"],
    bestFor: "Board presentations, executive summaries, high-stakes deals",
    whenToUse: "When your proposal will be reviewed by senior leadership",
    whyChoose: "Concise format respects busy schedules. Key points are immediately visible.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra-clean whitespace",
    color: "#64748b",
    recommended: ["Freelance Proposal", "Service Proposal"],
    bestFor: "Design-conscious clients, boutique services, personal brands",
    whenToUse: "When you want the content to speak for itself without distraction",
    whyChoose: "Maximum readability. Nothing competes with your message.",
  },
  {
    id: "agency",
    name: "Agency",
    description: "Bold creative theme",
    color: "#ec4899",
    recommended: ["Marketing Proposal", "Freelance Proposal"],
    bestFor: "Full-service agencies, branding projects, campaign pitches",
    whenToUse: "When you're competing on creative vision and brand energy",
    whyChoose: "Dark backgrounds and bold colors create immediate visual impact.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Formal corporate template",
    color: "#1e40af",
    recommended: ["RFP Response", "Partnership Proposal", "Consulting Proposal"],
    bestFor: "Fortune 500 clients, government contracts, large-scale implementations",
    whenToUse: "When formality and comprehensive documentation are expected",
    whyChoose: "Covers all standard RFP requirements. Professional and thorough.",
  },
  {
    id: "financial",
    name: "Financial",
    description: "Investment-focused design",
    color: "#047857",
    recommended: ["Sales Proposal", "Partnership Proposal"],
    bestFor: "Investment proposals, financial services, budget-heavy decisions",
    whenToUse: "When cost breakdowns and ROI are central to the decision",
    whyChoose: "Structured pricing tables and financial projections look credible.",
  },
  {
    id: "partnership",
    name: "Partnership",
    description: "Dual-company branding",
    color: "#7c3aed",
    recommended: ["Partnership Proposal", "Consulting Proposal"],
    bestFor: "Joint ventures, strategic alliances, co-branded initiatives",
    whenToUse: "When both parties need equal representation in the proposal",
    whyChoose: "Side-by-side layouts emphasize collaboration over vendor relationships.",
  },
  {
    id: "website",
    name: "Website",
    description: "Modern web design proposal",
    color: "#4f46e5", // Indigo color
    recommended: ["Website Design Proposal", "Marketing Proposal"],
    bestFor: "Web design agencies, freelancers, and businesses offering web development services",
    whenToUse: "When pitching website design, redesign, or development projects.",
    whyChoose: "Highlights key website elements like pages, features, and primary calls to action.",
  },
]

const toneOptions = ["Professional", "Friendly", "Formal", "Persuasive", "Technical"]

const budgetRanges = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
  "To be discussed",
]

const timelineOptions = ["1-2 weeks", "2-4 weeks", "1-2 months", "2-3 months", "3-6 months", "6+ months", "Flexible"]

const questionConfig = {
  // Why we're asking explanations for each step
  whyAsking: {
    type: "Different proposal types have unique structures and language. This helps us tailor the content and sections appropriately.",
    template:
      "The right template sets the visual tone and organization of your proposal, making it more impactful for your audience.",
    client:
      "Understanding your client helps us personalize the proposal and use industry-appropriate language and examples.",
    problem:
      "A clear problem statement shows you understand the client's pain points - this is the foundation of a compelling proposal.",
    solution:
      "Your solution directly addresses the problem and showcases your expertise. This is where you demonstrate value.",
    budget:
      "Being upfront about investment builds trust and helps qualify the opportunity. It also helps scope the solution appropriately.",
    timeline:
      "Realistic timelines demonstrate professionalism and help clients plan resources. It sets clear expectations.",
    tone: "The right tone makes your proposal resonate with the reader - too formal can feel cold, too casual can seem unprofessional.",
    // New fields for industry and goal
    industry:
      "Understanding the industry helps us use relevant terminology and tailor examples to your client's specific context.",
    goal: "Knowing the primary goal ensures the proposal directly addresses the client's desired outcome and demonstrates measurable impact.",
    // Added explanation for yourInfo step
    yourInfo: "This information will be used to populate your contact details and company branding on the proposal.",
    // Website specific explanations
    websitePages:
      "The number of pages determines the overall scope and complexity of the website, impacting the price and delivery time.",
    websiteFeatures:
      "Key features are crucial for functionality and user experience. Selecting them helps define the project's requirements and cost.",
    primaryAction:
      "Defining the primary action ensures the website is optimized to convert visitors into leads or customers.",
  },

  // Recommendations per proposal type
  templateRecommendations: {
    "Sales Proposal": ["professional", "executive", "financial", "business"],
    "Service Proposal": ["professional", "consulting", "minimal", "project"],
    "Freelance Proposal": ["modern", "creative", "startup", "minimal", "agency"],
    "Consulting Proposal": ["consulting", "business", "classic", "enterprise"],
    "Software Development Proposal": ["technical", "startup", "project", "professional"],
    "Marketing Proposal": ["marketing", "creative", "agency", "modern"],
    "Partnership Proposal": ["partnership", "business", "executive", "financial", "classic"],
    "RFP Response": ["enterprise", "professional", "executive", "technical", "business"],
    "Website Design Proposal": ["website", "modern", "creative", "agency"],
    "Mobile App Proposal": ["website", "startup", "technical", "modern"],
  } as Record<string, string[]>,

  toneRecommendations: {
    "Sales Proposal": ["Persuasive", "Professional"],
    "Service Proposal": ["Professional", "Friendly"],
    "Freelance Proposal": ["Friendly", "Professional"],
    "Consulting Proposal": ["Professional", "Formal"],
    "Software Development Proposal": ["Technical", "Professional"],
    "Marketing Proposal": ["Persuasive", "Friendly"],
    "Partnership Proposal": ["Professional", "Formal"],
    "RFP Response": ["Formal", "Professional"],
  } as Record<string, string[]>,

  budgetRecommendations: {
    "Sales Proposal": ["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000"],
    "Service Proposal": ["$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000"],
    "Freelance Proposal": ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000"],
    "Consulting Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"],
    "Software Development Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"],
    "Marketing Proposal": ["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000"],
    "Partnership Proposal": ["To be discussed", "$25,000 - $50,000", "$50,000+"],
    "RFP Response": ["$25,000 - $50,000", "$50,000+", "To be discussed"],
    "Website Design Proposal": ["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000"],
    "Mobile App Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"],
  } as Record<string, string[]>,

  timelineRecommendations: {
    "Sales Proposal": ["2-4 weeks", "1-2 months"],
    "Service Proposal": ["1-2 months", "2-3 months"],
    "Freelance Proposal": ["1-2 weeks", "2-4 weeks"],
    "Consulting Proposal": ["2-3 months", "3-6 months"],
    "Software Development Proposal": ["2-3 months", "3-6 months", "6+ months"],
    "Marketing Proposal": ["1-2 months", "2-3 months", "3-6 months"],
    "Partnership Proposal": ["3-6 months", "6+ months"],
    "RFP Response": ["2-4 weeks", "1-2 months"],
    "Website Design Proposal": ["1-2 months", "2-3 months"],
    "Mobile App Proposal": ["3-6 months", "6+ months"],
  } as Record<string, string[]>,

  // Problem suggestions per proposal type
  problemSuggestions: {
    "Sales Proposal": [
      "Need to increase revenue and market share",
      "Looking to upgrade current solution",
      "Seeking cost reduction opportunities",
    ],
    "Service Proposal": [
      "Require ongoing support and maintenance",
      "Need specialized expertise for project",
      "Looking for reliable service partner",
    ],
    "Freelance Proposal": [
      "Need quick turnaround on deliverables",
      "Looking for specialized skills",
      "Current team lacks bandwidth",
    ],
    "Consulting Proposal": [
      "Need strategic guidance for growth",
      "Facing operational challenges",
      "Seeking market expansion advice",
    ],
    "Software Development Proposal": [
      "Legacy system needs modernization",
      "Need custom software solution",
      "Current platform doesn't scale",
      "Manual processes need automation",
    ],
    "Marketing Proposal": [
      "Low brand awareness",
      "Need to increase lead generation",
      "Poor social media engagement",
      "Website traffic has plateaued",
    ],
    "Partnership Proposal": [
      "Seeking strategic alliance",
      "Looking to expand market reach",
      "Need complementary capabilities",
    ],
    "RFP Response": [
      "Meeting specific RFP requirements",
      "Addressing compliance needs",
      "Demonstrating technical capability",
    ],
    "Website Design Proposal": [
      "Outdated website design",
      "Low website conversion rates",
      "Poor mobile user experience",
      "Need for better SEO performance",
    ],
    "Mobile App Proposal": [
      "Lack of mobile presence",
      "Need to improve customer engagement",
      "Desire for a new revenue stream",
      "Inefficient manual processes",
    ],
  } as Record<string, string[]>,

  // Solution suggestions per proposal type
  solutionSuggestions: {
    "Sales Proposal": [
      "Comprehensive product/service package",
      "Customized solution with training",
      "Scalable implementation with support",
    ],
    "Service Proposal": ["Dedicated support team", "SLA-backed service agreement", "Proactive maintenance program"],
    "Freelance Proposal": ["Flexible engagement model", "Milestone-based delivery", "Direct collaboration approach"],
    "Consulting Proposal": [
      "Strategic assessment and roadmap",
      "Hands-on implementation support",
      "Knowledge transfer and training",
    ],
    "Software Development Proposal": [
      "Custom application development",
      "Agile development methodology",
      "Full-stack solution with maintenance",
      "API integration and automation",
    ],
    "Marketing Proposal": [
      "Multi-channel marketing campaign",
      "Content strategy and execution",
      "Performance marketing with analytics",
      "Brand refresh and positioning",
    ],
    "Partnership Proposal": ["Revenue sharing model", "Joint go-to-market strategy", "Co-development agreement"],
    "RFP Response": ["Compliant technical solution", "Proven implementation approach", "Risk mitigation strategy"],
    "Website Design Proposal": [
      "Modern, responsive website design",
      "User-friendly interface and navigation",
      "SEO optimization and performance enhancements",
      "Content Management System (CMS) integration",
    ],
    "Mobile App Proposal": [
      "Native iOS and Android app development",
      "Cross-platform app development",
      "User interface (UI) and user experience (UX) design",
      "Backend development and API integration",
    ],
  } as Record<string, string[]>,

  // Recommendations per industry
  templateRecommendationsByIndustry: {
    saas: ["modern", "startup", "technical", "professional"],
    ecommerce: ["professional", "modern", "marketing", "sales"],
    healthcare: ["professional", "classic", "business"],
    finance: ["financial", "professional", "executive", "business"],
    education: ["professional", "modern", "education"], // Assuming an 'education' template might exist
    realestate: ["professional", "executive", "marketing"],
    hospitality: ["professional", "modern", "creative"],
    agency: ["creative", "agency", "modern", "marketing"],
    consulting: ["consulting", "professional", "business"],
    manufacturing: ["professional", "business", "technical", "enterprise"],
    nonprofit: ["professional", "creative", "partnership"],
    other: ["professional", "modern"],
  } as Record<string, string[]>,

  // Recommendations per business goal
  templateRecommendationsByGoal: {
    increase_revenue: ["sales", "marketing", "financial", "executive"],
    reduce_costs: ["business", "consulting", "enterprise", "financial"],
    save_time: ["startup", "modern", "technical"],
    acquire_customers: ["marketing", "sales", "agency", "creative"],
    retain_customers: ["service", "professional", "consulting"],
    improve_brand: ["marketing", "creative", "agency", "modern"],
    launch_product: ["startup", "marketing", "creative", "project"],
    scale_operations: ["startup", "enterprise", "technical", "business"],
    compliance: ["enterprise", "technical", "business", "rfp"],
  } as Record<string, string[]>,

  // Suggestions for industry
  industrySuggestions: industryOptions.map((opt) => opt.label),

  // Suggestions for goals
  goalSuggestions: businessGoalOptions.map((opt) => opt.label),
}

const conversationSteps = [
  { id: "type", label: "Type", icon: FileText, question: "What type of proposal would you like to create?" },
  { id: "industry", label: "Industry", icon: Building2, question: "What industry is your client in?" },
  { id: "goal", label: "Goal", icon: Target, question: "What's the primary business goal for this project?" },
  {
    id: "websitePages",
    label: "Pages",
    icon: LayoutTemplate,
    question: "How many pages should the website include?",
    condition: (info: CollectedInfo) =>
      info.proposalType?.toLowerCase().includes("website") ||
      info.industry?.toLowerCase().includes("restaurant") ||
      info.industry?.toLowerCase().includes("hospitality") ||
      info.clientIndustry?.toLowerCase().includes("restaurant") ||
      info.clientIndustry?.toLowerCase().includes("hospitality"),
  },
  {
    id: "websiteFeatures",
    label: "Features",
    icon: Sparkles,
    question: "Which features does the client need? (Select all that apply)",
    multiSelect: true,
    condition: (info: CollectedInfo) =>
      info.proposalType?.toLowerCase().includes("website") ||
      info.industry?.toLowerCase().includes("restaurant") ||
      info.industry?.toLowerCase().includes("hospitality") ||
      info.clientIndustry?.toLowerCase().includes("restaurant") ||
      info.clientIndustry?.toLowerCase().includes("hospitality"),
  },
  {
    id: "primaryAction",
    label: "Action",
    icon: Target,
    question: "What's the #1 action visitors should take on this website?",
    condition: (info: CollectedInfo) =>
      info.proposalType?.toLowerCase().includes("website") ||
      info.industry?.toLowerCase().includes("restaurant") ||
      info.industry?.toLowerCase().includes("hospitality") ||
      info.clientIndustry?.toLowerCase().includes("restaurant") ||
      info.clientIndustry?.toLowerCase().includes("hospitality"),
  },
  { id: "template", label: "Template", icon: LayoutTemplate, question: "Choose a template style for your proposal." },
  { id: "client", label: "Client", icon: Building2, question: "Who is this proposal for? Tell me about the client." },
  {
    id: "yourInfo",
    label: "Your Info",
    icon: User,
    question: "What's your name and company name? (This will appear on the proposal)",
  },
  {
    id: "problem",
    label: "Problem",
    icon: AlertCircle, // Changed icon to AlertCircle for problem statement
    question: "Describe the specific challenge or pain point the client is facing.",
  },
  {
    id: "solution",
    label: "Solution",
    icon: Sparkles,
    question: "What's your proposed solution? Be specific about your approach.",
  },
  { id: "budget", label: "Budget", icon: DollarSign, question: "What's the budget range for this project?" },
  { id: "timeline", label: "Timeline", icon: Clock, question: "What's the expected timeline?" },
  { id: "tone", label: "Tone", icon: Palette, question: "What tone should the proposal have?" },
  { id: "generate", label: "Generate", icon: Sparkles, question: "Ready to generate your proposal!" },
]

export default function GenerateProposalPage() {
  const { addProposal, updateProposal, proposals, isLoading: proposalsLoading } = useProposals()
  const { balance, deductCredit, isCreditExhausted, getFeatureCost } = useCredits()
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeTab, setActiveTab] = useState<"preview" | "templates" | "tools">("templates")
  const [collectedInfo, setCollectedInfo] = useState<CollectedInfo>({})
  const [generatedContent, setGeneratedContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false)
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [isAuditing, setIsAuditing] = useState(false)
  const [previousContent, setPreviousContent] = useState<string>("")

  // State to store the full AI-generated proposal object
  const [aiProposal, setAiProposal] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false) // For editing generated content

  const [generationMode, setGenerationMode] = useState<"guided" | "quick">("guided")
  const [jobDescription, setJobDescription] = useState("")
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedFields, setExtractedFields] = useState<ExtractedFields | null>(null)
  const [showExtractedReview, setShowExtractedReview] = useState(false)

  // Dialogs
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showImportUrl, setShowImportUrl] = useState(false)
  const [showDuplicate, setShowDuplicate] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [savedProposalId, setSavedProposalId] = useState<string | null>(null)
  const [backendProposalId, setBackendProposalId] = useState<string | null>(null)
  type GenerationState = "idle" | "creating" | "clarifying" | "generating" | "completed" | "error"
  const [generationState, setGenerationState] = useState<GenerationState>("idle")
  const [generationError, setGenerationError] = useState<string | null>(null)

  const { versions, lastSaved, isSaving, save, restore, deleteVersion } = useAutosave(
    { collectedInfo, generatedContent, aiProposal }, // Include aiProposal if it's part of the draft state
    { key: "proposal_draft", interval: 30000, maxVersions: 10 },
  )

  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isSavingDraft, setIsSavingDraft] = useState(false)

  const [clarificationQuestions, setClarificationQuestions] = useState<
    Array<{ question: string; reason: string; field: string }>
  >([])
  const [isAwaitingClarification, setIsAwaitingClarification] = useState(false)
  const [clarificationResponse, setClarificationResponse] = useState("")

  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (proposalsLoading) return

    // Find most recent draft
    const draft = proposals.find((p) => p.status === "draft" && p.originalContent)
    if (draft && draft.originalContent) {
      try {
        const formData = JSON.parse(draft.originalContent) as CollectedInfo
        setCurrentDraftId(draft.id)
        setCollectedInfo(formData)
        setLastSavedAt(draft.updatedAt)

        // Load AI proposal if available
        if (draft.improvedContent) {
          try {
            const savedAiProposal = JSON.parse(draft.improvedContent)
            setAiProposal(savedAiProposal)
          } catch (e) {
            // Not JSON, ignore
          }
        }

        // Load generated content if available
        if (draft.content) {
          setGeneratedContent(draft.content)
        }
      } catch (e) {
        // originalContent is not JSON, start fresh
        if (messages.length === 0) {
          const initialMessage: ChatMessage = {
            id: "1",
            role: "assistant",
            content:
              "Hello! I'm your AI proposal assistant. Let's create a winning proposal together. What type of proposal would you like to create?",
            timestamp: new Date(),
            options: proposalTypes,
            field: "proposalType",
            whyAsking: questionConfig.whyAsking.type,
          }
          setMessages([initialMessage])
        }
      }
    } else {
      if (messages.length === 0) {
        const initialMessage: ChatMessage = {
          id: "1",
          role: "assistant",
          content:
            "Hello! I'm your AI proposal assistant. Let's create a winning proposal together. What type of proposal would you like to create?",
          timestamp: new Date(),
          options: proposalTypes,
          field: "proposalType",
          whyAsking: questionConfig.whyAsking.type,
        }
        setMessages([initialMessage])
      }
    }
  }, [proposals, proposalsLoading, messages.length])

  const saveDraftToDatabase = useCallback(async () => {
    if (!collectedInfo || Object.keys(collectedInfo).length === 0) return

    setIsSavingDraft(true)
    try {
      const draftData = {
        name: collectedInfo.clientCompany
          ? `Draft - ${collectedInfo.clientCompany}`
          : `Draft - ${new Date().toLocaleDateString()}`,
        client: collectedInfo.clientCompany || "",
        industry: (collectedInfo.clientIndustry?.toLowerCase() as ProposalIndustry) || "other",
        value: collectedInfo.budget ? Number.parseFloat(collectedInfo.budget.replace(/[^0-9.]/g, "")) || 0 : 0,
        score: null,
        status: "draft" as ProposalStatus,
        submittedAt: null,
        deadline: null,
        scoreBreakdown: null,
        improvements: [],
        issues: [],
        content: generatedContent || "",
        // Store form data as JSON in original_content column
        originalContent: JSON.stringify(collectedInfo),
        // Store AI proposal as JSON in improved_content column
        improvedContent: aiProposal ? JSON.stringify(aiProposal) : "",
      }

      if (currentDraftId) {
        await updateProposal(currentDraftId, draftData)
      } else {
        const newProposal = await addProposal(draftData)
        if (newProposal) {
          setCurrentDraftId(newProposal.id)
        }
      }
      setLastSavedAt(new Date())
    } catch (error) {
      console.error("Error saving draft:", error)
    } finally {
      setIsSavingDraft(false)
    }
  }, [collectedInfo, generatedContent, aiProposal, currentDraftId, addProposal, updateProposal])

  const getRecommendedTemplates = useCallback(() => {
    const recommendedByGoal =
      questionConfig.templateRecommendationsByGoal[
        collectedInfo.goals as keyof typeof questionConfig.templateRecommendationsByGoal // Use collectedInfo.goals
      ] || []
    const recommendedByIndustry =
      questionConfig.templateRecommendationsByIndustry[
        collectedInfo.clientIndustry as keyof typeof questionConfig.templateRecommendationsByIndustry
      ] || []
    const recommendedByType =
      questionConfig.templateRecommendations[
        collectedInfo.proposalType as keyof typeof questionConfig.templateRecommendations
      ] || []
    const allRecommendations = [...recommendedByGoal, ...recommendedByIndustry, ...recommendedByType]
    // Return unique recommendations and ensure they are valid template IDs
    return [...new Set(allRecommendations)].filter((rec) => templates.some((t) => t.id === rec))
  }, [collectedInfo.proposalType, collectedInfo.clientIndustry, collectedInfo.goals]) // Add collectedInfo.goals

  const getRecommendedTones = useCallback(() => {
    return questionConfig.toneRecommendations[collectedInfo.proposalType || ""] || []
  }, [collectedInfo.proposalType])

  const getRecommendedBudgets = useCallback(() => {
    return questionConfig.budgetRecommendations[collectedInfo.proposalType || ""] || []
  }, [collectedInfo.proposalType])

  const getRecommendedTimelines = useCallback(() => {
    return questionConfig.timelineRecommendations[collectedInfo.proposalType || ""] || []
  }, [collectedInfo.proposalType])

  const getProblemSuggestions = useCallback(() => {
    return questionConfig.problemSuggestions[collectedInfo.proposalType || ""] || []
  }, [collectedInfo.proposalType])

  const getSolutionSuggestions = useCallback(() => {
    return questionConfig.solutionSuggestions[collectedInfo.proposalType || ""] || []
  }, [collectedInfo.proposalType])

  const handleGenerate = useCallback(async () => {
    if (isCreditExhausted) {
      setShowAddCreditsModal(true)
      return
    }

    if (generationState !== "idle" && generationState !== "clarifying") {
      console.log("[v0] Blocking duplicate generation call, state:", generationState)
      return
    }

    setGenerationError(null)
    setIsGenerating(true)

    if (generatedContent) {
      setPreviousContent(generatedContent)
    }

    try {
      let payload: Record<string, any>

      if (backendProposalId && isAwaitingClarification) {
        // Mode B: Submitting clarifications
        setGenerationState("generating")

        const clarificationAnswers: Record<string, string> = {}

        clarificationQuestions.forEach((q) => {
          if (q.field) {
            // Use collectedInfo to get the actual answer for the field
            const answer = collectedInfo[q.field as keyof CollectedInfo]
            if (answer !== undefined) {
              clarificationAnswers[q.field] = String(answer)
            }
          }
        })

        // fallback if no fields found or response not mapped correctly
        if (Object.keys(clarificationAnswers).length === 0 && clarificationResponse) {
          // Try to find a relevant field based on the clarification question's intent if possible
          // For now, just add to additional_context if no specific field is mapped
          clarificationAnswers.additional_context = clarificationResponse
        }

        payload = {
          proposalId: backendProposalId,
          clarificationAnswers,
          skipValidation: true,
        }
        console.log("[v0] Mode B: Submitting clarifications", payload)
      } else if (backendProposalId && !isAwaitingClarification) {
        // Mode C: Resume generation
        setGenerationState("generating")
        payload = {
          proposalId: backendProposalId,
          skipValidation: true,
        }
        console.log("[v0] Mode C: Resuming generation", payload)
      } else {
        // Mode A: Initial generation
        setGenerationState("creating")

        const problemValue =
          (collectedInfo.problem && collectedInfo.problem.trim()) ||
          (collectedInfo.solution && collectedInfo.solution.trim()) ||
          (collectedInfo.clientCompany && collectedInfo.clientCompany.trim()) ||
          "General business proposal"

        const proposalTypeValue =
          (collectedInfo.proposalType && collectedInfo.proposalType.trim()) || "Service Proposal"

        const cleanFormData = {
          proposalType: proposalTypeValue,
          // Check ALL possible industry field names
          industry: collectedInfo.clientIndustry || collectedInfo.industry || collectedInfo.clientIndustry || "other",
          goal: collectedInfo.goals || collectedInfo.goal || "increase_revenue",
          problem: problemValue,
          solution: collectedInfo.solution ?? "",
          budget: collectedInfo.budget ?? "",
          timeline: collectedInfo.timeline ?? "",
          tone: collectedInfo.tone ?? "Professional",
          template:
            templates.find((t) => t.name === collectedInfo.template)?.id ?? collectedInfo.template ?? "professional",
          clientName: collectedInfo.clientName ?? "",
          clientCompany: collectedInfo.clientCompany ?? "",
          preparedBy: collectedInfo.preparedBy || "",
          preparedByEmail: collectedInfo.preparedByEmail || "",
          clientEmail: collectedInfo.clientEmail || "",
          companyName: collectedInfo.companyName || "",
          yourEmail: collectedInfo.yourEmail || "",
          yourWebsite: collectedInfo.yourWebsite || "",
          yourPhone: collectedInfo.yourPhone || "",
          websitePages: collectedInfo.websitePages || collectedInfo.website_pages || "",
          // Line ~1014: Join websiteFeatures into a string for the API
          websiteFeatures: Array.isArray(collectedInfo.websiteFeatures)
            ? collectedInfo.websiteFeatures.join(", ")
            : collectedInfo.websiteFeatures || "",
          primaryAction: collectedInfo.primaryAction || collectedInfo.primary_action || "",
        }

        payload = {
          formData: cleanFormData,
          skipValidation: false,
        }
        console.log("[v0] cleanFormData being sent to API:", {
          industry: cleanFormData.industry,
          proposalType: cleanFormData.proposalType,
          websitePages: cleanFormData.websitePages,
          websiteFeatures: cleanFormData.websiteFeatures,
          primaryAction: cleanFormData.primaryAction,
          collectedInfoKeys: Object.keys(collectedInfo),
          collectedInfoIndustry: collectedInfo.industry,
          collectedInfoClientIndustry: collectedInfo.clientIndustry,
        })
      }

      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      let data: any = null
      const contentType = response.headers.get("content-type") || ""

      if (!response.ok) {
        // Handle non-JSON error responses (504 timeout, HTML error pages)
        if (!contentType.includes("application/json")) {
          const statusText =
            response.status === 504
              ? "The server took too long to respond. Please try again."
              : response.status === 502
                ? "Server temporarily unavailable. Please try again."
                : `Server error (${response.status}). Please try again.`
          throw new Error(statusText)
        }
      }

      const text = await response.text()

      try {
        data = JSON.parse(text)
        console.log("[v0] Parsed API response:", {
          success: data.success,
          hasProposal: !!data.proposal,
          proposalKeys: data.proposal ? Object.keys(data.proposal) : [],
          needsClarification: data.needsClarification,
          hasQuestions: data.clarifyingQuestions?.length > 0,
        })
      } catch {
        // If JSON parsing fails, check if it's an HTML error page
        if (text.includes("<!DOCTYPE") || text.includes("<html") || text.startsWith("An error")) {
          throw new Error("Server returned an error. Please try again.")
        }
        throw new Error(text.slice(0, 100) || "Server returned invalid response")
      }

      if (data.proposalId) {
        setBackendProposalId(data.proposalId)
      }

      console.log("[v0] Entering clarification flow - aiProposal will NOT be set")
      if (data.needsClarification && data.clarifyingQuestions?.length > 0 && !payload.skipValidation) {
        setIsGenerating(false)
        setGenerationState("clarifying")
        setIsAwaitingClarification(true)
        setClarificationQuestions(data.clarifyingQuestions)
        setClarificationResponse("")

        const clarificationMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: data.message || "I need a bit more context to create a truly compelling proposal.",
          timestamp: new Date(),
          clarificationQuestions: data.clarifyingQuestions,
          whyAsking: "This helps create a more specific, client-ready proposal instead of generic content.",
        }
        setMessages((prev) => [...prev, clarificationMessage])
        return
      }

      console.log("[v0] Checking success:", { responseOk: response.ok, dataSuccess: data.success })
      if (!response.ok || !data.success) {
        const errorMsg = data.error || data.details || "Failed to generate proposal"
        setGenerationState("error")
        setGenerationError(errorMsg)
        throw new Error(errorMsg)
      }

      setGenerationState("completed")
      setIsAwaitingClarification(false)
      setClarificationQuestions([])
      setClarificationResponse("")
      // setBackendProposalId(null)

      const aiGeneratedContent = formatProposalToContent(data.proposal)
      setGeneratedContent(aiGeneratedContent)
      console.log("[v0] About to set aiProposal:", {
        hasProposal: !!data.proposal,
        summary: data.proposal?.summary?.substring(0, 50),
        problemStatement: data.proposal?.problemStatement?.substring(0, 50),
        solution: data.proposal?.solution?.substring(0, 50),
      })
      setAiProposal(data.proposal)
      console.log("[v0] setAiProposal called")
      setIsEditMode(false)

      await deductCredit(
        "generate_proposal",
        `Generated ${collectedInfo.proposalType} for ${collectedInfo.clientCompany}`,
      )

      if (data.savedProposal?.id) {
        setSavedProposalId(data.savedProposal.id)
      }

      localStorage.setItem(
        "proposal_preview_data",
        JSON.stringify({
          proposal: data.proposal,
          template: collectedInfo.template || "professional",
          formData: collectedInfo,
        }),
      )

      localStorage.setItem(
        "proposal-ai-content",
        JSON.stringify({
          aiProposal: data.proposal,
          generatedAt: new Date().toISOString(),
        }),
      )

      const completeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "Your proposal is ready! I've created a decision-grade document based on your specific requirements. Review it in the preview panel, and feel free to ask me to refine any section.",
        timestamp: new Date(),
        inputType: "generate",
      }
      setMessages((prev) => [...prev, completeMessage])
    } catch (error) {
      console.error("Error generating proposal:", error)
      // If error occurs before setting generationState to error, ensure it's set
      if (generationState !== "error") {
        setGenerationState("error")
        setGenerationError(error instanceof Error ? error.message : "An unknown error occurred")
      }
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          error instanceof Error && error.message.includes("rate limit")
            ? "We've hit a temporary rate limit. Please wait a moment and try again."
            : "Sorry, there was an error generating your proposal. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
    }
  }, [
    isCreditExhausted,
    generatedContent,
    collectedInfo,
    backendProposalId, // Add dependency
    deductCredit,
    formatProposalToContent,
    isAwaitingClarification,
    clarificationQuestions,
    generationState, // Add generationState to dependencies
    // Removed setSavedProposalId from dependencies as it's just state update
  ])

  const parseBudgetValue = useCallback((budget?: string): number => {
    if (!budget) return 0
    // This regex needs to be more robust to handle different budget formats
    const match = budget.match(/\$?([\d,]+)/g)
    if (match && match.length > 0) {
      // Take the first number found
      const num = Number.parseInt(match[0].replace(/[$,]/g, ""), 10)
      return isNaN(num) ? 0 : num
    }
    return 0
  }, [])

  const handleExportPDF = useCallback(() => {
    if (!generatedContent) return
    window.print()
  }, [generatedContent])

  const handleExportWord = useCallback(() => {
    if (!generatedContent) return

    // Create a blob with the content as HTML that Word can open
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${collectedInfo.proposalType || "Proposal"} - ${collectedInfo.clientCompany || "Client"}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
          h1 { color: #1a1a1a; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 24px; }
          p { color: #4b5563; margin: 12px 0; }
          ul, ol { margin: 12px 0; padding-left: 24px; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        ${generatedContent}
      </body>
      </html>
    `

    const blob = new Blob([htmlContent], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${collectedInfo.clientCompany || "Proposal"}_${new Date().toISOString().split("T")[0]}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [generatedContent, collectedInfo])

  const renderStepOptions = () => {
    const currentStepDetails = conversationSteps[currentStep]
    if (!currentStepDetails) return null

    if (currentStepDetails.id === "yourInfo") {
      return (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Example: "John Smith, Acme Digital Agency" or "Jane Doe from Creative Studios"
          </p>
        </div>
      )
    }

    if (currentStepDetails.id === "industry") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {industryOptions.map((industry) => (
            <Button
              key={industry.id}
              variant="outline"
              size="sm"
              onClick={() => handleUserResponse(industry.label)}
              className="h-auto py-3 px-3 flex flex-col items-center gap-1 hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              <span className="text-xl">{industry.icon}</span>
              <span className="text-xs text-center leading-tight">{industry.label}</span>
            </Button>
          ))}
        </div>
      )
    }

    if (currentStepDetails.id === "goal") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {businessGoalOptions.map((goal) => (
            <Button
              key={goal.id}
              variant="outline"
              size="sm"
              onClick={() => handleUserResponse(goal.label)}
              className="h-auto py-3 px-4 flex flex-col items-start gap-0.5 hover:bg-primary/5 hover:border-primary/30 transition-all text-left"
            >
              <span className="font-medium text-sm">{goal.label}</span>
              <span className="text-xs text-muted-foreground">{goal.description}</span>
            </Button>
          ))}
        </div>
      )
    }

    // Template selection cards for the template step
    if (currentStepDetails.id === "template") {
      return (
        <div className="grid grid-cols-2 gap-3">
          {[...templates]
            .sort((a, b) => {
              const aRec = getRecommendedTemplates().includes(a.id) ? 0 : 1
              const bRec = getRecommendedTemplates().includes(b.id) ? 0 : 1
              return aRec - bRec
            })
            .map((template) => {
              const isRecommended = getRecommendedTemplates().includes(template.id)
              return (
                <Card
                  key={template.id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-2 relative ${
                    collectedInfo.template === template.id
                      ? "border-violet-500 bg-violet-50"
                      : isRecommended
                        ? "border-blue-200 bg-blue-50/30"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleTemplateSelect(template.id, template.name)}
                >
                  {isRecommended && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">Recommended</Badge>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${template.color}15` }}
                    >
                      <LayoutTemplate className="w-5 h-5" style={{ color: template.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
        </div>
      )
    }

    // Website specific options
    if (currentStepDetails.id === "websitePages") {
      return (
        <div className="grid grid-cols-1 gap-2">
          {websitePageOptions.map((option) => (
            <Button
              key={option.label}
              variant="outline"
              className={`h-auto py-3 px-4 flex flex-col items-start gap-0.5 hover:bg-primary/5 hover:border-primary/30 transition-all text-left ${
                collectedInfo.websitePages === option.label ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handleUserResponse(option.label)}
            >
              <span className="font-medium text-sm">{option.label}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </Button>
          ))}
        </div>
      )
    }

    if (currentStepDetails.id === "websiteFeatures") {
      return (
        <div className="grid grid-cols-2 gap-2">
          {websiteFeatureOptions.map((feature) => (
            <Button
              key={feature.label}
              variant="outline"
              className={`h-auto py-3 px-4 flex items-center justify-between hover:bg-primary/5 hover:border-primary/30 transition-all ${
                collectedInfo.websiteFeatures?.includes(feature.label) ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => {
                const currentFeatures = collectedInfo.websiteFeatures || []
                const updatedFeatures = currentFeatures.includes(feature.label)
                  ? currentFeatures.filter((f) => f !== feature.label)
                  : [...currentFeatures, feature.label]
                setCollectedInfo((prev) => ({ ...prev, websiteFeatures: updatedFeatures }))
              }}
            >
              <div className="flex items-center gap-2">
                <feature.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{feature.label}</span>
              </div>
              {collectedInfo.websiteFeatures?.includes(feature.label) && <Check className="h-4 w-4 text-primary" />}
            </Button>
          ))}
        </div>
      )
    }

    if (currentStepDetails.id === "primaryAction") {
      return (
        <div className="grid grid-cols-1 gap-2">
          {primaryGoalOptions.map((goal) => (
            <Button
              key={goal.label}
              variant="outline"
              className={`h-auto py-3 px-4 flex flex-col items-start gap-0.5 hover:bg-primary/5 hover:border-primary/30 transition-all text-left ${
                collectedInfo.primaryAction === goal.label ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => handleUserResponse(goal.label)}
            >
              <span className="font-medium text-sm">{goal.label}</span>
              <span className="text-xs text-muted-foreground">{goal.description}</span>
            </Button>
          ))}
        </div>
      )
    }

    // Default for other steps like type, client, problem, solution, budget, timeline, tone
    return null
  }

  useEffect(() => {
    if (currentStep === 0 && messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI proposal assistant. Let's create a winning proposal together. What type of proposal would you like to create?",
        timestamp: new Date(),
        options: proposalTypes,
        field: "proposalType",
        whyAsking: questionConfig.whyAsking.type,
      }
      setMessages([initialMessage])
    }
  }, [currentStep, messages.length])

  useEffect(() => {
    if (currentStep === 0) return
    if (currentStep >= conversationSteps.length) return

    const currentStepDetails = conversationSteps[currentStep]

    // Conditionally render steps based on collected info
    if (currentStepDetails.condition && !currentStepDetails.condition(collectedInfo)) {
      setCurrentStep(currentStep + 1)
      return
    }

    // Check if the current step is 'generate' which triggers handleGenerate
    if (currentStepDetails.id === "generate") {
      handleGenerate()
      return // Skip sending an assistant message for the 'generate' step
    }

    // For other steps, send the assistant message
    const timer = setTimeout(() => {
      let options: string[] | undefined
      let inputType: "text" | "options" | "generate" | "textarea" | undefined = "text"
      let isTemplateSelection = false
      let whyAsking: string | undefined
      let suggestions: string[] | undefined
      let multiSelect = false

      switch (currentStepDetails.id) {
        case "type":
          options = proposalTypes
          inputType = "options"
          whyAsking = questionConfig.whyAsking.type
          break
        case "industry":
          options = industryOptions.map((opt) => opt.label)
          inputType = "options"
          whyAsking = questionConfig.whyAsking.industry
          break
        case "goal":
          options = businessGoalOptions.map((opt) => opt.label)
          inputType = "options"
          whyAsking = questionConfig.whyAsking.goal
          break
        case "template":
          isTemplateSelection = true
          inputType = undefined // Handled by renderStepOptions
          whyAsking = questionConfig.whyAsking.template
          break
        case "client":
          inputType = "text"
          whyAsking = questionConfig.whyAsking.client
          break
        case "yourInfo": // Handle the new step
          inputType = "text"
          whyAsking = questionConfig.whyAsking.yourInfo
          break
        case "problem":
          inputType = "textarea"
          whyAsking = questionConfig.whyAsking.problem
          suggestions = getProblemSuggestions()
          break
        case "solution":
          inputType = "textarea"
          whyAsking = questionConfig.whyAsking.solution
          suggestions = getSolutionSuggestions()
          break
        case "budget":
          options = budgetRanges
          inputType = "options"
          whyAsking = questionConfig.whyAsking.budget
          break
        case "timeline":
          options = timelineOptions
          inputType = "options"
          whyAsking = questionConfig.whyAsking.timeline
          break
        case "tone":
          options = toneOptions
          inputType = "options"
          whyAsking = questionConfig.whyAsking.tone
          break
        // Website specific cases
        case "websitePages":
          options = websitePageOptions.map((opt) => opt.label)
          inputType = "options"
          whyAsking = questionConfig.whyAsking.websitePages
          break
        case "websiteFeatures":
          options = websiteFeatureOptions.map((opt) => opt.label)
          multiSelect = true
          inputType = "options"
          whyAsking = questionConfig.whyAsking.websiteFeatures
          break
        case "primaryAction":
          options = primaryGoalOptions.map((opt) => opt.label)
          inputType = "options"
          whyAsking = questionConfig.whyAsking.primaryAction
          break
        default:
          inputType = "text"
      }

      const newAssistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: currentStepDetails.question,
        timestamp: new Date(),
        options: options,
        field: currentStepDetails.id,
        inputType: inputType,
        isTemplateSelection: isTemplateSelection,
        whyAsking: whyAsking,
        suggestions: suggestions,
        multiSelect: multiSelect, // Pass multiSelect flag
      }
      setMessages((prev) => {
        // Check if we already have a message for this step to prevent duplicates
        const alreadyHasMessage = prev.some((msg) => msg.role === "assistant" && msg.field === currentStepDetails.id)
        if (alreadyHasMessage) return prev
        return [...prev, newAssistantMessage]
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [
    currentStep,
    handleGenerate,
    getProblemSuggestions,
    getSolutionSuggestions,
    collectedInfo,
    websitePageOptions,
    websiteFeatureOptions,
    primaryGoalOptions,
  ]) // Add new dependencies

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (generatedContent) {
      setActiveTab("preview")
    }
  }, [generatedContent])

  const extractCompanyName = (text: string): string => {
    const patterns = [
      /(?:for|at|with|by)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/,
      /([A-Z][a-zA-Z]+\s+(?:Inc|LLC|Corp|Ltd|Company))/i,
    ]
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) return match[1]
    }
    return ""
  }

  const extractFieldsFromJobDescription = useCallback(async () => {
    if (!jobDescription.trim() || jobDescription.length < 50) return

    setIsExtracting(true)

    try {
      const response = await fetch("/api/extract-job-fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
      })

      if (!response.ok) throw new Error("Failed to extract fields")

      const data = await response.json()
      setExtractedFields(data)
      setShowExtractedReview(true)
    } catch (error) {
      console.error("[v0] Extract error:", error)
      const extractedFallback: ExtractedFields = {
        proposalType: "Service Proposal",
        clientCompany: extractCompanyName(jobDescription),
        problem: jobDescription.slice(0, 200),
        confidence: {
          proposalType: 0.5,
          clientCompany: 0.3,
          problem: 0.7,
          budget: 0.2,
          timeline: 0.2,
        },
      }
      setExtractedFields(extractedFallback)
      setShowExtractedReview(true)
    } finally {
      setIsExtracting(false)
    }
  }, [jobDescription])

  const applyExtractedAndGenerate = useCallback(async () => {
    if (!extractedFields) return

    const newCollectedInfo: CollectedInfo = {
      proposalType: extractedFields.proposalType || "Service Proposal",
      clientIndustry: extractedFields.clientIndustry,
      goals: extractedFields.goal, // Map extracted goal to collectedInfo.goals
      template: "professional", // Default template
      clientCompany: extractedFields.clientCompany || "Client",
      clientName: extractedFields.clientCompany, // Populate clientName if available
      problem: extractedFields.problem,
      solution: extractedFields.solution,
      budget: extractedFields.budget,
      timeline: extractedFields.timeline,
      tone: extractedFields.tone || "Professional",
    }

    setCollectedInfo(newCollectedInfo)
    setShowExtractedReview(false)
    handleGenerate()
  }, [extractedFields, handleGenerate])

  const generateProposal = useCallback(async () => {
    if (generationState !== "idle") {
      return
    }

    if (isAwaitingClarification) {
      const userResponse = clarificationResponse.trim()
      if (!userResponse) {
        setGenerationError("Please provide a response to continue")
        return
      }

      // Add user's response to chat
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: userResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])

      // Update collectedInfo with the clarification response
      // This assumes clarificationQuestions have a 'field' property that maps to collectedInfo keys
      // If not, a more sophisticated mapping might be needed.
      const updatedCollectedInfo = { ...collectedInfo }
      clarificationQuestions.forEach((q) => {
        if (q.field && clarificationResponse) {
          updatedCollectedInfo[q.field as keyof CollectedInfo] = clarificationResponse
        }
      })
      // Fallback if no specific field is identified
      if (Object.keys(updatedCollectedInfo).length === Object.keys(collectedInfo).length && clarificationResponse) {
        updatedCollectedInfo.additionalContext = clarificationResponse
      }
      setCollectedInfo(updatedCollectedInfo)

      handleGenerate()
    } else {
      handleGenerate()
    }
  }, [
    handleGenerate,
    isAwaitingClarification,
    clarificationResponse,
    generationState,
    collectedInfo,
    clarificationQuestions,
  ]) // Added collectedInfo and clarificationQuestions

  const resetConversation = useCallback(() => {
    setMessages([])
    setCollectedInfo({})
    setGeneratedContent("")
    setAiProposal(null)
    setCurrentStep(0)
    setAuditResult(null)
    setPreviousContent("")
    setActiveTab("templates")
    setGenerationMode("guided")
    setJobDescription("")
    setIsExtracting(false)
    setExtractedFields(null)
    setShowExtractedReview(false)
    setSavedProposalId(null)
    setCurrentDraftId(null)
    setLastSavedAt(null)
    setIsSavingDraft(false)
    setIsAwaitingClarification(false)
    setClarificationQuestions([])
    setClarificationResponse("")
    setBackendProposalId(null)
    setGenerationState("idle")
    setGenerationError(null)
  }, [])

  const handleRestore = useCallback(
    (versionId: string) => {
      const restored = restore(versionId)
      if (restored) {
        setCollectedInfo((restored.collectedInfo as CollectedInfo) || {})
        setGeneratedContent((restored.generatedContent as string) || "")
        setAiProposal(restored.aiProposal || null)
        setIsEditMode(false)

        const draftProposal = proposals.find((p) => p.id === versionId)
        if (draftProposal) {
          setCurrentDraftId(draftProposal.id)
          setLastSavedAt(draftProposal.updatedAt)
        }
        setSavedProposalId(null)
        setBackendProposalId(null)
        setGenerationState("idle")
        setGenerationError(null)
      }
    },
    [restore, proposals],
  )

  const handleImport = useCallback((data: Record<string, unknown>) => {
    setCollectedInfo((prev) => ({
      ...prev,
      clientCompany: data.clientName as string,
      problem: data.description as string,
      budget: data.budget as string,
      timeline: data.timeline as string,
      clientEmail: data.clientEmail as string,
      // Add other fields from import if available
      proposalType: (data.proposalType as string) || prev.proposalType,
      clientIndustry: (data.clientIndustry as string) || prev.clientIndustry,
      goals: (data.goals as string) || prev.goals,
      websitePages: (data.websitePages as string) || prev.websitePages,
      websiteFeatures: (data.websiteFeatures as string[]) || prev.websiteFeatures,
      primaryAction: (data.primaryAction as string) || prev.primaryAction,
    }))
  }, [])

  const handleUserResponse = useCallback(
    (response: string) => {
      const currentStepDetails = conversationSteps[currentStep]
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])

      // Update collectedInfo with the response
      setCollectedInfo((prev) => {
        const updates: Partial<CollectedInfo> = {}

        if (currentStepDetails.id === "client") {
          // Store client name in both fields for compatibility
          updates.clientCompany = response
          updates.clientName = response
        } else if (currentStepDetails.id === "industry") {
          updates.clientIndustry = response
          updates.industry = response
        } else if (currentStepDetails.id === "goal") {
          updates.goals = response // Use 'goals' key
        } else if (currentStepDetails.id === "yourInfo") {
          // Expected format: "John Smith, Acme Agency" or "John Smith from Acme Agency" or just "John Smith"
          const parts = response.split(/,|from|at|-/).map((p) => p.trim())
          if (parts.length >= 2) {
            updates.preparedBy = parts[0]
            updates.companyName = parts[1]
          } else {
            updates.preparedBy = response
            updates.companyName = response
          }
          updates.preparedByEmail = "" // Will need separate step or can be added later
        } else if (currentStepDetails.id === "websitePages") {
          updates.websitePages = response
        } else if (currentStepDetails.id === "primaryAction") {
          updates.primaryAction = response
        }
        // For multi-select options like websiteFeatures
        else if (currentStepDetails.multiSelect) {
          const existingValue = (prev[currentStepDetails.id as keyof CollectedInfo] as string[]) || []
          const updatedValue = existingValue.includes(response)
            ? existingValue.filter((item) => item !== response)
            : [...existingValue, response]
          updates[currentStepDetails.id as keyof CollectedInfo] = updatedValue as any
        } else {
          // Fallback: use step ID as field name
          updates[currentStepDetails.id as keyof CollectedInfo] = response
        }

        return { ...prev, ...updates }
      })

      if (currentStep < conversationSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
      setInputValue("")
    },
    [currentStep, messages, collectedInfo], // Added collectedInfo dependency
  )

  const handleTemplateSelect = useCallback(
    (templateId: string, templateName: string) => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: `Selected template: ${templateName}`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])

      setCollectedInfo((prev) => ({ ...prev, template: templateId }))

      if (currentStep < conversationSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    },
    [currentStep],
  )

  useKeyboardShortcuts([
    { key: "s", ctrl: true, description: "Save draft", action: () => saveDraftToDatabase() },
    { key: "p", ctrl: true, shift: true, description: "Toggle preview", action: () => setShowSidebar((s) => !s) },
    { key: "h", ctrl: true, description: "History", action: () => setShowHistory(true) },
    { key: "/", ctrl: true, description: "Shortcuts", action: () => setShowShortcuts(true) },
    {
      key: "q",
      ctrl: true,
      description: "Quick Generate Mode",
      action: () => setGenerationMode(generationMode === "guided" ? "quick" : "guided"),
    },
    { key: "d", ctrl: true, description: "Download PDF", action: handleExportPDF },
    { key: "w", ctrl: true, description: "Download Word", action: handleExportWord },
  ])

  const isReadyToGenerate = currentStep === conversationSteps.length - 1

  const isOptionRecommended = useCallback(
    (option: string, stepId: string) => {
      switch (stepId) {
        case "budget":
          return getRecommendedBudgets().includes(option)
        case "timeline":
          return getRecommendedTimelines().includes(option)
        case "tone":
          return getRecommendedTones().includes(option)
        case "industry":
          // Check if the industry is associated with any recommended templates
          const industryObj = industryOptions.find((opt) => opt.label === option)
          return industryObj
            ? (questionConfig.templateRecommendationsByIndustry[
                industryObj.id as keyof typeof questionConfig.templateRecommendationsByIndustry
              ]?.length ?? 0) > 0
            : false
        case "goal":
          // Check if the goal is associated with any recommended templates
          const goalObj = businessGoalOptions.find((opt) => opt.label === option)
          return goalObj
            ? (questionConfig.templateRecommendationsByGoal[
                goalObj.id as keyof typeof questionConfig.templateRecommendationsByGoal
              ]?.length ?? 0) > 0
            : false
        case "websitePages":
          // Check if the page count is recommended for any website template
          return templates.some((t) => t.id === "website" && t.recommended?.includes(collectedInfo.proposalType || ""))
        case "primaryAction":
          // Check if the primary action aligns with common website goals
          return (
            primaryGoalOptions.find((goal) => goal.label === option)?.id === "more_online_inquiries" ||
            primaryGoalOptions.find((goal) => goal.label === option)?.id === "more_phone_calls"
          )
        default:
          return false
      }
    },
    [
      getRecommendedBudgets,
      getRecommendedTimelines,
      getRecommendedTones,
      industryOptions,
      businessGoalOptions,
      collectedInfo.proposalType,
    ], // Add collectedInfo.proposalType
  )

  const getSortedOptions = useCallback(
    (options: string[], stepId: string) => {
      return [...options].sort((a, b) => {
        const aRec = isOptionRecommended(a, stepId) ? 0 : 1
        const bRec = isOptionRecommended(b, stepId) ? 0 : 1
        return aRec - bRec
      })
    },
    [isOptionRecommended],
  )

  // Handles input change for clarification questions
  const handleClarificationInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setCollectedInfo((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20">
      {lastSavedAt && (
        <div className="absolute top-4 right-4 text-xs text-muted-foreground flex items-center gap-1 z-10">
          {isSavingDraft ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-3 w-3 text-green-500" />
              Draft saved {formatDistanceToNow(lastSavedAt, { addSuffix: true })}
            </>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col p-6 min-h-0">
        <div className="w-full flex flex-col flex-1 min-h-0">
          {/* Mac Window */}
          <div className="flex-1 flex flex-col rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden min-h-0">
            {/* Window Chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
                </div>
                <span className="text-sm font-medium text-gray-700">AI Proposal Generator</span>

                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 ml-4">
                  <button
                    onClick={() => setGenerationMode("guided")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      generationMode === "guided"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Guided
                  </button>
                  <button
                    onClick={() => setGenerationMode("quick")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      generationMode === "quick"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Quick Generate
                  </button>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-3">
                {/* Credit Balance */}
                <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-1.5">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">${balance.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">(${getFeatureCost("generate_proposal").toFixed(2)}/gen)</span>
                </div>

                {/* Save Status */}
                {lastSaved && (
                  <Badge variant="secondary" className="gap-1 text-xs bg-white border border-gray-200">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                      </>
                    )}
                  </Badge>
                )}

                {/* Action Buttons */}
                <TooltipProvider>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveDraftToDatabase}>
                          {" "}
                          {/* Use saveDraftToDatabase */}
                          <Save className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save draft</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowHistory(true)}>
                          <History className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Version history</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowShortcuts(true)}>
                          <Keyboard className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Shortcuts</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={resetConversation}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Start over</TooltipContent>
                    </Tooltip>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowSidebar(!showSidebar)}
                        >
                          {showSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{showSidebar ? "Hide panel" : "Show panel"}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExportPDF}>
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download PDF</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExportWord}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Word</TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              </div>
            </div>

            {generationMode === "guided" && (
              <div className="px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  {conversationSteps.slice(0, -1).map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index < currentStep
                    const isCurrent = index === currentStep
                    const isUpcoming = index > currentStep

                    // Only render steps that have a condition met or no condition
                    if (step.condition && !step.condition(collectedInfo)) {
                      return null
                    }

                    return (
                      <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div
                            className={`
                              w-9 h-9 rounded-full flex items-center justify-center transition-all
                              ${isCompleted ? "bg-emerald-500 text-white" : ""}
                              ${isCurrent ? "bg-gray-900 text-white ring-4 ring-gray-900/10" : ""}
                              ${isUpcoming ? "bg-gray-100 text-gray-400" : ""}
                            `}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <span
                            className={`text-[10px] mt-1 font-medium ${isCurrent ? "text-gray-900" : "text-gray-400"}`}
                          >
                            {step.label}
                          </span>
                        </div>
                        {index < conversationSteps.length - 2 && (
                          <div
                            className={`w-8 h-0.5 mx-1 mt-[-16px] ${index < currentStep ? "bg-emerald-500" : "bg-gray-200"}`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              <AnimatePresence mode="wait">
                {generationMode === "quick" ? (
                  <motion.div
                    key="quick-mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col min-w-0 overflow-hidden"
                  >
                    {!showExtractedReview ? (
                      /* Quick Generate Input View */
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
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-[10px] font-medium px-2 py-0.5">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    AI Powered
                                  </Badge>
                                </div>
                              </div>

                              <div className="p-4">
                                <Textarea
                                  value={jobDescription}
                                  onChange={(e) => setJobDescription(e.target.value)}
                                  placeholder={`Paste the full job posting or project brief here...

Example:
"We are looking for a skilled web developer to redesign our e-commerce platform. The project involves creating a modern, mobile-responsive design with improved checkout flow. 

Company: TechStart Inc.
Budget: $15,000 - $20,000
Timeline: 6-8 weeks
Requirements: React, Node.js, responsive design

Please include your portfolio and estimated timeline in your proposal."`}
                                  className="min-h-[220px] bg-gray-50/50 border-0 text-gray-900 placeholder:text-gray-400 resize-none focus:ring-0 focus:bg-white transition-colors text-sm leading-relaxed"
                                />
                              </div>

                              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8">
                                      <svg className="w-8 h-8 -rotate-90">
                                        <circle
                                          cx="16"
                                          cy="16"
                                          r="12"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          fill="none"
                                          className="text-gray-200"
                                        />
                                        <circle
                                          cx="16"
                                          cy="16"
                                          r="12"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          fill="none"
                                          strokeDasharray={75.4}
                                          strokeDashoffset={75.4 - (Math.min(jobDescription.length, 50) / 50) * 75.4}
                                          className={
                                            jobDescription.length >= 50 ? "text-emerald-500" : "text-amber-500"
                                          }
                                        />
                                      </svg>
                                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-gray-600">
                                        {Math.min(Math.round((jobDescription.length / 50) * 100), 100)}%
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {jobDescription.length < 50 ? (
                                        <span className="text-amber-600">
                                          Need {50 - jobDescription.length} more chars
                                        </span>
                                      ) : (
                                        <span className="text-emerald-600">Ready to extract</span>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  onClick={extractFieldsFromJobDescription}
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
                    ) : (
                      /* Extracted Fields Review */
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
                                      setExtractedFields((prev) =>
                                        prev ? { ...prev, proposalType: e.target.value } : null,
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
                                      setExtractedFields((prev) =>
                                        prev ? { ...prev, clientCompany: e.target.value } : null,
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
                                    setExtractedFields((prev) => (prev ? { ...prev, problem: e.target.value } : null))
                                  }
                                  className="min-h-[80px] bg-gray-50/50 border-gray-200 resize-none focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                  <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center">
                                    <Sparkles className="h-3 w-3 text-emerald-600" />
                                  </div>
                                  Proposed Solution
                                  <span className="text-gray-400 font-normal">(optional - AI will generate)</span>
                                </label>
                                <Textarea
                                  value={extractedFields?.solution || ""}
                                  onChange={(e) =>
                                    setExtractedFields((prev) => (prev ? { ...prev, solution: e.target.value } : null))
                                  }
                                  placeholder="Leave empty for AI to generate based on the problem..."
                                  className="min-h-[60px] bg-gray-50/50 border-gray-200 resize-none focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                    <div className="w-5 h-5 rounded bg-green-50 flex items-center justify-center">
                                      <DollarSign className="h-3 w-3 text-green-600" />
                                    </div>
                                    Budget
                                  </label>
                                  <Input
                                    value={extractedFields?.budget || ""}
                                    onChange={(e) =>
                                      setExtractedFields((prev) => (prev ? { ...prev, budget: e.target.value } : null))
                                    }
                                    placeholder="e.g., $10,000 - $15,000"
                                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                    <div className="w-5 h-5 rounded bg-cyan-50 flex items-center justify-center">
                                      <Clock className="h-3 w-3 text-cyan-600" />
                                    </div>
                                    Timeline
                                  </label>
                                  <Input
                                    value={extractedFields?.timeline || ""}
                                    onChange={(e) =>
                                      setExtractedFields((prev) =>
                                        prev ? { ...prev, timeline: e.target.value } : null,
                                      )
                                    }
                                    placeholder="e.g., 4-6 weeks"
                                    className="bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-300 focus:ring-emerald-500/20"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-50/50 border-t border-gray-100">
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setShowExtractedReview(false)
                                  setExtractedFields(null)
                                }}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                                Back to Edit
                              </Button>

                              <div className="flex items-center gap-3">
                                <div className="text-xs text-gray-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                                  <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                  <span className="font-medium text-gray-700">
                                    ${getFeatureCost("generate_proposal").toFixed(2)}
                                  </span>
                                  <span>per generation</span>
                                </div>
                                <Button
                                  onClick={applyExtractedAndGenerate}
                                  disabled={isGenerating}
                                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                                >
                                  {isGenerating ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-4 w-4 mr-2" />
                                      Generate Proposal
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* Guided Mode - Chat Interface */
                  <motion.div
                    key="guided-mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col min-w-0 overflow-hidden"
                  >
                    {/* Chat Area */}
                    <div
                      className={`${showSidebar ? "flex-1" : "w-full"} flex flex-col min-w-0 min-h-0 ${showSidebar ? "border-r border-gray-100" : ""}`}
                    >
                      {/* Messages */}
                      <div className="flex-1 overflow-y-auto p-6 min-h-0">
                        <div className="max-w-2xl mx-auto space-y-6">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              {message.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                              )}
                              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                                <div
                                  className={`
                                    rounded-2xl px-4 py-3
                                    ${
                                      message.role === "user"
                                        ? "bg-gray-900 text-white rounded-br-md"
                                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                                    }
                                  `}
                                >
                                  <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>

                                {message.whyAsking && message.role === "assistant" && (
                                  <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="text-xs font-semibold text-blue-700">Why we're asking:</span>
                                        <p className="text-xs text-blue-600 mt-0.5">{message.whyAsking}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {message.suggestions &&
                                  message.suggestions.length > 0 &&
                                  message.role === "assistant" && (
                                    <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Star className="h-4 w-4 text-amber-600" />
                                        <span className="text-xs font-semibold text-amber-700">
                                          Suggestions for {collectedInfo.proposalType}:
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {message.suggestions.map((suggestion, idx) => (
                                          <button
                                            key={idx}
                                            onClick={() => handleUserResponse(suggestion)}
                                            className="text-xs px-2.5 py-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                                          >
                                            {suggestion}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Template Selection Cards with Recommendations */}
                                {message.isTemplateSelection && message.role === "assistant" && (
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    {[...templates]
                                      .sort((a, b) => {
                                        const aRec = getRecommendedTemplates().includes(a.id) ? 0 : 1
                                        const bRec = getRecommendedTemplates().includes(b.id) ? 0 : 1
                                        return aRec - bRec
                                      })
                                      .map((template) => {
                                        const isRecommended = getRecommendedTemplates().includes(template.id)
                                        return (
                                          <Card
                                            key={template.id}
                                            className={`p-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-2 relative ${
                                              collectedInfo.template === template.id
                                                ? "border-violet-500 bg-violet-50"
                                                : isRecommended
                                                  ? "border-blue-200 bg-blue-50/30"
                                                  : "border-gray-200 hover:border-gray-300"
                                            }`}
                                            onClick={() => handleTemplateSelect(template.id, template.name)}
                                          >
                                            {isRecommended && (
                                              <div className="absolute -top-2 -right-2">
                                                <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">
                                                  Recommended
                                                </Badge>
                                              </div>
                                            )}
                                            <div className="flex items-start gap-3">
                                              <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: `${template.color}15` }}
                                              >
                                                <LayoutTemplate className="w-5 h-5" style={{ color: template.color }} />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                                                <p className="text-xs text-gray-500">{template.description}</p>
                                              </div>
                                            </div>
                                          </Card>
                                        )
                                      })}
                                  </div>
                                )}

                                {message.options && message.role === "assistant" && !message.isTemplateSelection && (
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {getSortedOptions(message.options, message.field || "").map((option) => {
                                      const isRecommended = isOptionRecommended(option, message.field || "")
                                      return (
                                        <button
                                          key={option}
                                          onClick={() => {
                                            if (message.multiSelect) {
                                              const currentSelections =
                                                (collectedInfo[message.field as keyof CollectedInfo] as string[]) || []
                                              const updatedSelections = currentSelections.includes(option)
                                                ? currentSelections.filter((item) => item !== option)
                                                : [...currentSelections, option]
                                              setCollectedInfo((prev) => ({
                                                ...prev,
                                                [message.field as keyof CollectedInfo]: updatedSelections,
                                              }))
                                            } else {
                                              handleUserResponse(option)
                                            }
                                          }}
                                          className={cn(
                                            "px-3 py-1.5 text-sm font-medium rounded-full border transition-colors relative",
                                            isRecommended
                                              ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
                                            // Highlight multi-select options if they are selected
                                            message.multiSelect &&
                                              (
                                                collectedInfo[message.field as keyof CollectedInfo] as string[]
                                              )?.includes(option) &&
                                              "border-primary bg-primary/5 text-primary font-semibold",
                                          )}
                                        >
                                          {isRecommended && !message.multiSelect && (
                                            <Star className="w-3 h-3 inline mr-1 text-blue-500" />
                                          )}
                                          {option}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}

                                {/* Clarification Questions Input */}
                                {message.clarificationQuestions && isAwaitingClarification && (
                                  <div className="mt-4 space-y-4">
                                    <div className="space-y-3">
                                      {message.clarificationQuestions.map(
                                        (q: { question: string; reason: string; field: string }, idx: number) => (
                                          <div key={idx} className="bg-white/60 rounded-lg p-3 border border-gray-100">
                                            <p className="text-sm font-medium text-gray-800">
                                              {idx + 1}. {q.question}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 italic">{q.reason}</p>
                                            <input type="hidden" name={`clarificationField_${idx}`} value={q.field} />
                                          </div>
                                        ),
                                      )}
                                    </div>

                                    <Textarea
                                      value={clarificationResponse}
                                      onChange={(e) => setClarificationResponse(e.target.value)}
                                      placeholder="Type your response here... You can answer all questions in one message."
                                      className="min-h-[100px] bg-white border-gray-200 resize-none focus:border-emerald-300 focus:ring-emerald-500/20"
                                    />
                                  </div>
                                )}
                              </div>
                              {message.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-gray-600" />
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Generate Button */}
                          {isReadyToGenerate && !isGenerating && !isAwaitingClarification && (
                            <Button
                              onClick={generateProposal}
                              disabled={isGenerating}
                              className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating Proposal...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4 mr-2" />
                                  Generate Proposal
                                </>
                              )}
                            </Button>
                          )}

                          {/* Generating State */}
                          {isGenerating && (
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                                  <span className="text-sm text-gray-600">Generating your proposal...</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Clarification Response Button */}
                          {isAwaitingClarification && !isGenerating && (
                            <Button
                              onClick={generateProposal}
                              disabled={isGenerating}
                              className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting Response...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Submit Response
                                </>
                              )}
                            </Button>
                          )}

                          {/* Error Message Display */}
                          {generationState === "error" && generationError && (
                            <div className="flex gap-3 items-start">
                              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-red-50 border border-red-200 rounded-2xl rounded-bl-md px-4 py-3 flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className="w-4 h-4 text-red-600" />
                                  <span className="text-sm font-semibold text-red-700">Generation Failed</span>
                                </div>
                                <p className="text-xs text-red-600">{generationError}</p>
                              </div>
                            </div>
                          )}

                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* Input Area */}
                      {!isReadyToGenerate &&
                        !isGenerating &&
                        !isAwaitingClarification &&
                        currentStep < conversationSteps.length - 1 && (
                          <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault()
                                if (inputValue.trim()) {
                                  handleUserResponse(inputValue)
                                }
                              }}
                              className="flex gap-3"
                            >
                              <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={
                                  conversationSteps[currentStep]?.id === "client"
                                    ? "Enter client name or company..."
                                    : conversationSteps[currentStep]?.id === "yourInfo"
                                      ? "Your name, Your company (e.g., John Smith, Acme Agency)..."
                                      : conversationSteps[currentStep]?.id === "problem"
                                        ? "Describe the client's problem or need..."
                                        : conversationSteps[currentStep]?.id === "solution"
                                          ? "Describe your proposed solution..."
                                          : conversationSteps[currentStep]?.id === "budget"
                                            ? "Enter budget range (e.g., $5,000 - $10,000)..."
                                            : conversationSteps[currentStep]?.id === "timeline"
                                              ? "Enter timeline (e.g., 4 weeks, 2 months)..."
                                              : conversationSteps[currentStep]?.id === "websitePages"
                                                ? "Select number of pages (e.g., 6-8 pages)..."
                                                : conversationSteps[currentStep]?.id === "primaryAction"
                                                  ? "Enter primary visitor action (e.g., More phone calls)..."
                                                  : "Type your response..."
                                }
                                className="flex-1 h-11 bg-gray-50 border-gray-200 focus:bg-white"
                                autoFocus
                              />
                              <Button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="h-11 px-4 bg-violet-600 hover:bg-violet-700 text-white"
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            </form>
                            <p className="text-xs text-gray-400 mt-2 text-center">
                              Press Enter to send or click the options above
                            </p>
                          </div>
                        )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sidebar */}
              {showSidebar && (
                <div className="w-[520px] flex-shrink-0 flex flex-col bg-gray-50/50 border-l border-gray-100 min-h-0">
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "preview" | "templates")}
                    className="flex flex-col h-full min-h-0"
                  >
                    <TabsList className="grid w-full grid-cols-2 m-3 mb-0 w-[calc(100%-24px)] flex-shrink-0">
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                    </TabsList>

                    {/* Preview Tab */}
                    <TabsContent value="preview" className="flex-1 p-4 overflow-y-auto min-h-0">
                      <div className="min-h-[500px] h-full">
                        {console.log(
                          "[v0] Rendering ProposalPreview with aiProposal:",
                          aiProposal
                            ? {
                                keys: Object.keys(aiProposal),
                                hasSummary: !!aiProposal.summary,
                                summaryPreview: aiProposal.summary?.substring(0, 50),
                              }
                            : "null",
                        )}
                        <ProposalPreview
                          generatedContent={generatedContent}
                          isGenerating={
                            isGenerating || generationState === "generating" || generationState === "creating"
                          }
                          collectedInfo={{
                            proposalType: collectedInfo.proposalType || "Proposal",
                            template: collectedInfo.template?.toLowerCase() || "professional",
                            clientName: collectedInfo.clientCompany || collectedInfo.clientName || "",
                            clientCompany: collectedInfo.clientCompany || collectedInfo.clientName || "",
                            industry: collectedInfo.clientIndustry || collectedInfo.industry || "",
                            problem: aiProposal?.problemStatement || aiProposal?.problem || collectedInfo.problem || "",
                            deliverables: aiProposal?.deliverables || collectedInfo.solution || "",
                            timeline: aiProposal?.timeline || collectedInfo.timeline || "",
                            budget: aiProposal?.investment || collectedInfo.budget || "",
                            tone: collectedInfo.tone || "Professional",
                            solution: aiProposal?.solution || collectedInfo.solution || "",
                            summary: aiProposal?.summary || aiProposal?.executive_summary || "",
                            preparedBy: collectedInfo.preparedBy || "",
                            preparedByEmail: collectedInfo.preparedByEmail || "",
                            // Pass website specific info to ProposalPreview if available
                            websitePages: collectedInfo.websitePages || "",
                            websiteFeatures: collectedInfo.websiteFeatures || [],
                            primaryAction: collectedInfo.primaryAction || "",
                          }}
                          branding={{
                            companyName: collectedInfo.companyName || "",
                            email: collectedInfo.yourEmail || "",
                            website: collectedInfo.yourWebsite || "",
                            phone: collectedInfo.yourPhone || "",
                            preparedBy: collectedInfo.preparedBy || "",
                          }}
                          // Pass the AI proposal object to ProposalPreview for editing
                          aiProposal={aiProposal}
                          isEditMode={isEditMode} // Pass edit mode state
                          setIsEditMode={setIsEditMode} // Pass setter for edit mode
                          onContentChange={(newContent) => {
                            setGeneratedContent(newContent)
                          }}
                        />
                      </div>
                    </TabsContent>

                    {/* Templates Tab with Recommendations */}
                    <TabsContent value="templates" className="flex-1 p-4 overflow-y-auto min-h-0">
                      <div className="text-center mb-4">
                        <h3 className="text-sm font-medium text-gray-900">Choose a Template</h3>
                        <p className="text-xs text-gray-500 mt-1">Select a style for your proposal</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[...templates]
                          .sort((a, b) => {
                            const aRec = getRecommendedTemplates().includes(a.id) ? 0 : 1
                            const bRec = getRecommendedTemplates().includes(b.id) ? 0 : 1
                            return aRec - bRec
                          })
                          .map((template) => {
                            const isRecommended = getRecommendedTemplates().includes(template.id)
                            return (
                              <TemplatePreviewCard
                                key={template.id}
                                template={template}
                                isRecommended={isRecommended}
                                isSelected={collectedInfo.template === template.id} // Check against template ID
                                onClick={() => {
                                  setCollectedInfo((prev) => ({ ...prev, template: template.id })) // Store template ID
                                }}
                              />
                            )
                          })}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <KeyboardShortcutsDialog open={showShortcuts} onOpenChange={setShowShortcuts} />
      <VersionHistoryDialog
        open={showHistory}
        onOpenChange={setShowHistory}
        versions={versions}
        onRestore={handleRestore}
        onDelete={deleteVersion}
      />
      <ImportUrlDialog open={showImportUrl} onOpenChange={setShowImportUrl} onImport={handleImport} />
      <DuplicateProposalDialog
        open={showDuplicate}
        onOpenChange={setShowDuplicate}
        onDuplicate={() => {
          saveDraftToDatabase() // Use saveDraftToDatabase
          setShowDuplicate(false)
        }}
      />
      <AddCreditsModal open={showAddCreditsModal} onOpenChange={setShowAddCreditsModal} />
    </div>
  )
}
