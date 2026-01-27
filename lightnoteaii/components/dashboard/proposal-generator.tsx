"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Check,
  Sparkles,
  RotateCcw,
  Building2,
  Target,
  Clock,
  Palette,
  ListChecks,
  LayoutTemplate,
  Upload,
  ImageIcon,
  X,
  Lightbulb,
  HelpCircle,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProposalGeneratorProps {
  onInfoUpdate?: (info: CollectedInfo) => void
  onContentGenerated?: (content: string) => void
  onGeneratingChange?: (isGenerating: boolean) => void
  voiceTranscript?: string
  onVoiceTranscriptClear?: () => void
}

export type CollectedInfo = {
  proposalType?: string
  template?: string
  clientName?: string
  clientCompany?: string
  clientEmail?: string
  industry?: string
  problem?: string
  budget?: string
  timeline?: string
  tone?: string
  deliverables?: string
  uniqueValue?: string
  additionalContext?: string
  logo?: string
  images?: string[]
  aiGenerated?: boolean
  generatedSummary?: string
  generatedProblem?: string
  generatedSolution?: string
  generatedDeliverables?: string
  generatedMarketOpportunity?: string
  generatedFinancialSummary?: string
  generatedTimeline?: string
  generatedInvestment?: string
  generatedWhyUs?: string
  generatedNextSteps?: string
}

const proposalTypes = {
  "Sales & Business": [
    "Sales Proposal",
    "Service Proposal",
    "Pricing / Quotation Proposal",
    "Partnership Proposal",
    "Retainer Proposal",
    "Renewal Proposal",
  ],
  "Freelance & Consulting": [
    "Freelance Proposal",
    "Scope of Work (SOW)",
    "Consulting Proposal",
    "RFP Response Proposal",
    "Tender / Bid Proposal",
  ],
  "Technology & Development": [
    "Software Development Proposal",
    "SaaS Proposal",
    "Technical Proposal",
    "Implementation Proposal",
    "AI / Automation Proposal",
    "Cloud Migration Proposal",
    "System Integration Proposal",
  ],
  "Marketing & Creative": [
    "Marketing Proposal",
    "Digital Marketing Proposal",
    "SEO Proposal",
    "Content Strategy Proposal",
    "Branding Proposal",
    "Influencer / Creator Proposal",
  ],
  "Investment & Funding": ["Grant Proposal", "Investment / Funding Proposal", "Startup Pitch / Pitch Deck"],
  "Corporate & HR": ["CSR / ESG Proposal", "Training & Upskilling Proposal", "HR / Recruitment Proposal"],
}

const templateOptions = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout with company branding at top",
    preview: "Left sidebar with contact details, right column with content sections",
    category: "General",
    recommended: ["Sales Proposal", "Service Proposal", "Consulting Proposal", "Partnership Proposal"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Clean B2B layout with date header and bottom sender info",
    preview: "Date at top, client info on left, content on right, sender at bottom",
    category: "General",
    recommended: [
      "Sales Proposal",
      "Service Proposal",
      "Pricing / Quotation Proposal",
      "Software Development Proposal",
    ],
  },
  {
    id: "modern",
    name: "Modern Grid",
    description: "Contemporary 2x2 grid layout with header and footer",
    preview: "Title header, content in grid, contacts side-by-side at bottom",
    category: "General",
    recommended: ["Marketing Proposal", "Digital Marketing Proposal", "Branding Proposal"],
  },
  {
    id: "business",
    name: "Business",
    description: "Modern brown/beige layout with progress bars and quote section",
    preview: "Two-column design with sections, numbered list, and metrics",
    category: "General",
    recommended: ["Consulting Proposal", "Investment / Funding Proposal", "Partnership Proposal"],
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold orange/black design with sidebar contact info",
    preview: "Eye-catching layout with numbered points and contact sidebar",
    category: "Creative",
    recommended: ["Marketing Proposal", "Branding Proposal", "Influencer / Creator Proposal"],
  },
  {
    id: "client",
    name: "Client Proposal",
    description: "Clean 2-page design with large numbered sections",
    preview: "Cover page with title, content page with 01-05 numbered sections",
    pages: 2,
    category: "General",
    recommended: ["Freelance Proposal", "Service Proposal", "RFP Response Proposal"],
  },
  {
    id: "project",
    name: "Project Proposal",
    description: "4-page template with cover, about us, phases, and budget",
    preview: "Multi-page layout ideal for software and technical projects",
    category: "Technology & Development",
    pages: 4,
    recommended: ["Software Development Proposal", "SaaS Proposal", "Technical Proposal", "Cloud Migration Proposal"],
  },
]

const steps = [
  { id: 1, title: "Proposal Type", icon: FileText, description: "Choose what kind of proposal" },
  { id: 2, title: "Template", icon: LayoutTemplate, description: "Select a design template" },
  { id: 3, title: "Client Info", icon: Building2, description: "Who is this proposal for?" },
  { id: 4, title: "Problem & Goals", icon: Target, description: "What problem are you solving?" },
  { id: 5, title: "Scope & Deliverables", icon: ListChecks, description: "What will you deliver?" },
  { id: 6, title: "Timeline & Budget", icon: Clock, description: "When and how much?" },
  { id: 7, title: "Final Touches", icon: Palette, description: "Tone and unique value" },
  { id: 8, title: "Generate", icon: Sparkles, description: "Review and create" },
]

