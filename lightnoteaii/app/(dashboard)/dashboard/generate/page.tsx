"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { KeyboardShortcutsDialog } from "@/components/dashboard/keyboard-shortcuts-dialog"
import { VersionHistoryDialog } from "@/components/dashboard/version-history-dialog"
import { ImportUrlDialog } from "@/components/dashboard/import-url-dialog"
import { DuplicateProposalDialog } from "@/components/dashboard/duplicate-proposal-dialog"
import { AddCreditsModal } from "@/components/dashboard/add-credits-modal"
import { useAutosave } from "@/hooks/use-autosave"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useCredits } from "@/lib/credit-store"
import { useProposals, type ProposalIndustry, type ProposalStatus } from "@/lib/proposal-store"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { GenerateHeaderBar } from "@/components/dashboard/generate/generate-header-bar"
import { GenerateStepper } from "@/components/dashboard/generate/generate-stepper"
import { QuickGeneratePanel } from "@/components/dashboard/generate/quick-generate-panel"
import { GuidedChatPanel } from "@/components/dashboard/generate/guided-chat-panel"
import { GenerateSidebar } from "@/components/dashboard/generate/generate-sidebar"
import type { AuditResult, ChatMessage, CollectedInfo, ExtractedFields } from "./types"
import {
  businessGoalOptions,
  budgetRanges,
  conversationSteps,
  industryOptions,
  primaryGoalOptions,
  proposalPageOptions,
  proposalTypes,
  questionConfig,
  templates,
  timelineOptions,
  toneOptions,
  websiteFeatureOptions,
  websitePageOptions,
} from "./config"

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
  const lastGeneratedFingerprintRef = useRef<string | null>(null)
  const generateAbortRef = useRef<AbortController | null>(null)
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
            field: "type",
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
          field: "type",
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
      questionConfig.templateRecommendationsByGoal?.[
        (collectedInfo.goals || "") as keyof typeof questionConfig.templateRecommendationsByGoal
      ] || []
    const recommendedByIndustry =
      questionConfig.templateRecommendationsByIndustry?.[
        (collectedInfo.clientIndustry || "") as keyof typeof questionConfig.templateRecommendationsByIndustry
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
    setAiProposal(null)
    setIsEditMode(false)
    setGeneratedContent("")
    try {
      localStorage.removeItem("proposal-ai-content")
      localStorage.removeItem("proposal_preview_data")
    } catch {
      // Ignore localStorage errors (SSR or privacy mode)
    }

    if (generatedContent) {
      setPreviousContent(generatedContent)
    }

    try {
      if (generateAbortRef.current) {
        generateAbortRef.current.abort()
      }
      generateAbortRef.current = new AbortController()
      const currentFingerprint = JSON.stringify(collectedInfo || {})
      const shouldUseExistingProposalId =
        Boolean(backendProposalId) &&
        Boolean(isAwaitingClarification) &&
        lastGeneratedFingerprintRef.current === currentFingerprint

      let payload: Record<string, any>

      const problemValue =
        (collectedInfo.problem && collectedInfo.problem.trim()) ||
        (collectedInfo.solution && collectedInfo.solution.trim()) ||
        (collectedInfo.clientCompany && collectedInfo.clientCompany.trim()) ||
        "General business proposal"

      const proposalTypeValue =
        (collectedInfo.proposalType && collectedInfo.proposalType.trim()) ||
        (collectedInfo.type && collectedInfo.type.trim()) ||
        "Service Proposal"

      const cleanFormData = {
        proposalType: proposalTypeValue,
        // Check ALL possible industry field names
        industry: collectedInfo.clientIndustry || collectedInfo.industry || collectedInfo.clientIndustry || "other",
        clientIndustry: collectedInfo.clientIndustry || collectedInfo.industry || "",
        goal: collectedInfo.goals || collectedInfo.goal || "increase_revenue",
        problem: problemValue,
        solution: collectedInfo.solution ?? "",
        budget: collectedInfo.budget ?? "",
        timeline: collectedInfo.timeline ?? "",
        proposalPages: collectedInfo.proposalPages ?? "",
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

      if (backendProposalId && isAwaitingClarification && shouldUseExistingProposalId) {
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
          formData: cleanFormData,
        }
        console.log("[v0] Mode B: Submitting clarifications", payload)
      } else if (backendProposalId && !isAwaitingClarification && shouldUseExistingProposalId) {
        // Mode C: Resume generation
        setGenerationState("generating")
        payload = {
          proposalId: backendProposalId,
          skipValidation: true,
          formData: cleanFormData,
        }
        console.log("[v0] Mode C: Resuming generation", payload)
      } else {
        // Mode A: Initial generation
        setGenerationState("creating")
        if (backendProposalId && !isAwaitingClarification) {
          setBackendProposalId(null)
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
        signal: generateAbortRef.current.signal,
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
      lastGeneratedFingerprintRef.current = currentFingerprint
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
      if (error instanceof Error && (error.name === "AbortError" || error.message.includes("aborted"))) {
        setGenerationState("idle")
        return
      }
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
      generateAbortRef.current = null
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

  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI proposal assistant. Let's create a winning proposal together. What type of proposal would you like to create?",
        timestamp: new Date(),
        options: proposalTypes,
        field: "type",
        whyAsking: questionConfig.whyAsking.type,
      }
      setCurrentStep(0)
      setMessages([initialMessage])
    }
  }, [messages.length])

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
        case "proposalPages":
          options = proposalPageOptions.map((opt) => opt.label)
          inputType = "options"
          whyAsking = questionConfig.whyAsking.proposalPages
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
    return () => {
      if (generateAbortRef.current) {
        generateAbortRef.current.abort()
      }
    }
  }, [])

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
    lastGeneratedFingerprintRef.current = null
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
    (response: string, fieldOverride?: string) => {
      let stepIndex = fieldOverride
        ? conversationSteps.findIndex((step) => step.id === fieldOverride)
        : currentStep
      if (fieldOverride && stepIndex === -1) {
        stepIndex = currentStep
      }
      const currentStepDetails = conversationSteps[stepIndex] ?? conversationSteps[currentStep]
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

        if (currentStepDetails.id === "type") {
          updates.proposalType = response
          updates.type = response
        } else if (currentStepDetails.id === "client") {
          // Store client name in both fields for compatibility
          updates.clientCompany = response
          updates.clientName = response
        } else if (currentStepDetails.id === "industry") {
          updates.clientIndustry = response
          updates.industry = response
        } else if (currentStepDetails.id === "goal") {
          updates.goals = response // Use 'goals' key
        } else if (currentStepDetails.id === "yourInfo") {
          // Handle common formats:
          // "John Smith, Acme Agency"
          // "John Smith from Acme Agency"
          // "my name is John and my company name is Acme"
          const nameMatch = response.match(/my name is\s+([^,]+?)(?:\s+and|,|$)/i)
          const companyMatch = response.match(/company name is\s+(.+)$/i)

          if (nameMatch || companyMatch) {
            const extractedName = nameMatch?.[1]?.trim()
            const extractedCompany = companyMatch?.[1]?.trim()
            if (extractedName) updates.preparedBy = extractedName
            if (extractedCompany) updates.companyName = extractedCompany
          } else {
            const parts = response.split(/,|from|at|-/).map((p) => p.trim()).filter(Boolean)
            if (parts.length >= 2) {
              updates.preparedBy = parts[0]
              updates.companyName = parts[1]
            } else {
              updates.preparedBy = response
              updates.companyName = response
            }
          }

          updates.preparedByEmail = "" // Will need separate step or can be added later
        } else if (currentStepDetails.id === "proposalPages") {
          const pageCount = Number.parseInt(response, 10)
          if (!Number.isNaN(pageCount)) {
            updates.proposalPages = pageCount
          } else {
            updates.proposalPages = undefined
          }
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

      if (!fieldOverride || stepIndex === currentStep) {
        if (currentStep < conversationSteps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }
      setInputValue("")
    },
    [currentStep, messages, collectedInfo], // Added collectedInfo dependency
  )

  const handleMultiSelectOption = useCallback((field: string, option: string) => {
    setCollectedInfo((prev) => {
      const currentSelections = (prev[field as keyof CollectedInfo] as string[]) || []
      const updatedSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option]
      return { ...prev, [field]: updatedSelections }
    })
  }, [])

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
          return (questionConfig.templateRecommendationsByIndustry?.[option]?.length ?? 0) > 0
        case "goal":
          // Check if the goal is associated with any recommended templates
          return (questionConfig.templateRecommendationsByGoal?.[option]?.length ?? 0) > 0
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
            <GenerateHeaderBar
              generationMode={generationMode}
              onModeChange={setGenerationMode}
              balance={balance}
              costPerGen={getFeatureCost("generate_proposal")}
              lastSaved={lastSaved}
              isSaving={isSaving}
              onSaveDraft={saveDraftToDatabase}
              onShowHistory={() => setShowHistory(true)}
              onShowShortcuts={() => setShowShortcuts(true)}
              onReset={resetConversation}
              showSidebar={showSidebar}
              onToggleSidebar={() => setShowSidebar((prev) => !prev)}
              onExportPdf={handleExportPDF}
              onExportWord={handleExportWord}
            />

            {generationMode === "guided" && (
              <GenerateStepper steps={conversationSteps} currentStep={currentStep} collectedInfo={collectedInfo} />
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
                    <QuickGeneratePanel
                      jobDescription={jobDescription}
                      onJobDescriptionChange={setJobDescription}
                      isExtracting={isExtracting}
                      onExtract={extractFieldsFromJobDescription}
                      showExtractedReview={showExtractedReview}
                      extractedFields={extractedFields}
                      onExtractedFieldsChange={setExtractedFields}
                      onApplyExtracted={applyExtractedAndGenerate}
                      onBackToPaste={() => setShowExtractedReview(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="guided-mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 flex flex-col min-w-0 overflow-hidden"
                  >
                    <div
                      className={`${showSidebar ? "flex-1" : "w-full"} flex flex-col min-w-0 min-h-0 ${showSidebar ? "border-r border-gray-100" : ""}`}
                    >
                      <GuidedChatPanel
                        messages={messages}
                        collectedInfo={collectedInfo}
                        isGenerating={isGenerating}
                        isAwaitingClarification={isAwaitingClarification}
                        generationState={generationState}
                        generationError={generationError}
                        currentStep={currentStep}
                        conversationSteps={conversationSteps}
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSubmitInput={() => handleUserResponse(inputValue)}
                        onGenerate={generateProposal}
                        onTemplateSelect={handleTemplateSelect}
                        onOptionSelect={handleUserResponse}
                        onMultiSelectOption={handleMultiSelectOption}
                        getSortedOptions={getSortedOptions}
                        isOptionRecommended={isOptionRecommended}
                        clarificationResponse={clarificationResponse}
                        onClarificationChange={setClarificationResponse}
                        clarificationQuestions={clarificationQuestions}
                        messagesEndRef={messagesEndRef}
                        templates={templates}
                        getRecommendedTemplates={getRecommendedTemplates}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sidebar */}
              {showSidebar && (
                <GenerateSidebar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isGenerating={isGenerating}
                  generationState={generationState}
                  generatedContent={generatedContent}
                  aiProposal={aiProposal}
                  collectedInfo={collectedInfo}
                  isEditMode={isEditMode}
                  onEditModeChange={setIsEditMode}
                  onContentChange={setGeneratedContent}
                  templates={templates}
                  getRecommendedTemplates={getRecommendedTemplates}
                  onTemplateSelect={(templateId) => {
                    setCollectedInfo((prev) => ({ ...prev, template: templateId }))
                  }}
                />
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
