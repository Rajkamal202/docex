"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { TemplatePreviewCard } from "@/components/dashboard/template-preview-card"
import {
  ArrowLeft,
  Download,
  Eye,
  Undo2,
  Redo2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layout,
  Save,
  Check,
  ZoomIn,
  ZoomOut,
  Zap,
  Target,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Cloud,
  WifiOff,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCredits } from "@/lib/credit-store"
import { AddCreditsModal } from "@/components/dashboard/add-credits-modal"
import { EditableProfessionalTemplate } from "@/components/dashboard/templates/editable-professional-template"
import { EditableCreativeTemplate } from "@/components/dashboard/templates/editable-creative-template"
import { EditableModernTemplate } from "@/components/dashboard/templates/editable-modern-template"
import { EditableClassicTemplate } from "@/components/dashboard/templates/editable-classic-template"
import { EditableBusinessTemplate } from "@/components/dashboard/templates/editable-business-template"
import { EditableProjectTemplate } from "@/components/dashboard/templates/editable-project-template"
import {
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

interface ProposalData {
  id: string
  template: string
  info: Record<string, any>
  branding: Record<string, any>
  content: string | null
  sections: {
    title?: string
    summary?: string
    problem?: string
    solution?: string
    deliverables?: string
    timeline?: string
    investment?: string
    whyUs?: string
    nextSteps?: string
    valueProposition?: string
    financialSummary?: string
  }
  aiProposal?: Record<string, any> | null
}

type ToolPanel = "ai" | "templates" | null

export default function EditorPage() {
  const router = useRouter()
  const { balance } = useCredits()
  const canvasRef = useRef<HTMLDivElement>(null)

  // Core state
  const [proposalData, setProposalData] = useState<ProposalData | null>(null)
  const [content, setContent] = useState<Record<string, string>>({})
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [activePanel, setActivePanel] = useState<ToolPanel>("ai")
  const [zoom, setZoom] = useState(75)
  const [documentName, setDocumentName] = useState("Untitled Proposal")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(5)
  const [isOnline, setIsOnline] = useState(true)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // AI enhancement state
  const [enhancingField, setEnhancingField] = useState<string | null>(null)
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false)
  const [pendingEnhancement, setPendingEnhancement] = useState<{
    id: string
    original: string
    enhanced: string
  } | null>(null)

  // History for undo/redo
  const [history, setHistory] = useState<Record<string, string>[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Online status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("proposal-editor-data")
      if (saved) {
        const data = JSON.parse(saved) as ProposalData
        setProposalData(data)
        setSelectedTemplate(data.template?.toLowerCase() || "professional")

        setDocumentName(
          data.sections?.title || data.aiProposal?.title || data.info?.proposalType || "Untitled Proposal",
        )

        const initialContent: Record<string, string> = {
          companyName: data.branding?.companyName || "Your Company",
          clientName: data.info?.clientName || "Client Name",
          clientCompany: data.info?.clientCompany || "Client Company",
          clientEmail: data.info?.clientEmail || "client@email.com",
          summary: data.sections?.summary || data.aiProposal?.summary || "",
          problem: data.sections?.problem || data.aiProposal?.problemStatement || "",
          solution: data.sections?.solution || data.aiProposal?.solution || "",
          deliverables:
            data.sections?.deliverables ||
            (Array.isArray(data.aiProposal?.deliverables)
              ? data.aiProposal.deliverables.join("\n• ")
              : data.aiProposal?.deliverables) ||
            "",
          timeline: data.sections?.timeline || data.aiProposal?.timeline || data.info?.timeline || "",
          budget: data.sections?.investment || data.aiProposal?.investment || data.info?.budget || "",
          whyUs: data.sections?.whyUs || data.aiProposal?.whyUs || "",
          nextSteps:
            data.sections?.nextSteps ||
            (Array.isArray(data.aiProposal?.nextSteps)
              ? data.aiProposal.nextSteps.join("\n• ")
              : data.aiProposal?.nextSteps) ||
            "",
          valueProposition: data.sections?.valueProposition || data.aiProposal?.marketOpportunity || "",
          financialSummary: data.sections?.financialSummary || data.aiProposal?.financialSummary || "",
          titleLine1:
            data.sections?.title?.split(" ")[0]?.toUpperCase() ||
            data.aiProposal?.title?.split(" ")[0]?.toUpperCase() ||
            "BUSINESS",
          titleLine2:
            data.sections?.title?.split(" ").slice(1).join(" ")?.toUpperCase() ||
            data.aiProposal?.title?.split(" ").slice(1).join(" ")?.toUpperCase() ||
            "PROPOSAL",
        }

        setContent(initialContent)
        setHistory([initialContent])
        setHistoryIndex(0)
      } else {
        const emptyContent: Record<string, string> = {
          companyName: "Your Company",
          clientName: "Client Name",
          clientCompany: "Client Company",
          clientEmail: "client@email.com",
          summary: "No proposal loaded. Please generate a proposal first from the Generate Proposal page.",
          problem: "",
          solution: "",
          deliverables: "",
          timeline: "",
          budget: "",
          whyUs: "",
          nextSteps: "",
          valueProposition: "",
          financialSummary: "",
          titleLine1: "NO",
          titleLine2: "PROPOSAL",
        }
        setContent(emptyContent)
        setHistory([emptyContent])
        setHistoryIndex(0)
      }
    } catch (error) {
      console.error("Error loading proposal data:", error)
    }
  }, [])

  const handleContentChange = useCallback(
    (id: string, value: string) => {
      setContent((prev) => {
        const newContent = { ...prev, [id]: value }
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newContent)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
        return newContent
      })
    },
    [history, historyIndex],
  )

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const dataToSave = {
        ...proposalData,
        sections: content,
        template: selectedTemplate,
      }
      localStorage.setItem("proposal-editor-data", JSON.stringify(dataToSave))
      setLastSaved(new Date())
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }, [proposalData, content, selectedTemplate])

  const handleExport = useCallback(() => {
    window.print()
  }, [])

  const handleEnhance = useCallback(
    async (fieldId: string, enhanceType: string) => {
      const currentValue = content[fieldId]
      if (!currentValue) return

      setEnhancingField(fieldId)
      try {
        const response = await fetch("/api/enhance-section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: currentValue,
            enhanceType,
            sectionType: fieldId,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setPendingEnhancement({
            id: fieldId,
            original: currentValue,
            enhanced: data.enhanced,
          })
          setShowEnhanceDialog(true)
        }
      } catch (error) {
        console.error("Enhancement failed:", error)
      } finally {
        setEnhancingField(null)
      }
    },
    [content],
  )

  const applyEnhancement = useCallback(() => {
    if (pendingEnhancement) {
      handleContentChange(pendingEnhancement.id, pendingEnhancement.enhanced)
      setShowEnhanceDialog(false)
      setPendingEnhancement(null)
    }
  }, [pendingEnhancement, handleContentChange])

  const templates = [
    { id: "professional", name: "Professional", color: "#1e3a5f", description: "Clean and corporate" },
    { id: "modern", name: "Modern", color: "#0f766e", description: "Contemporary design" },
    { id: "creative", name: "Creative", color: "#7c3aed", description: "Bold and unique" },
    { id: "classic", name: "Classic", color: "#374151", description: "Traditional business" },
    { id: "business", name: "Business", color: "#1e40af", description: "Formal enterprise" },
    { id: "project", name: "Project", color: "#059669", description: "Multi-page project" },
    { id: "startup", name: "Startup", color: "#6366f1", description: "Modern SaaS pitch" },
    { id: "marketing", name: "Marketing", color: "#f97316", description: "Campaign focused" },
    { id: "technical", name: "Technical", color: "#1e293b", description: "Developer focused" },
    { id: "consulting", name: "Consulting", color: "#b45309", description: "Expert advisory" },
    { id: "executive", name: "Executive", color: "#0c4a6e", description: "C-suite ready" },
    { id: "minimal", name: "Minimal", color: "#6b7280", description: "Clean whitespace" },
    { id: "agency", name: "Agency", color: "#ec4899", description: "Creative services" },
    { id: "enterprise", name: "Enterprise", color: "#1e3a8a", description: "Large organization" },
    { id: "financial", name: "Financial", color: "#166534", description: "Investment focused" },
    { id: "partnership", name: "Partnership", color: "#0891b2", description: "Joint ventures" },
  ]

  const tocSections = [
    { id: 1, name: "Cover Page" },
    { id: 2, name: "Executive Summary" },
    { id: 3, name: "Problem & Solution" },
    { id: 4, name: "Timeline & Investment" },
    { id: 5, name: "Why Choose Us" },
  ]

  const aiEnhancements = [
    { id: "professional", label: "More Professional", icon: Target, description: "Formal business tone" },
    { id: "persuasive", label: "More Persuasive", icon: TrendingUp, description: "Compelling language" },
    { id: "expand", label: "Expand Content", icon: MessageSquare, description: "Add more detail" },
    { id: "concise", label: "Make Concise", icon: Zap, description: "Shorter and clearer" },
    { id: "clarity", label: "Improve Clarity", icon: Lightbulb, description: "Easier to understand" },
  ]

  const safeBalance = typeof balance === "number" ? balance : 0

  const renderTemplate = () => {
    const editableProps = {
      content,
      onChange: handleContentChange,
      onEnhance: handleEnhance,
      enhancingField,
      currentDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }

    // Props for regular templates (10 new ones)
    const regularProps = {
      isFullPreview: true,
      safeInfo: {
        proposalType: proposalData?.info?.proposalType || "Business Proposal",
        clientName: proposalData?.info?.clientName || "Client Name",
        clientCompany: proposalData?.info?.clientCompany || "Client Company",
        clientEmail: proposalData?.info?.clientEmail || "",
        industry: proposalData?.info?.industry || "Technology",
        problem: content.problem || proposalData?.sections?.problem || "",
        deliverables: content.deliverables || proposalData?.sections?.deliverables || "",
        timeline: content.timeline || proposalData?.sections?.timeline || "",
        budget: proposalData?.info?.budget || "",
        tone: proposalData?.info?.tone || "professional",
        uniqueValue: proposalData?.info?.uniqueValue || "",
        logo: proposalData?.info?.logo || "",
        images: proposalData?.info?.images || [],
      },
      safeBranding: {
        companyName: proposalData?.branding?.companyName || "Your Company",
        primaryColor: proposalData?.branding?.primaryColor || "#1e3a5f",
        fontFamily: proposalData?.branding?.fontFamily || "Inter",
      },
      sections: {
        title: content.title || proposalData?.sections?.title || "Business Proposal",
        summary: content.summary || proposalData?.sections?.summary || "",
        problem: content.problem || proposalData?.sections?.problem || "",
        solution: content.solution || proposalData?.sections?.solution || "",
        deliverables: content.deliverables || proposalData?.sections?.deliverables || "",
        timeline: content.timeline || proposalData?.sections?.timeline || "",
        investment: content.investment || proposalData?.sections?.investment || "",
        whyUs: content.whyUs || proposalData?.sections?.whyUs || "",
        nextSteps: content.nextSteps || proposalData?.sections?.nextSteps || "",
      },
      currentDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }

    switch (selectedTemplate) {
      case "professional":
        return <EditableProfessionalTemplate {...editableProps} />
      case "creative":
        return <EditableCreativeTemplate {...editableProps} />
      case "modern":
        return <EditableModernTemplate {...editableProps} />
      case "classic":
        return <EditableClassicTemplate {...editableProps} />
      case "business":
        return <EditableBusinessTemplate {...editableProps} />
      case "project":
        return <EditableProjectTemplate {...editableProps} />
      case "startup":
        return <StartupTemplate {...regularProps} />
      case "marketing":
        return <MarketingTemplate {...regularProps} />
      case "technical":
        return <TechnicalTemplate {...regularProps} />
      case "consulting":
        return <ConsultingTemplate {...regularProps} />
      case "executive":
        return <ExecutiveTemplate {...regularProps} />
      case "minimal":
        return <MinimalTemplate {...regularProps} />
      case "agency":
        return <AgencyTemplate {...regularProps} />
      case "enterprise":
        return <EnterpriseTemplate {...regularProps} />
      case "financial":
        return <FinancialTemplate {...regularProps} />
      case "partnership":
        return <PartnershipTemplate {...regularProps} />
      default:
        return <EditableProfessionalTemplate {...editableProps} />
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-[#1a1a1a] text-white overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => router.push("/dashboard/generate")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="h-6 w-px bg-white/20" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: templates.find((t) => t.id === selectedTemplate)?.color || "#1e3a5f" }}
                  />
                  {templates.find((t) => t.id === selectedTemplate)?.name || "Professional"}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#2a2a2a] border-white/10">
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: template.color }} />
                    {template.name}
                    {selectedTemplate === template.id && <Check className="h-3 w-3 ml-auto" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-white/20" />

            <Input
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-48 h-8 bg-transparent border-none text-white text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Save status */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
              {isOnline ? (
                <>
                  <Cloud className="h-3 w-3" />
                  {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Not saved"}
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-amber-500" />
                  <span className="text-amber-500">Offline</span>
                </>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {isPreviewMode ? "Edit" : "Preview"}
            </Button>

            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </header>

        {/* Toolbar */}
        <div className="h-12 border-b border-white/10 bg-[#222] flex items-center px-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          <div className="h-6 w-px bg-white/20 mx-2" />

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setZoom(Math.max(25, zoom - 10))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-400 w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-white/10 bg-[#1a1a1a] flex flex-col flex-shrink-0">
            {/* Tool tabs */}
            <div className="flex border-b border-white/10">
              <button
                className={cn(
                  "flex-1 py-3 text-xs font-medium transition-colors",
                  activePanel === "ai" ? "text-white bg-white/10" : "text-gray-500 hover:text-gray-300",
                )}
                onClick={() => setActivePanel("ai")}
              >
                <Sparkles className="h-4 w-4 mx-auto mb-1" />
                AI Tools
              </button>
              <button
                className={cn(
                  "flex-1 py-3 text-xs font-medium transition-colors",
                  activePanel === "templates" ? "text-white bg-white/10" : "text-gray-500 hover:text-gray-300",
                )}
                onClick={() => setActivePanel("templates")}
              >
                <Layout className="h-4 w-4 mx-auto mb-1" />
                Templates
              </button>
            </div>

            {/* Panel content */}
            <ScrollArea className="flex-1 h-0">
              {activePanel === "ai" && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-gray-500">
                    {selectedElementId
                      ? "Select an enhancement for the selected text"
                      : "Click on any text in the editor to enhance it"}
                  </p>
                  {aiEnhancements.map((enhancement) => (
                    <button
                      key={enhancement.id}
                      className={cn(
                        "w-full p-3 rounded-lg text-left transition-all",
                        selectedElementId
                          ? "bg-white/5 hover:bg-white/10 cursor-pointer"
                          : "bg-white/5 opacity-50 cursor-not-allowed",
                      )}
                      onClick={() => selectedElementId && handleEnhance(selectedElementId, enhancement.id)}
                      disabled={!selectedElementId || enhancingField === selectedElementId}
                    >
                      <div className="flex items-center gap-2">
                        <enhancement.icon className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-white">{enhancement.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{enhancement.description}</p>
                    </button>
                  ))}

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-500">Credits: ${safeBalance.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Each enhancement costs $0.50</p>
                  </div>
                </div>
              )}

              {activePanel === "templates" && (
                <div className="p-4 space-y-3">
                  <p className="text-xs text-gray-400">Select a template to change the proposal layout and design</p>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <TemplatePreviewCard
                        key={template.id}
                        templateId={template.id}
                        templateName={template.name}
                        description={template.description}
                        color={template.color}
                        isSelected={selectedTemplate === template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-[#2a2a2a] overflow-auto p-8">
            <div
              ref={canvasRef}
              className="mx-auto bg-white shadow-2xl transition-transform origin-top"
              style={{
                width: "816px",
                minHeight: "1056px",
                transform: `scale(${zoom / 100})`,
              }}
            >
              {renderTemplate()}
            </div>
          </div>

          {/* Right Sidebar */}
          {showRightPanel && (
            <div className="w-64 border-l border-white/10 bg-[#1a1a1a] flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm font-medium text-white mb-3">Table of Contents</h3>
                <div className="space-y-1">
                  {tocSections.map((section) => (
                    <button
                      key={section.id}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                        currentPage === section.id
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white",
                      )}
                      onClick={() => setCurrentPage(section.id)}
                    >
                      <span className="text-xs text-gray-600 mr-2">{section.id}</span>
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 mt-auto border-t border-white/10">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-400">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhancement Dialog */}
        <Dialog open={showEnhanceDialog} onOpenChange={setShowEnhanceDialog}>
          <DialogContent className="bg-[#2a2a2a] border-white/10 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Enhancement Preview</DialogTitle>
              <DialogDescription className="text-gray-400">
                Review the enhanced content before applying
              </DialogDescription>
            </DialogHeader>

            {pendingEnhancement && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Original</h4>
                  <div className="p-3 bg-white/5 rounded-lg text-sm text-gray-300 max-h-64 overflow-auto">
                    {pendingEnhancement.original}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-emerald-400 mb-2">Enhanced</h4>
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-sm text-white max-h-64 overflow-auto">
                    {pendingEnhancement.enhanced}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowEnhanceDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button onClick={applyEnhancement} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                Apply Enhancement
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Credits Modal */}
        <AddCreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
      </div>
    </TooltipProvider>
  )
}
