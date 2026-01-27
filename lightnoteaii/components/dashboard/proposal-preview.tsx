"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Minimize2,
  Move,
  Hand,
  RotateCcw,
  Edit3,
  Download,
  Loader2,
} from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ClassicTemplate,
  ProfessionalTemplate,
  ModernTemplate,
  BusinessTemplate,
  ProjectTemplate,
  CreativeTemplate,
  ClientTemplate,
  clientTemplatePages,
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
} from "./templates"

interface ProposalPreviewProps {
  generatedContent?: string
  previousContent?: string
  isGenerating?: boolean
  collectedInfo: {
    proposalType?: string
    template?: string
    clientName?: string
    clientCompany?: string
    clientEmail?: string
    clientWebsite?: string
    clientPhone?: string
    clientAddress?: string
    industry?: string
    problem?: string
    deliverables?: string
    timeline?: string
    budget?: string
    tone?: string
    uniqueValue?: string
    logo?: string
    images?: string[]
    preparedBy?: string
    preparedByEmail?: string
    summary?: string
    solution?: string
    websitePages?: string
    websiteFeatures?: string[]
    primaryAction?: string
  }
  branding?: {
    companyName: string
    primaryColor?: string
    fontFamily?: string
    preparedBy?: string
    email?: string
    website?: string
    phone?: string
    address?: string
  }
  onRegenerate?: () => void
  aiProposal?: any // Added aiProposal prop
  isEditMode?: boolean
  setIsEditMode?: (value: boolean) => void
  onContentChange?: (content: string) => void
}