const toneOptions = [
  { value: "professional", label: "Professional", description: "Formal and business-focused" },
  { value: "friendly", label: "Friendly", description: "Warm and approachable" },
  { value: "persuasive", label: "Persuasive", description: "Compelling and action-oriented" },
  { value: "technical", label: "Technical", description: "Detailed and precise" },
]

const questionConfig = {
  // Industry recommendations per proposal type
  industryRecommendations: {
    "Software Development Proposal": ["technology", "finance", "healthcare", "retail"],
    "SaaS Proposal": ["technology", "finance", "education", "healthcare"],
    "Technical Proposal": ["technology", "manufacturing", "healthcare", "finance"],
    "Cloud Migration Proposal": ["technology", "finance", "healthcare", "retail"],
    "AI / Automation Proposal": ["technology", "finance", "healthcare", "manufacturing"],
    "Marketing Proposal": ["retail", "technology", "healthcare", "education"],
    "Digital Marketing Proposal": ["retail", "technology", "education", "healthcare"],
    "SEO Proposal": ["retail", "technology", "education", "legal"],
    "Branding Proposal": ["retail", "technology", "healthcare", "education"],
    "Sales Proposal": ["technology", "manufacturing", "retail", "finance"],
    "Service Proposal": ["technology", "healthcare", "legal", "finance"],
    "Consulting Proposal": ["finance", "technology", "healthcare", "manufacturing"],
    "Investment / Funding Proposal": ["technology", "healthcare", "finance", "retail"],
    "Grant Proposal": ["education", "healthcare", "technology"],
    "Freelance Proposal": ["technology", "retail", "education", "legal"],
  } as Record<string, string[]>,

  // Tone recommendations per proposal type
  toneRecommendations: {
    "Software Development Proposal": ["technical", "professional"],
    "SaaS Proposal": ["persuasive", "professional"],
    "Technical Proposal": ["technical", "professional"],
    "Cloud Migration Proposal": ["technical", "professional"],
    "AI / Automation Proposal": ["technical", "persuasive"],
    "Marketing Proposal": ["persuasive", "friendly"],
    "Digital Marketing Proposal": ["persuasive", "friendly"],
    "SEO Proposal": ["technical", "persuasive"],
    "Branding Proposal": ["friendly", "persuasive"],
    "Sales Proposal": ["persuasive", "professional"],
    "Service Proposal": ["professional", "friendly"],
    "Consulting Proposal": ["professional", "technical"],
    "Investment / Funding Proposal": ["persuasive", "professional"],
    "Grant Proposal": ["professional", "technical"],
    "Freelance Proposal": ["friendly", "professional"],
    "Partnership Proposal": ["professional", "friendly"],
    "RFP Response Proposal": ["professional", "technical"],
  } as Record<string, string[]>,

  // Problem statement suggestions per proposal type
  problemSuggestions: {
    "Software Development Proposal": [
      "Legacy system modernization needed",
      "Manual processes causing inefficiencies",
      "Need custom software to automate workflows",
      "Current platform doesn't scale with growth",
    ],
    "SaaS Proposal": [
      "Need a cloud-based solution for team collaboration",
      "Current tools don't integrate well together",
      "Looking for subscription-based software to reduce upfront costs",
      "Need real-time data access across locations",
    ],
    "Marketing Proposal": [
      "Low brand awareness in target market",
      "Need to increase lead generation",
      "Poor social media engagement",
      "Struggling to reach new customer segments",
    ],
    "Digital Marketing Proposal": [
      "Website traffic has plateaued",
      "Low conversion rates from online campaigns",
      "Need to improve online presence",
      "Competitors outranking in search results",
    ],
    "SEO Proposal": [
      "Website not ranking for target keywords",
      "Organic traffic declining over time",
      "Need to improve local search visibility",
      "Technical SEO issues affecting rankings",
    ],
    "Sales Proposal": [
      "Need to increase revenue by X%",
      "Looking to expand into new markets",
      "Current sales process is inefficient",
      "Need better tools for sales team",
    ],
    "Service Proposal": [
      "Need ongoing support and maintenance",
      "Looking for a reliable service partner",
      "Current provider not meeting expectations",
      "Need specialized expertise",
    ],
    "Consulting Proposal": [
      "Need strategic guidance for business transformation",
      "Facing operational challenges",
      "Need expert advice on market expansion",
      "Looking to optimize business processes",
    ],
    "Investment / Funding Proposal": [
      "Seeking funding for product development",
      "Need capital for market expansion",
      "Looking for investment to scale operations",
      "Require funding for R&D initiatives",
    ],
    "Freelance Proposal": [
      "Need specialized skills for a specific project",
      "Looking for flexible, on-demand expertise",
      "Current team lacks bandwidth",
      "Need quick turnaround on deliverables",
    ],
  } as Record<string, string[]>,

  // Deliverables suggestions per proposal type
  deliverablesSuggestions: {
    "Software Development Proposal": [
      "Custom web/mobile application",
      "API development and integration",
      "Database design and implementation",
      "User authentication system",
      "Admin dashboard",
      "Documentation and training",
    ],
    "SaaS Proposal": [
      "Cloud-hosted platform access",
      "User management system",
      "Analytics dashboard",
      "API access for integrations",
      "Onboarding and training",
      "24/7 support",
    ],
    "Marketing Proposal": [
      "Marketing strategy document",
      "Brand guidelines",
      "Campaign creative assets",
      "Social media content calendar",
      "Performance reports",
      "Competitor analysis",
    ],
    "Digital Marketing Proposal": [
      "PPC campaign setup and management",
      "Social media strategy",
      "Email marketing campaigns",
      "Landing page optimization",
      "Monthly analytics reports",
      "A/B testing framework",
    ],
    "SEO Proposal": [
      "Technical SEO audit",
      "Keyword research report",
      "On-page optimization",
      "Link building strategy",
      "Content recommendations",
      "Monthly ranking reports",
    ],
    "Sales Proposal": [
      "Product/service delivery",
      "Implementation support",
      "Training sessions",
      "Documentation",
      "Ongoing support package",
      "Performance guarantee",
    ],
    "Service Proposal": [
      "Service level agreement (SLA)",
      "Regular maintenance",
      "24/7 support access",
      "Monthly status reports",
      "Dedicated account manager",
      "Emergency response",
    ],
    "Consulting Proposal": [
      "Initial assessment report",
      "Strategic recommendations",
      "Implementation roadmap",
      "Executive presentations",
      "Change management support",
      "Progress reviews",
    ],
    "Freelance Proposal": [
      "Project deliverables as specified",
      "Source files and assets",
      "Revision rounds included",
      "Final documentation",
      "Handoff and training",
    ],
  } as Record<string, string[]>,

  // Timeline suggestions per proposal type
  timelineSuggestions: {
    "Software Development Proposal": ["8-12 weeks", "3-6 months", "6-12 months"],
    "SaaS Proposal": ["Immediate access", "2-4 weeks onboarding", "30-day trial"],
    "Marketing Proposal": ["3 months", "6 months", "12 months"],
    "Digital Marketing Proposal": ["3 months minimum", "6 months recommended", "Ongoing"],
    "SEO Proposal": ["6 months minimum", "12 months for best results", "Ongoing optimization"],
    "Sales Proposal": ["Immediate", "2-4 weeks", "30 days"],
    "Service Proposal": ["Ongoing monthly", "Annual contract", "Project-based"],
    "Consulting Proposal": ["4-8 weeks", "2-3 months", "Phased approach"],
    "Freelance Proposal": ["1-2 weeks", "2-4 weeks", "1-2 months"],
  } as Record<string, string[]>,

  // Budget suggestions per proposal type
  budgetSuggestions: {
    "Software Development Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000+"],
    "SaaS Proposal": ["$99 - $299/month", "$299 - $999/month", "Custom enterprise pricing"],
    "Marketing Proposal": ["$5,000 - $15,000/month", "$15,000 - $30,000/month", "$30,000+/month"],
    "Digital Marketing Proposal": ["$3,000 - $7,500/month", "$7,500 - $15,000/month", "$15,000+/month"],
    "SEO Proposal": ["$2,000 - $5,000/month", "$5,000 - $10,000/month", "$10,000+/month"],
    "Sales Proposal": ["Custom quote", "Volume-based pricing", "Negotiable"],
    "Service Proposal": ["$1,000 - $5,000/month", "$5,000 - $15,000/month", "Custom retainer"],
    "Consulting Proposal": ["$150 - $300/hour", "$5,000 - $15,000/project", "$10,000 - $50,000/engagement"],
    "Freelance Proposal": ["$50 - $150/hour", "$1,000 - $5,000/project", "$5,000 - $15,000/project"],
  } as Record<string, string[]>,

  // Why we're asking explanations
  whyAsking: {
    clientInfo:
      "Understanding who you're writing for helps us tailor the language, formality, and focus areas of your proposal to resonate with this specific client.",
    industry:
      "Different industries have unique pain points, terminology, and expectations. This helps generate industry-relevant content and examples.",
    problem:
      "A clear problem statement is the foundation of a compelling proposal. It shows the client you understand their challenges and sets up your solution.",
    deliverables:
      "Specific deliverables set clear expectations and help clients understand exactly what they're getting. This reduces scope creep and builds trust.",
    timeline:
      "Realistic timelines demonstrate your experience and help clients plan their resources. It also sets expectations for project duration.",
    budget:
      "Being transparent about investment helps qualify leads and shows professionalism. It also helps the AI generate appropriate scope recommendations.",
    tone: "The right tone makes your proposal feel authentic and appropriate for the relationship. A mismatch can make even great content feel off.",
    uniqueValue:
      "This is what sets you apart from competitors. It's the reason a client should choose you over others.",
  },
}