export function ProposalPreview({
  generatedContent,
  previousContent,
  isGenerating,
  collectedInfo,
  branding,
  onRegenerate,
  aiProposal,
  isEditMode,
  setIsEditMode,
  onContentChange,
}: ProposalPreviewProps) {
  const router = useRouter() // Add router for navigation to editor
  const [zoom, setZoom] = useState(50)
  const [copied, setCopied] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)
  const [showWatermark, setShowWatermark] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isDragMode, setIsDragMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 })

  const [aiSections, setAiSections] = useState<{ [key: string]: string } | null>(null)

  const safeInfo = {
    proposalType: collectedInfo?.proposalType || "Business Proposal",
    template: collectedInfo?.template || "professional",
    clientName: collectedInfo?.clientName || "",
    clientCompany: collectedInfo?.clientCompany || "",
    clientEmail: collectedInfo?.clientEmail || "",
    clientWebsite: collectedInfo?.clientWebsite || "",
    clientPhone: collectedInfo?.clientPhone || "",
    clientAddress: collectedInfo?.clientAddress || "",
    industry: collectedInfo?.industry || "",
    problem: aiProposal?.problemStatement || collectedInfo?.problem || "",
    solution: aiProposal?.solution || collectedInfo?.solution || "",
    summary: aiProposal?.summary || collectedInfo?.summary || "",
    deliverables: aiProposal?.deliverables || collectedInfo?.deliverables || [],
    timeline: aiProposal?.timeline || collectedInfo?.timeline || "",
    budget: aiProposal?.investment || collectedInfo?.budget || "",
    tone: collectedInfo?.tone || "professional",
    uniqueValue: collectedInfo?.uniqueValue || "",
    logo: collectedInfo?.logo || "",
    images: collectedInfo?.images || [],
    preparedBy: collectedInfo?.preparedBy || "",
    preparedByEmail: collectedInfo?.preparedByEmail || "",
    whyUs: aiProposal?.whyUs || "",
    nextSteps: aiProposal?.nextSteps || [],
    investment: aiProposal?.investment || collectedInfo?.budget || "",
    websitePages: collectedInfo?.websitePages || "",
    websiteFeatures: collectedInfo?.websiteFeatures || [],
    primaryAction: collectedInfo?.primaryAction || "",
  }

  const safeBranding = {
    companyName: branding?.companyName && branding.companyName.trim() !== "" ? branding.companyName : "",
    primaryColor: branding?.primaryColor || "#2563eb",
    fontFamily: branding?.fontFamily || "Arial, sans-serif",
    preparedBy: branding?.preparedBy && branding.preparedBy.trim() !== "" ? branding.preparedBy : "",
    email: branding?.email && branding.email.trim() !== "" ? branding.email : "",
    website: branding?.website || "",
    phone: branding?.phone || "",
    address: branding?.address || "",
  }

  const templateProps = {
    collectedInfo,
    branding,
    safeInfo,
    safeBranding,
    sections: aiSections,
    aiProposal, // Pass aiProposal directly to template
    currentDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }

  useEffect(() => {
    const loadAiSections = () => {
      try {
        if (aiProposal && Object.keys(aiProposal).length > 0) {
          setAiSections({
            TITLE: aiProposal.title || "",
            "EXECUTIVE SUMMARY": aiProposal.summary || "",
            "PROBLEM STATEMENT": aiProposal.problemStatement || "",
            "PROPOSED SOLUTION": aiProposal.solution || "",
            DELIVERABLES: Array.isArray(aiProposal.deliverables)
              ? aiProposal.deliverables.join("\n• ")
              : aiProposal.deliverables || "",
            TIMELINE: aiProposal.timeline || "",
            INVESTMENT: aiProposal.investment || "",
            "WHY CHOOSE US": aiProposal.whyUs || "",
            "NEXT STEPS": Array.isArray(aiProposal.nextSteps)
              ? aiProposal.nextSteps.join("\n• ")
              : aiProposal.nextSteps || "",
            "VALUE PROPOSITION": aiProposal.marketOpportunity || aiProposal.valueProposition || "",
            "FINANCIAL SUMMARY": aiProposal.financialSummary || "",
            // Also set lowercase versions for template compatibility
            summary: aiProposal.summary || "",
            problem: aiProposal.problemStatement || "",
            solution: aiProposal.solution || "",
            deliverables: Array.isArray(aiProposal.deliverables) ? aiProposal.deliverables : [],
            timeline: aiProposal.timeline || "",
            investment: aiProposal.investment || "",
            whyUs: aiProposal.whyUs || "",
            nextSteps: Array.isArray(aiProposal.nextSteps) ? aiProposal.nextSteps : [],
          })
          return
        }

        // First try proposal-ai-content (primary source)
        const aiContent = localStorage.getItem("proposal-ai-content")
        if (aiContent) {
          const parsed = JSON.parse(aiContent)
          if (parsed?.aiProposal) {
            const ai = parsed.aiProposal
            setAiSections({
              TITLE: ai.title || "",
              "EXECUTIVE SUMMARY": ai.summary || "",
              "PROBLEM STATEMENT": ai.problemStatement || "",
              "PROPOSED SOLUTION": ai.solution || "",
              DELIVERABLES: Array.isArray(ai.deliverables) ? ai.deliverables.join("\n• ") : ai.deliverables || "",
              TIMELINE: ai.timeline || "",
              INVESTMENT: ai.investment || "",
              "WHY CHOOSE US": ai.whyUs || "",
              "NEXT STEPS": Array.isArray(ai.nextSteps) ? ai.nextSteps.join("\n• ") : ai.nextSteps || "",
              "VALUE PROPOSITION": ai.marketOpportunity || ai.valueProposition || "",
              "FINANCIAL SUMMARY": ai.financialSummary || "",
              // Also set lowercase versions for template compatibility
              summary: ai.summary || "",
              problem: ai.problemStatement || "",
              solution: ai.solution || "",
              deliverables: Array.isArray(ai.deliverables) ? ai.deliverables : [],
              timeline: ai.timeline || "",
              investment: ai.investment || "",
              whyUs: ai.whyUs || "",
              nextSteps: Array.isArray(ai.nextSteps) ? ai.nextSteps : [],
            })
            return
          }
        }

        // Fallback: try proposal-editor-data
        const editorData = localStorage.getItem("proposal-editor-data")
        if (editorData) {
          const parsed = JSON.parse(editorData)
          if (parsed?.sections) {
            setAiSections({
              TITLE: parsed.sections.title || "",
              "EXECUTIVE SUMMARY": parsed.sections.summary || "",
              "PROBLEM STATEMENT": parsed.sections.problem || "",
              "PROPOSED SOLUTION": parsed.sections.solution || "",
              DELIVERABLES: parsed.sections.deliverables || "",
              TIMELINE: parsed.sections.timeline || "",
              INVESTMENT: parsed.sections.investment || "",
              "WHY CHOOSE US": parsed.sections.whyUs || "",
              "NEXT STEPS": parsed.sections.nextSteps || "",
              "VALUE PROPOSITION": parsed.sections.valueProposition || "",
              "FINANCIAL SUMMARY": parsed.sections.financialSummary || "",
            })
            return
          }
        }

        // Fallback: try to parse markdown from generatedContent
        const content = generatedContent || previousContent
        if (content) {
          const sections: { [key: string]: string } = {}
          const sectionRegex = /##\s*([A-Z\s]+)\n([\s\S]*?)(?=##\s*[A-Z]|$)/gi
          let match
          while ((match = sectionRegex.exec(content)) !== null) {
            const title = match[1].trim().toUpperCase()
            const sectionContent = match[2].trim()
            sections[title] = sectionContent
          }
          if (Object.keys(sections).length > 0) {
            setAiSections(sections)
          }
        }
      } catch (e) {
        console.error("[v0] Failed to load AI sections:", e)
      }
    }

    loadAiSections()

    // Also listen for storage changes (when new proposal is generated)
    const handleStorageChange = () => loadAiSections()
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [generatedContent, previousContent, aiProposal])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragMode) return
      e.preventDefault()
      setIsDragging(true)
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
      }
    },
    [isDragMode, position, isDragging], // Added isDragging dependency
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return
      const newX = e.clientX - dragStartRef.current.x + dragStartRef.current.posX
      const newY = e.clientY - dragStartRef.current.y + dragStartRef.current.posY
      setPosition({ x: newX, y: newY })
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleResetPosition = () => {
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [])

  const calculateFitZoom = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48 // padding
      const containerHeight = containerRef.current.clientHeight - 48
      const pageWidth = 210 * 3.78 // A4 width in px (210mm)
      const pageHeight = 297 * 3.78 // A4 height in px
      const fitWidth = (containerWidth / pageWidth) * 100
      const fitHeight = (containerHeight / pageHeight) * 100
      return Math.min(fitWidth, fitHeight, 100)
    }
    return 55
  }, [])

  const handleFitZoom = () => {
    setZoom(Math.round(calculateFitZoom()))
  }

  const prepareElementForExport = (element: HTMLElement): HTMLElement => {
    const clone = element.cloneNode(true) as HTMLElement
    const processStyles = (el: HTMLElement) => {
      const computed = window.getComputedStyle(el)
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext("2d")

      const convertColor = (color: string): string => {
        if (!color || color === "transparent" || color === "none" || color === "inherit") {
          return color
        }
        if (ctx) {
          ctx.fillStyle = "#000000"
          ctx.fillStyle = color
          const result = ctx.fillStyle
          if (result.startsWith("#")) {
            return result
          }
        }
        if (color.includes("oklch")) {
          const match = color.match(/oklch\(\s*([\d.]+)/)
          if (match) {
            const lightness = Number.parseFloat(match[1])
            if (lightness > 0.5) return "#ffffff"
            return "#000000"
          }
        }
        return color
      }

      const bgColor = computed.backgroundColor
      const textColor = computed.color
      const borderColor = computed.borderColor

      if (bgColor && bgColor.includes("oklch")) {
        el.style.backgroundColor = convertColor(bgColor)
      }
      if (textColor && textColor.includes("oklch")) {
        el.style.color = convertColor(textColor)
      }
      if (borderColor && borderColor.includes("oklch")) {
        el.style.borderColor = convertColor(borderColor)
      }
    }

    const allElements = clone.querySelectorAll("*")
    processStyles(clone)
    allElements.forEach((el) => processStyles(el as HTMLElement))

    return clone
  }

  const isMultiPage = safeInfo.template === "project" || safeInfo.template === "client"
  const totalPages = safeInfo.template === "project" ? 4 : safeInfo.template === "client" ? clientTemplatePages : 1

  const handleCopy = async () => {
    const textContent = previewRef.current?.innerText || generatedContent || ""
    await navigator.clipboard.writeText(textContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    setIsExporting(true)

    try {
      const [html2canvasModule, jsPDFModule] = await Promise.all([import("html2canvas"), import("jspdf")])
      const html2canvas = html2canvasModule.default
      const { jsPDF } = jsPDFModule

      const element = exportRef.current || previewRef.current
      if (!element) {
        throw new Error("Export element not found")
      }

      const captureOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: false,
        removeContainer: true,
        imageTimeout: 0,
        ignoreElements: (el: Element) => {
          return el.tagName === "STYLE" || el.tagName === "LINK"
        },
      }

      // PDF export
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      if (isMultiPage) {
        const originalPage = currentPage

        for (let page = 1; page <= totalPages; page++) {
          setCurrentPage(page)
          await new Promise((resolve) => setTimeout(resolve, 200))

          const pageElement = exportRef.current || previewRef.current
          if (!pageElement) continue

          const preparedClone = prepareElementForExport(pageElement)
          preparedClone.style.position = "absolute"
          preparedClone.style.left = "-9999px"
          preparedClone.style.top = "0"
          preparedClone.style.width = `${pageElement.offsetWidth}px`
          document.body.appendChild(preparedClone)

          try {
            const canvas = await html2canvas(preparedClone, captureOptions)
            const imgData = canvas.toDataURL("image/png")
            const imgWidth = pdfWidth
            const imgHeight = (canvas.height * pdfWidth) / canvas.width

            if (page > 1) {
              pdf.addPage()
            }

            const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0
            pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, Math.min(imgHeight, pdfHeight))
          } finally {
            document.body.removeChild(preparedClone)
          }
        }

        setCurrentPage(originalPage)
      } else {
        const preparedClone = prepareElementForExport(element)
        preparedClone.style.position = "absolute"
        preparedClone.style.left = "-9999px"
        preparedClone.style.top = "0"
        preparedClone.style.width = `${element.offsetWidth}px`
        document.body.appendChild(preparedClone)

        try {
          const canvas = await html2canvas(preparedClone, captureOptions)
          const imgData = canvas.toDataURL("image/png")
          const imgWidth = pdfWidth
          const imgHeight = (canvas.height * pdfWidth) / canvas.width

          const totalPdfPages = Math.ceil(imgHeight / pdfHeight)

          for (let pageNum = 0; pageNum < totalPdfPages; pageNum++) {
            if (pageNum > 0) {
              pdf.addPage()
            }

            // Calculate the y position in the source image for this page
            const sourceY = (pageNum * pdfHeight * canvas.width) / pdfWidth
            const sourceHeight = Math.min((pdfHeight * canvas.width) / pdfWidth, canvas.height - sourceY)

            // Create a temporary canvas for this page slice
            const pageCanvas = document.createElement("canvas")
            pageCanvas.width = canvas.width
            pageCanvas.height = sourceHeight
            const ctx = pageCanvas.getContext("2d")

            if (ctx) {
              ctx.drawImage(
                canvas,
                0,
                sourceY, // source x, y
                canvas.width,
                sourceHeight, // source width, height
                0,
                0, // destination x, y
                canvas.width,
                sourceHeight, // destination width, height
              )

              const pageImgData = pageCanvas.toDataURL("image/png")
              const pageImgHeight = (sourceHeight * pdfWidth) / canvas.width

              pdf.addImage(pageImgData, "PNG", 0, 0, imgWidth, pageImgHeight)
            }
          }
        } finally {
          document.body.removeChild(preparedClone)
        }
      }

      const fileName = `${safeInfo.proposalType.replace(/\s+/g, "-")}-Proposal.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Export failed:", error)
      // Fallback to text
      const textContent = previewRef.current?.innerText || generatedContent || ""
      const blob = new Blob([textContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${safeInfo.proposalType.replace(/\s+/g, "-")}-Proposal.txt`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPNG = async () => {
    setIsExporting(true)
    try {
      const html2canvasModule = await import("html2canvas")
      const html2canvas = html2canvasModule.default

      const element = exportRef.current
      if (!element) {
        throw new Error("Export element not found")
      }

      const captureOptions = {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        foreignObjectRendering: false,
        removeContainer: true,
        imageTimeout: 0,
        ignoreElements: (el: Element) => {
          return el.tagName === "STYLE" || el.tagName === "LINK"
        },
      }

      const preparedClone = prepareElementForExport(element)
      preparedClone.style.position = "absolute"
      preparedClone.style.left = "-9999px"
      preparedClone.style.top = "0"
      preparedClone.style.width = `${element.offsetWidth}px`
      document.body.appendChild(preparedClone)

      try {
        const canvas = await html2canvas(preparedClone, captureOptions)
        const link = document.createElement("a")
        link.download = `${safeInfo.proposalType.replace(/\s+/g, "-")}-Proposal.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      } finally {
        document.body.removeChild(preparedClone)
      }
    } catch (error) {
      console.error("PNG export failed:", error)
      // Optionally show an error message to the user
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    const printContent = exportRef.current
    if (!printContent) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeInfo.proposalType} Proposal</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const renderTemplate = (isFullPreview = false) => {
    const props = { ...templateProps, isFullPreview }

    switch (safeInfo.template) {
      case "classic":
        return <ClassicTemplate {...props} />
      case "professional":
        return <ProfessionalTemplate {...props} />
      case "modern":
        return <ModernTemplate {...props} />
      case "business":
        return <BusinessTemplate {...props} />
      case "project":
        return <ProjectTemplate {...props} currentPage={currentPage} />
      case "creative":
        return <CreativeTemplate {...props} />
      case "client":
        return <ClientTemplate {...props} currentPage={currentPage} />
      case "startup":
        return <StartupTemplate {...props} />
      case "marketing":
        return <MarketingTemplate {...props} />
      case "technical":
        return <TechnicalTemplate {...props} />
      case "consulting":
        return <ConsultingTemplate {...props} />
      case "executive":
        return <ExecutiveTemplate {...props} />
      case "minimal":
        return <MinimalTemplate {...props} />
      case "agency":
        return <AgencyTemplate {...props} />
      case "enterprise":
        return <EnterpriseTemplate {...props} />
      case "financial":
        return <FinancialTemplate {...props} />
      case "partnership":
        return <PartnershipTemplate {...props} />
      default:
        return <ProfessionalTemplate {...props} />
    }
  }

  const scale = zoom / 100

  const LoadingSkeleton = () => (
    <div className="w-full max-w-[210mm] mx-auto bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
      <div className="p-8 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="space-y-2 mt-8">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="space-y-2 mt-6">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-4/6" />
        </div>
      </div>
    </div>
  )

  const handleEditClick = () => {
    let storedAiProposal = null
    try {
      const stored = localStorage.getItem("proposal-ai-content")
      if (stored) {
        storedAiProposal = JSON.parse(stored)
      }
    } catch (e) {
      console.error("Failed to parse stored AI proposal:", e)
    }

    const ai = storedAiProposal?.aiProposal
    const mappedSections = ai
      ? {
          title: ai.title || aiSections?.TITLE || "",
          summary: ai.summary || aiSections?.["EXECUTIVE SUMMARY"] || "",
          problem: ai.problemStatement || aiSections?.["PROBLEM STATEMENT"] || "",
          solution: ai.solution || aiSections?.["PROPOSED SOLUTION"] || "",
          deliverables: Array.isArray(ai.deliverables)
            ? ai.deliverables.join("\n• ")
            : ai.deliverables || aiSections?.DELIVERABLES || "",
          timeline: ai.timeline || aiSections?.TIMELINE || "",
          investment: ai.investment || aiSections?.INVESTMENT || "",
          whyUs: ai.whyUs || aiSections?.["WHY CHOOSE US"] || "",
          nextSteps: Array.isArray(ai.nextSteps)
            ? ai.nextSteps.join("\n• ")
            : ai.nextSteps || aiSections?.["NEXT STEPS"] || "",
          valueProposition: ai.marketOpportunity || ai.valueProposition || aiSections?.["VALUE PROPOSITION"] || "",
          financialSummary: ai.financialSummary || aiSections?.["FINANCIAL SUMMARY"] || "",
        }
      : {
          title: aiSections?.TITLE || "",
          summary: aiSections?.["EXECUTIVE SUMMARY"] || "",
          problem: aiSections?.["PROBLEM STATEMENT"] || "",
          solution: aiSections?.["PROPOSED SOLUTION"] || "",
          deliverables: aiSections?.DELIVERABLES || "",
          timeline: aiSections?.TIMELINE || "",
          investment: aiSections?.INVESTMENT || "",
          whyUs: aiSections?.["WHY CHOOSE US"] || "",
          nextSteps: aiSections?.["NEXT STEPS"] || "",
          valueProposition: aiSections?.["VALUE PROPOSITION"] || "",
          financialSummary: aiSections?.["FINANCIAL SUMMARY"] || "",
        }

    const editorData = {
      id: storedAiProposal?.proposalId || `proposal-${Date.now()}`,
      template: safeInfo.template,
      info: safeInfo,
      branding: safeBranding,
      content: generatedContent || null,
      sections: mappedSections, // Use mapped sections with correct keys
      aiProposal: storedAiProposal?.aiProposal || null,
    }
    localStorage.setItem("proposal-editor-data", JSON.stringify(editorData))
    window.location.href = "/dashboard/editor"
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-200 relative">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-3 space-y-2 flex-shrink-0">
          {/* Row 1: Title and Template Badge */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-indigo-100">
              <Eye className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Live Preview</span>
            <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full capitalize">
              {safeInfo.template}
            </span>
            <Button
              size="sm"
              variant="outline"
              className={`ml-auto h-7 px-2.5 gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 bg-transparent ${isGenerating ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleEditClick}
              disabled={isGenerating}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Edit & Enhance</span>
            </Button>
          </div>

          {/* Row 2: Controls - Full View prominently placed here */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 min-w-0">
            <div className="flex items-center gap-2 flex-nowrap min-w-max">
              <Button
                size="sm"
                className="h-8 px-3 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex-shrink-0"
                onClick={() => {
                  setIsFullscreen(true)
                }}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Full View</span>
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-8 px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex-shrink-0"
                    onClick={handleDownload}
                    disabled={isExporting || !generatedContent}
                  >
                    {isExporting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    <span className="text-xs font-medium">{isExporting ? "Exporting..." : "Download PDF"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download proposal as PDF</TooltipContent>
              </Tooltip>

              <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

              {/* Pan/Drag Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isDragMode ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-2.5 gap-1.5 flex-shrink-0 ${
                      isDragMode
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                    onClick={() => {
                      setIsDragMode(!isDragMode)
                      if (isDragMode) {
                        setIsDragging(false)
                      }
                    }}
                  >
                    <Hand className="h-3.5 w-3.5" />
                    <span className="text-xs">{isDragMode ? "Pan On" : "Pan"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click and drag to move the preview</TooltipContent>
              </Tooltip>

              {/* Reset Position */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 border-gray-300 hover:border-indigo-400 bg-transparent flex-shrink-0"
                    onClick={handleResetPosition}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Position</TooltipContent>
              </Tooltip>

              {/* Watermark Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showWatermark ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 p-0 flex-shrink-0 ${
                      showWatermark
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "border-gray-300 hover:border-amber-400"
                    }`}
                    onClick={() => setShowWatermark(!showWatermark)}
                  >
                    {showWatermark ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{showWatermark ? "Hide Watermark" : "Show Watermark"}</TooltipContent>
              </Tooltip>

              <div className="w-px h-6 bg-gray-200 flex-shrink-0" />

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-gray-300 bg-transparent"
                  onClick={() => setZoom(Math.max(25, zoom - 10))}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-medium text-gray-600 w-10 text-center">{zoom}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-gray-300 bg-transparent"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Zoom Presets */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {[50, 75, 100].map((preset) => (
                  <Button
                    key={preset}
                    variant={zoom === preset ? "default" : "outline"}
                    size="sm"
                    className={`h-7 px-2 text-xs ${
                      zoom === preset
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}
                    onClick={() => setZoom(preset)}
                  >
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Page Navigation (only for multi-page templates) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-transparent"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-7 w-7 p-0 text-xs ${
                      currentPage === page ? "bg-indigo-600 text-white" : "border-gray-300"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs bg-transparent"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div
          ref={containerRef}
          className={`flex-1 min-h-0 overflow-auto ${isDragMode ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Checkered background pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #cbd5e1 25%, transparent 25%),
                linear-gradient(-45deg, #cbd5e1 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #cbd5e1 75%),
                linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              opacity: 0.3,
            }}
          />

          {/* Drag mode floating indicator */}
          {isDragMode && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
              <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                <Move className="h-4 w-4" />
                {isDragging ? "Dragging..." : "Click and drag to pan"}
              </div>
            </div>
          )}

          {/* Preview Content */}
          <div className="relative w-full flex justify-center p-6 pb-20" style={{ minHeight: "max-content" }}>
            {isGenerating ? (
              <LoadingSkeleton />
            ) : (
              <div
                className="transition-transform duration-100 ease-out"
                style={{
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  transformOrigin: "top center",
                  width: "210mm",
                  pointerEvents: isDragMode ? "none" : "auto",
                }}
              >
                {/* Paper container */}
                <div
                  className="bg-white rounded-lg overflow-hidden relative"
                  style={{
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Watermark overlay */}
                  {showWatermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div
                        className="text-8xl font-bold text-gray-300/40 transform -rotate-45 select-none"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}
                      >
                        DRAFT
                      </div>
                    </div>
                  )}

                  <div
                    ref={(el) => {
                      previewRef.current = el
                      exportRef.current = el
                    }}
                  >
                    {renderTemplate()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full View Dialog */}
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogContent
            className="max-w-none w-screen h-screen p-0 border-0 rounded-none"
            style={{ backgroundColor: "#0f172a" }}
            showCloseButton={false}
          >
            <DialogTitle className="sr-only">Proposal Preview</DialogTitle>
            <div className="flex flex-col h-full">
              {/* Full View Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(15,23,42,0.98)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#6366f1" }}
                  >
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{safeInfo.proposalType} Proposal</h3>
                    <p className="text-sm capitalize" style={{ color: "#94a3b8" }}>
                      {safeInfo.template} template
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Zoom controls in fullscreen */}
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={() => setZoom(Math.max(25, zoom - 10))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-white font-medium w-14 text-center">{zoom}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white gap-2"
                    onClick={() => {
                      setIsFullscreen(false)
                    }}
                  >
                    <Minimize2 className="h-4 w-4" />
                    Exit Full View
                  </Button>
                </div>
              </div>

              {/* Full View Content */}
              <div
                className="flex-1 overflow-auto p-8 flex items-start justify-center"
                style={{
                  background: "radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)",
                }}
              >
                <div
                  className="transition-transform duration-300 ease-out"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                  }}
                >
                  <div
                    className="bg-white rounded-xl overflow-hidden"
                    style={{
                      width: "210mm",
                      boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.1)",
                    }}
                  >
                    <div ref={exportRef}>{renderTemplate(true)}</div>
                  </div>
                </div>
              </div>

              {/* Full View Footer - Page Navigation */}
              {totalPages > 1 && (
                <div
                  className="flex items-center justify-center gap-4 px-6 py-4 border-t"
                  style={{
                    borderColor: "rgba(255,255,255,0.1)",
                    backgroundColor: "rgba(15,23,42,0.98)",
                  }}
                >
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white gap-2"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        className={`w-10 h-10 p-0 text-sm font-medium ${
                          currentPage === page
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-white/10 hover:bg-white/20 text-white"
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    className="bg-white/10 hover:bg-white/20 text-white gap-2"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {safeInfo.proposalType} • {safeInfo.template} template
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy Text
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