const formatDeliverables = (deliverables: string | string[] | undefined): string => {
  if (!deliverables) return "• Comprehensive solution implementation"
  if (Array.isArray(deliverables)) {
    return deliverables.map((d: string) => `• ${d.trim()}`).join("\n")
  }
  if (typeof deliverables === "string") {
    return deliverables
      .split(",")
      .map((d: string) => `• ${d.trim()}`)
      .join("\n")
  }
  return "• Comprehensive solution implementation"
}

export function ProposalGenerator({
  onInfoUpdate,
  onContentGenerated,
  onGeneratingChange,
  voiceTranscript,
  onVoiceTranscriptClear,
}: ProposalGeneratorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CollectedInfo>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStage, setGenerationStage] = useState("")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const totalSteps = 8

  const updateFormData = (key: keyof CollectedInfo, value: string | string[] | undefined) => {
    const newFormData = { ...formData, [key]: value }
    setFormData(newFormData)
    onInfoUpdate?.(newFormData)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateFormData("logo", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const currentImages = formData.images || []
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const newImages = [...currentImages, reader.result as string]
          updateFormData("images", newImages)
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    const currentImages = formData.images || []
    const newImages = currentImages.filter((_, i) => i !== index)
    updateFormData("images", newImages)
  }

  const handleRemoveLogo = () => {
    updateFormData("logo", undefined)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.proposalType
      case 2:
        return !!formData.template
      case 3:
        return !!formData.clientName
      case 4:
        return !!formData.problem
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    onGeneratingChange?.(true)
    setGenerationProgress(0)

    const stages = [
      "Analyzing your requirements...",
      "Researching industry best practices...",
      "Crafting executive summary...",
      "Developing solution approach...",
      "Building financial projections...",
      "Polishing final proposal...",
    ]

    let animationComplete = false
    const animateStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        if (animationComplete) break
        setGenerationStage(stages[i])
        setGenerationProgress(((i + 1) / stages.length) * 90) // Cap at 90% until AI returns
        await new Promise((resolve) => setTimeout(resolve, 1200))
      }
    }

    // Start animation
    const animationPromise = animateStages()

    try {
      const response = await fetch("/api/generate-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      })

      animationComplete = true
      await animationPromise

      if (response.ok) {
        const data = await response.json()

        if (data.success && data.proposal) {
          const proposal = data.proposal

          // Update formData with AI-generated content
          const enhancedFormData: CollectedInfo = {
            ...formData,
            // Use AI-generated content for sections
            aiGenerated: true,
            generatedSummary: proposal.summary,
            generatedProblem: proposal.problemStatement,
            generatedSolution: proposal.solution,
            generatedDeliverables: proposal.deliverables?.join("\n• ") || formData.deliverables,
            generatedMarketOpportunity: proposal.marketOpportunity,
            generatedFinancialSummary: proposal.financialSummary,
            generatedTimeline: proposal.timeline,
            generatedInvestment: proposal.investment,
            generatedWhyUs: proposal.whyUs,
            generatedNextSteps: proposal.nextSteps?.join("\n") || "",
          } as CollectedInfo & Record<string, any>

          // Format content for preview
          const formattedContent = `## ${proposal.title || formData.proposalType}

### SUMMARY
${proposal.summary}

### PROBLEM STATEMENT
${proposal.problemStatement}

### SOLUTION
${proposal.solution}

**Key Deliverables:**
${formatDeliverables(proposal.deliverables)}

### MARKET OPPORTUNITY
${proposal.marketOpportunity}

### FINANCIAL SUMMARY
${proposal.financialSummary}

**Investment:** ${proposal.investment}
**Timeline:** ${proposal.timeline}

### WHY CHOOSE US
${proposal.whyUs}

### NEXT STEPS
${proposal.nextSteps?.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n") || ""}`

          setFormData(enhancedFormData)
          onContentGenerated?.(formattedContent)
          setGenerationProgress(100)
          setGenerationStage("Proposal generated successfully!")
        } else {
          throw new Error(data.error || "Failed to generate")
        }
      } else {
        throw new Error("API request failed")
      }
    } catch (error) {
      console.error("[v0] Proposal generation error:", error)
      const fallbackContent = generateFallbackProposal()
      onContentGenerated?.(fallbackContent)
      setGenerationProgress(100)
      setGenerationStage("Generated with template (AI unavailable)")
    }

    setIsGenerating(false)
    onGeneratingChange?.(false)
    setGenerationComplete(true)
  }

  const generateFallbackProposal = () => {
    const clientName = formData.clientName || "Valued Client"
    const company = formData.clientCompany || "your organization"
    const proposalType = formData.proposalType || "Business Proposal"
    const industry = formData.industry || "your industry"
    const problem = formData.problem || "operational challenges"
    const deliverables = formData.deliverables
    const timeline = formData.timeline || "4-6 weeks"
    const budget = formData.budget || "to be discussed"

    return `## ${proposalType}

### SUMMARY
We are pleased to present this proposal to ${company}, designed specifically to address ${problem.toLowerCase()}. Our approach combines industry-leading expertise with innovative strategies to deliver measurable results. With a proven track record in ${industry}, we are confident in our ability to exceed your expectations and drive meaningful business outcomes.

### PROBLEM STATEMENT
${clientName}, like many organizations in ${industry}, faces significant challenges: ${problem}. These issues, if left unaddressed, can lead to increased operational costs, reduced efficiency, and missed market opportunities. Our analysis indicates that businesses facing similar challenges experience an average of 15-25% reduction in operational effectiveness. The time to act is now.

### SOLUTION
Our comprehensive solution addresses your specific needs through a multi-phased approach:

**Phase 1: Assessment & Planning**
We begin with a thorough analysis of your current state, identifying quick wins and long-term opportunities.

**Phase 2: Implementation**
Our expert team executes the solution with minimal disruption to your operations.

**Phase 3: Optimization & Handoff**
We fine-tune the solution and ensure your team is fully equipped to maintain success.

**Key Deliverables:**
${formatDeliverables(deliverables)}

### MARKET OPPORTUNITY
The ${industry} sector is experiencing rapid transformation. Organizations that adapt quickly gain significant competitive advantages. Our solution positions ${company} to:
• Capture emerging market opportunities
• Stay ahead of industry trends
• Build sustainable competitive advantages

### FINANCIAL SUMMARY
Based on our experience with similar engagements, clients typically achieve:
• 20-30% reduction in operational costs
• 35% improvement in workflow efficiency
• 25% increase in team productivity
• ROI achieved within 6-12 months

**Investment:** ${budget}
**Timeline:** ${timeline}

### WHY CHOOSE US
• **Proven Expertise:** 10+ years of experience in ${industry}
• **Results-Driven:** 95% client satisfaction rate
• **Dedicated Support:** Personal project manager for your engagement
• **Flexible Approach:** Solutions tailored to your specific needs

### NEXT STEPS
1. Review this proposal and note any questions
2. Schedule a discovery call to discuss your specific requirements
3. Finalize scope and sign the agreement
4. Begin the engagement within 48 hours of approval`
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setFormData({})
    setGenerationComplete(false)
    setGenerationProgress(0)
    setGenerationStage("")
    onContentGenerated?.("")
  }

  const getAvailableTemplates = (proposalType?: string) => {
    // Check if proposal type is under Technology & Development
    const isTechCategory = proposalTypes["Technology & Development"]?.includes(proposalType || "")

    if (isTechCategory) {
      // Show project template for Technology & Development
      return templateOptions
    }

    // For other categories, exclude project template
    return templateOptions.filter((t) => t.id !== "project")
  }

  const getRecommendedIndustries = () => {
    return questionConfig.industryRecommendations[formData.proposalType || ""] || []
  }

  const getRecommendedTones = () => {
    return questionConfig.toneRecommendations[formData.proposalType || ""] || []
  }

  const getProblemSuggestions = () => {
    return (
      questionConfig.problemSuggestions[formData.proposalType || ""] || [
        "Describe the main challenge your client is facing",
        "What goal are they trying to achieve?",
        "What's the impact of not solving this problem?",
      ]
    )
  }

  const getDeliverablesSuggestions = () => {
    return (
      questionConfig.deliverablesSuggestions[formData.proposalType || ""] || [
        "List specific items you will deliver",
        "Include milestones and checkpoints",
        "Add any documentation or training",
      ]
    )
  }

  const getTimelineSuggestions = () => {
    return questionConfig.timelineSuggestions[formData.proposalType || ""] || ["2-4 weeks", "1-2 months", "3-6 months"]
  }

  const getBudgetSuggestions = () => {
    return (
      questionConfig.budgetSuggestions[formData.proposalType || ""] || [
        "$1,000 - $5,000",
        "$5,000 - $15,000",
        "$15,000+",
      ]
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">What type of proposal do you need?</h2>
              <p className="text-sm text-muted-foreground">Select the category that best fits your needs</p>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {Object.entries(proposalTypes).map(([category, types]) => (
                  <div key={category}>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2 sticky top-0 bg-background py-1">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {types.map((type) => (
                        <button
                          key={type}
                          onClick={() => updateFormData("proposalType", type)}
                          className={cn(
                            "p-3 text-left text-sm rounded-lg border transition-all",
                            formData.proposalType === type
                              ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                              : "border-border hover:border-primary/50 hover:bg-muted/50",
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {formData.proposalType && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm">
                  <span className="text-muted-foreground">Selected:</span>{" "}
                  <span className="font-medium">{formData.proposalType}</span>
                </p>
              </div>
            )}
            {!formData.proposalType && (
              <p className="text-center text-sm text-muted-foreground">Select a proposal type to continue</p>
            )}
          </div>
        )

      case 2:
        // Filter templates based on proposal type category
        const filteredTemplates = templateOptions.filter((template) => {
          // Prioritize templates recommended for this proposal type
          if (template.recommended && template.recommended.includes(formData.proposalType || "")) {
            return true
          }
          // If no recommended match, still show all templates
          return true
        })

        // Sort to show recommended templates first
        const sortedTemplates = filteredTemplates.sort((a, b) => {
          const aRecommended = a.recommended?.includes(formData.proposalType || "") ? 0 : 1
          const bRecommended = b.recommended?.includes(formData.proposalType || "") ? 0 : 1
          return aRecommended - bRecommended
        })

        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Choose a template</h2>
              <p className="text-sm text-muted-foreground">Select a design style for your proposal</p>
            </div>
            <div className="grid gap-3">
              {sortedTemplates.map((template, index) => {
                const isRecommended = template.recommended?.includes(formData.proposalType || "")
                return (
                  <button
                    key={template.id}
                    onClick={() => updateFormData("template", template.id)}
                    className={cn(
                      "p-4 text-left rounded-lg border transition-all flex gap-4 relative",
                      formData.template === template.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-primary/50 hover:bg-muted/50",
                    )}
                  >
                    {isRecommended && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-blue-500 text-white">Recommended</Badge>
                      </div>
                    )}
                    <div className="w-24 h-32 bg-muted rounded border flex-shrink-0 overflow-hidden">
                      {template.id === "classic" && (
                        <div className="h-full flex">
                          <div className="w-1/3 bg-[#d4ddd9] p-1">
                            <div className="w-full h-1 bg-[#2d4a47] rounded mb-2" />
                            <div className="w-3/4 h-0.5 bg-slate-400 rounded mb-1" />
                            <div className="w-1/2 h-0.5 bg-slate-400 rounded" />
                          </div>
                          <div className="flex-1 p-1">
                            <div className="w-2/3 h-2 bg-[#2d4a47] rounded mb-2" />
                            <div className="w-full h-0.5 bg-slate-300 rounded mb-1" />
                            <div className="w-full h-0.5 bg-slate-300 rounded mb-1" />
                            <div className="w-3/4 h-0.5 bg-slate-300 rounded" />
                          </div>
                        </div>
                      )}
                      {template.id === "professional" && (
                        <div className="h-full flex flex-col">
                          <div className="h-3 bg-[#1a1a1a]" />
                          <div className="flex-1 p-1">
                            <div className="w-2/3 h-2 bg-slate-800 rounded mb-2" />
                            <div className="flex gap-1">
                              <div className="w-1/3">
                                <div className="w-full h-0.5 bg-slate-300 rounded mb-1" />
                                <div className="w-3/4 h-0.5 bg-slate-300 rounded" />
                              </div>
                              <div className="flex-1">
                                <div className="w-full h-0.5 bg-slate-300 rounded mb-1" />
                                <div className="w-full h-0.5 bg-slate-300 rounded mb-1" />
                                <div className="w-3/4 h-0.5 bg-slate-300 rounded" />
                              </div>
                            </div>
                          </div>
                          <div className="h-3 bg-[#1a1a1a]" />
                        </div>
                      )}
                      {template.id === "modern" && (
                        <div className="h-full flex flex-col">
                          <div className="p-1 border-l-2 border-[#2d4a47]">
                            <div className="w-2/3 h-2 bg-slate-700 rounded mb-1" />
                            <div className="w-full h-0.5 bg-slate-300 rounded" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-1 p-1">
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#2d4a47] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#2d4a47] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#2d4a47] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#2d4a47] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                          </div>
                          <div className="p-1 bg-[#e8edeb]">
                            <div className="flex gap-1">
                              <div className="flex-1 h-2 bg-slate-300 rounded" />
                              <div className="flex-1 h-2 bg-slate-300 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                      {template.id === "business" && (
                        <div className="h-full flex flex-col">
                          <div className="h-6 bg-[#5c4a3d] p-1">
                            <div className="w-2/3 h-1.5 bg-[#d4c4b0] rounded" />
                          </div>
                          <div className="flex-1 p-1 flex gap-1">
                            <div className="flex-1 space-y-1">
                              <div className="h-4 bg-[#e8dfd4] rounded p-0.5">
                                <div className="w-3/4 h-1 bg-[#5c4a3d] rounded" />
                              </div>
                              <div className="h-4 bg-[#e8dfd4] rounded p-0.5">
                                <div className="w-3/4 h-1 bg-[#5c4a3d] rounded" />
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="h-5 bg-[#5c4a3d] rounded p-0.5">
                                <div className="w-full h-1 bg-[#d4c4b0] rounded" />
                              </div>
                              <div className="h-3 bg-[#e8dfd4] rounded" />
                            </div>
                          </div>
                          <div className="h-3 bg-[#5c4a3d]" />
                        </div>
                      )}
                      {template.id === "project" && (
                        <div className="h-full flex flex-col">
                          <div className="p-1 text-center">
                            <div className="w-1/3 h-1 bg-slate-300 rounded mx-auto mb-1" />
                            <div className="w-2/3 h-2 bg-primary/60 rounded mx-auto" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-1 p-1">
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                          </div>
                          <div className="p-1 border-t flex gap-1">
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                          </div>
                        </div>
                      )}
                      {template.id === "creative" && (
                        <div className="h-full flex flex-col">
                          <div className="p-1 text-center">
                            <div className="w-1/3 h-1 bg-[#ff5733] rounded mx-auto mb-1" />
                            <div className="w-2/3 h-2 bg-[#000000] rounded mx-auto" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-1 p-1">
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#ff5733] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#ff5733] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#ff5733] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-[#ff5733] rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                          </div>
                          <div className="p-1 border-t flex gap-1">
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                          </div>
                        </div>
                      )}
                      {template.id === "client" && (
                        <div className="h-full flex flex-col">
                          <div className="p-1 text-center">
                            <div className="w-1/3 h-1 bg-slate-300 rounded mx-auto mb-1" />
                            <div className="w-2/3 h-2 bg-primary/60 rounded mx-auto" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-1 p-1">
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                            <div className="bg-slate-100 rounded p-0.5">
                              <div className="w-3/4 h-1 bg-primary/60 rounded mb-0.5" />
                              <div className="w-full h-0.5 bg-slate-300 rounded" />
                            </div>
                          </div>
                          <div className="p-1 border-t flex gap-1">
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                            <div className="flex-1 h-2 bg-slate-200 rounded" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{template.preview}</p>
                      {template.pages && (
                        <Badge variant="secondary" className="mt-2">
                          {template.pages} pages
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 3:
        const recommendedIndustries = getRecommendedIndustries()
        const allIndustries = [
          { value: "technology", label: "Technology" },
          { value: "healthcare", label: "Healthcare" },
          { value: "finance", label: "Finance" },
          { value: "retail", label: "Retail" },
          { value: "manufacturing", label: "Manufacturing" },
          { value: "education", label: "Education" },
          { value: "legal", label: "Legal" },
          { value: "other", label: "Other" },
        ]
        // Sort to show recommended industries first
        const sortedIndustries = [...allIndustries].sort((a, b) => {
          const aRec = recommendedIndustries.includes(a.value) ? 0 : 1
          const bRec = recommendedIndustries.includes(b.value) ? 0 : 1
          return aRec - bRec
        })

        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Who is this proposal for?</h2>
              <p className="text-sm text-muted-foreground">Enter your client's details</p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 flex gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Why we're asking:</span> {questionConfig.whyAsking.clientInfo}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="clientName" className="flex items-center gap-2">
                  Contact Name{" "}
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    Required
                  </Badge>
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName || ""}
                  onChange={(e) => updateFormData("clientName", e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="clientCompany">Company Name</Label>
                <Input
                  id="clientCompany"
                  value={formData.clientCompany || ""}
                  onChange={(e) => updateFormData("clientCompany", e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail || ""}
                  onChange={(e) => updateFormData("clientEmail", e.target.value)}
                  placeholder="john@acme.com"
                />
              </div>
              <div>
                <Label htmlFor="industry" className="flex items-center gap-2">
                  Industry
                  {recommendedIndustries.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      (Recommendations based on {formData.proposalType})
                    </span>
                  )}
                </Label>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  {questionConfig.whyAsking.industry}
                </p>
                <Select value={formData.industry || ""} onValueChange={(v) => updateFormData("industry", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedIndustries.map((industry) => {
                      const isRecommended = recommendedIndustries.includes(industry.value)
                      return (
                        <SelectItem key={industry.value} value={industry.value}>
                          <span className="flex items-center gap-2">
                            {industry.label}
                            {isRecommended && (
                              <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">Recommended</Badge>
                            )}
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Label className="mb-2 block">Company Logo (Optional)</Label>
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                {formData.logo ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.logo || "/placeholder.svg"}
                      alt="Company Logo"
                      className="h-16 w-auto object-contain border rounded p-2"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full h-20 border-dashed"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload logo</span>
                    </div>
                  </Button>
                )}
              </div>

              <div>
                <Label className="mb-2 block">Additional Images (Optional)</Label>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="grid grid-cols-3 gap-2">
                  {(formData.images || []).map((img, index) => (
                    <div key={index} className="relative aspect-video">
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {(formData.images?.length || 0) < 6 && (
                    <Button
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="aspect-video border-dashed"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Image</span>
                      </div>
                    </Button>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Up to 6 images for your proposal</p>
              </div>
            </div>
          </div>
        )

      case 4:
        const problemSuggestions = getProblemSuggestions()
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">What problem are you solving?</h2>
              <p className="text-sm text-muted-foreground">Describe the client's challenge or goals</p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 flex gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Why we're asking:</span> {questionConfig.whyAsking.problem}
                </p>
              </CardContent>
            </Card>

            {problemSuggestions.length > 0 && (
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      Suggestions for {formData.proposalType}:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {problemSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateFormData("problem", suggestion)}
                        className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="problem" className="flex items-center gap-2">
                Problem Statement{" "}
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                  Required
                </Badge>
              </Label>
              <Textarea
                id="problem"
                value={formData.problem || ""}
                onChange={(e) => updateFormData("problem", e.target.value)}
                placeholder="e.g., The client needs a modern website to increase online sales and improve customer engagement..."
                className="min-h-[150px]"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Be specific about what the client is trying to achieve
              </p>
            </div>
          </div>
        )

      case 5:
        const deliverablesSuggestions = getDeliverablesSuggestions()
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">What will you deliver?</h2>
              <p className="text-sm text-muted-foreground">List your key deliverables and approach</p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 flex gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Why we're asking:</span> {questionConfig.whyAsking.deliverables}
                </p>
              </CardContent>
            </Card>

            {deliverablesSuggestions.length > 0 && (
              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      Common deliverables for {formData.proposalType}:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {deliverablesSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const current = formData.deliverables || ""
                          const newValue = current ? `${current}, ${suggestion}` : suggestion
                          updateFormData("deliverables", newValue)
                        }}
                        className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="deliverables">Scope & Deliverables</Label>
              <Textarea
                id="deliverables"
                value={formData.deliverables || ""}
                onChange={(e) => updateFormData("deliverables", e.target.value)}
                placeholder="e.g., Custom website design, Mobile responsive development, CMS integration, SEO optimization..."
                className="min-h-[150px]"
              />
              <p className="mt-1 text-xs text-muted-foreground">Separate items with commas or new lines</p>
            </div>
          </div>
        )

      case 6:
        const timelineSuggestions = getTimelineSuggestions()
        const budgetSuggestions = getBudgetSuggestions()
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Timeline & Budget</h2>
              <p className="text-sm text-muted-foreground">Optional but helps create a complete proposal</p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 flex gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Why we're asking:</span> {questionConfig.whyAsking.timeline}{" "}
                  {questionConfig.whyAsking.budget}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="timeline">Estimated Timeline</Label>
                {timelineSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                    {timelineSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateFormData("timeline", suggestion)}
                        className={cn(
                          "text-xs px-2 py-1 rounded-full transition-colors",
                          formData.timeline === suggestion
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80",
                        )}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  id="timeline"
                  value={formData.timeline || ""}
                  onChange={(e) => updateFormData("timeline", e.target.value)}
                  placeholder="e.g., 4-6 weeks, 3 months, Q1 2024"
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget Range</Label>
                {budgetSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
                    {budgetSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateFormData("budget", suggestion)}
                        className={cn(
                          "text-xs px-2 py-1 rounded-full transition-colors",
                          formData.budget === suggestion
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80",
                        )}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <Input
                  id="budget"
                  value={formData.budget || ""}
                  onChange={(e) => updateFormData("budget", e.target.value)}
                  placeholder="e.g., $5,000 - $10,000, Upon request"
                />
              </div>
            </div>
          </div>
        )

      case 7:
        const recommendedTones = getRecommendedTones()
        const toneOptionsWithRecommendations = [
          { value: "professional", label: "Professional", desc: "Formal and business-like" },
          { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
          { value: "persuasive", label: "Persuasive", desc: "Compelling and action-oriented" },
          { value: "technical", label: "Technical", desc: "Detailed and precise" },
        ].sort((a, b) => {
          const aRec = recommendedTones.includes(a.value) ? 0 : 1
          const bRec = recommendedTones.includes(b.value) ? 0 : 1
          return aRec - bRec
        })

        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Final Touches</h2>
              <p className="text-sm text-muted-foreground">Customize the tone and highlight your value</p>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-3 flex gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Why we're asking:</span> {questionConfig.whyAsking.tone}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Tone of Voice</Label>
                <RadioGroup
                  value={formData.tone || "professional"}
                  onValueChange={(v) => updateFormData("tone", v)}
                  className="grid grid-cols-2 gap-2"
                >
                  {toneOptionsWithRecommendations.map((tone) => {
                    const isRecommended = recommendedTones.includes(tone.value)
                    return (
                      <Label
                        key={tone.value}
                        className={cn(
                          "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all relative",
                          formData.tone === tone.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        {isRecommended && (
                          <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-1.5 py-0">
                            Recommended
                          </Badge>
                        )}
                        <RadioGroupItem value={tone.value} className="mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">{tone.label}</div>
                          <div className="text-xs text-muted-foreground">{tone.desc}</div>
                        </div>
                      </Label>
                    )
                  })}
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="uniqueValue" className="flex items-center gap-2">
                  Unique Value Proposition
                  <span className="text-xs text-muted-foreground">(What sets you apart)</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  {questionConfig.whyAsking.uniqueValue}
                </p>
                <Textarea
                  id="uniqueValue"
                  value={formData.uniqueValue || ""}
                  onChange={(e) => updateFormData("uniqueValue", e.target.value)}
                  placeholder="What makes your approach unique? Why should they choose you?"
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Generate Your Proposal</h2>
              <p className="text-sm text-muted-foreground">Review your inputs and generate</p>
            </div>

            {!generationComplete ? (
              <>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{formData.proposalType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium capitalize">{formData.template}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Client:</span>
                      <span className="font-medium">{formData.clientName || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-medium">{formData.clientCompany || "Not specified"}</span>
                    </div>
                    {formData.logo && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Logo:</span>
                        <img src={formData.logo || "/placeholder.svg"} alt="Logo" className="h-8 w-auto" />
                      </div>
                    )}
                    {formData.images && formData.images.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Images:</span>
                        <span className="font-medium">{formData.images.length} uploaded</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {isGenerating ? (
                  <div className="space-y-3">
                    <Progress value={generationProgress} className="h-2" />
                    <p className="text-center text-sm text-muted-foreground">{generationStage}</p>
                  </div>
                ) : (
                  <Button onClick={handleGenerate} className="w-full" size="lg">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Proposal
                  </Button>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Proposal Generated!</span>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Your proposal is ready! View it in the Live Preview panel on the right, or use the buttons above to
                  copy or download.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleStartOver} className="flex-1 bg-transparent">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    New
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col pb-4">
      {/* Progress Steps */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <Progress value={(currentStep / totalSteps) * 100} className="h-1 flex-1" />
          <span className="text-xs text-muted-foreground ml-3">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="flex justify-between">
          {steps.map((step) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = step.id < currentStep
            return (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                disabled={step.id > currentStep}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  isActive && "text-primary",
                  isCompleted && "text-primary cursor-pointer",
                  !isActive && !isCompleted && "text-muted-foreground opacity-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                    isActive && "border-primary bg-primary/10",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    !isActive && !isCompleted && "border-muted",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="text-[10px] font-medium hidden sm:block">{step.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto min-h-0">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t mt-4 shrink-0 pb-2">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {currentStep < totalSteps && (
          <Button onClick={handleNext} disabled={!canProceed()}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
