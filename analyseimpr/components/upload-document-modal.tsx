"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  X,
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ImageIcon,
  Table2,
  Type,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { parseDocument, type ParseResult, type ExtractedImage } from "@/lib/document-parser"
import { createProposalFromUpload, saveLocalProposal } from "@/hooks/use-local-proposal"
import { 
  templateToProposal, 
  saveTemplateToStorage, 
  saveAssetsToStorage,
  type DocumentTemplate 
} from "@/lib/document-model"
import { setPendingDocxFile } from "@/lib/superdoc-upload"

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
}

type UploadState = "idle" | "dragging" | "parsing" | "redirecting" | "success" | "error"

export function UploadDocumentModal({ isOpen, onClose }: UploadDocumentModalProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [state, setState] = useState<UploadState>("idle")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)
  const [customTitle, setCustomTitle] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [parseProgress, setParseProgress] = useState(0)

  const resetState = () => {
    setState("idle")
    setSelectedFile(null)
    setParseResult(null)
    setCustomTitle("")
    setShowPreview(false)
    setParseProgress(0)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("dragging")
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("idle")
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("idle")
    
    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const processFile = async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase()
    if (extension === "docx") {
      setSelectedFile(file)
      setState("redirecting")
      setPendingDocxFile(file)
      router.push("/lightnoteai-editor")
      return
    }

    setSelectedFile(file)
    setState("parsing")
    setParseProgress(0)
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setParseProgress(prev => Math.min(prev + 10, 90))
    }, 200)
    
    const result = await parseDocument(file)
    
    clearInterval(progressInterval)
    setParseProgress(100)
    setParseResult(result)
    
    if (result.success) {
      setCustomTitle(result.data.title)
      setState("success")
    } else {
      setState("error")
    }
  }

  const handleContinue = () => {
    if (!parseResult?.success) return

    // IMPORTANT: We convert the uploaded document to our INTERNAL EDITABLE MODEL
    // The original file is NEVER returned as-is - it becomes a template source
    
    if (parseResult.template) {
      // New path: Use the fully converted template
      const template: DocumentTemplate = {
        ...parseResult.template,
        name: customTitle || parseResult.template.name,
      }
      
      // Save template to storage (for versioning and reuse)
      saveTemplateToStorage(template)
      
      // Save assets separately (images are linked, not embedded)
      if (parseResult.assets) {
        saveAssetsToStorage(parseResult.assets)
      }
      
      // Convert template to proposal format for the editor
      const proposal = templateToProposal(template, parseResult.assets || {})
      
      // Also save as local proposal for backward compatibility
      saveLocalProposal(proposal)
      
      // Navigate to editor with the template ID
      router.push(`/editor/${template.id}`)
    } else {
      // Fallback: Legacy path using sections directly
      const proposal = createProposalFromUpload(
        customTitle || parseResult.data.title,
        parseResult.data.sections
      )
      saveLocalProposal(proposal)
      router.push(`/editor/${proposal.id}`)
    }
    
    handleClose()
  }

  const getFileIcon = (file: File | null) => {
    if (!file) return <Upload className="h-12 w-12 text-slate-400" />
    
    const ext = file.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "pdf":
        return <FileText className="h-12 w-12 text-red-500" />
      case "docx":
      case "doc":
        return <FileSpreadsheet className="h-12 w-12 text-blue-500" />
      case "txt":
        return <File className="h-12 w-12 text-slate-500" />
      default:
        return <File className="h-12 w-12 text-slate-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-white flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Upload className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Upload your document</h2>
          </div>
          <button
            onClick={handleClose}
            className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 border border-slate-200 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Fills remaining space */}
        <div className="flex-1 flex flex-col">
          {/* Idle / Drag State */}
          {(state === "idle" || state === "dragging") && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                state === "dragging" ? "bg-blue-50" : "bg-white"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-6 -mt-16">
                {/* Cloud/Document Illustration */}
                <div className="relative">
                  <div className="w-24 h-20 rounded-2xl bg-indigo-100/60 flex items-center justify-center">
                    <div className="w-14 h-16 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-indigo-200" />
                    <div className="w-4 h-4 rounded-full bg-indigo-100" />
                    <div className="w-3 h-3 rounded-full bg-indigo-200" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xl font-semibold text-indigo-600 mb-2">
                    Upload or drag your document here
                  </p>
                  <p className="text-sm text-slate-500 mb-1">
                    Supported format: .docx
                  </p>
                  <p className="text-sm text-slate-500">
                    Only .docx files open in the editor for direct editing.
                  </p>
                  <p className="text-sm text-slate-500">
                    Max file size: 10MB
                  </p>
                </div>

                <button
                  type="button"
                  className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                >
                  Or click to browse
                </button>
              </div>
            </div>
          )}

          {/* Parsing State */}
          {(state === "parsing" || state === "redirecting") && selectedFile && (
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)]">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Document upload</p>
                      <p className="text-xs text-slate-500">
                        {state === "redirecting" ? "Opening editor workspace" : "Extracting content"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Processing
                  </span>
                </div>

                <div className="px-6 py-6">
                  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      {getFileIcon(selectedFile)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-700">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)} • DOCX</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>{state === "redirecting" ? "Launching editor" : "Parsing file"}</span>
                      <span>{state === "redirecting" ? "Please wait" : `${parseProgress}%`}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      {state === "redirecting" ? (
                        <motion.div
                          className="h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"
                          animate={{ x: ["-30%", "130%"] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ) : (
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                          initial={{ width: "0%" }}
                          animate={{ width: `${parseProgress}%` }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-700">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </span>
                    <div>
                      <p className="font-medium">
                        {state === "redirecting" ? "Preparing the editor" : "Extracting your content"}
                      </p>
                      <p className="text-xs text-blue-600/80">
                        {state === "redirecting"
                          ? "This usually takes a few seconds."
                          : "We’re preserving layout, tables, and styling."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === "success" && selectedFile && parseResult?.success && (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-lg mx-auto space-y-4">
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex-shrink-0">
                    {getFileIcon(selectedFile)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 truncate">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>

                {/* Extracted Content Summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Type className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-slate-500">Sections</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{parseResult.data.sections.length}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <ImageIcon className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-medium text-slate-500">Images</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{parseResult.data.images?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Table2 className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-medium text-slate-500">Tables</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{parseResult.data.structure?.tables?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <List className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-medium text-slate-500">Characters</span>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">{(parseResult.data.rawText.length / 1000).toFixed(1)}k</p>
                  </div>
                </div>

                {/* Preview Toggle */}
                {(parseResult.data.images?.length > 0 || parseResult.data.sections.length > 0) && (
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-600">Preview Extracted Content</span>
                    {showPreview ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                  </button>
                )}

                {/* Preview Content */}
                {showPreview && (
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl">
                    {/* Images Preview */}
                    {parseResult.data.images && parseResult.data.images.length > 0 && (
                      <div className="p-3 border-b border-slate-200">
                        <p className="text-xs font-medium text-slate-500 mb-2">Extracted Images</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {parseResult.data.images.slice(0, 5).map((img: ExtractedImage, idx: number) => (
                            <div key={img.id} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                              <img src={img.data || "/placeholder.svg"} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {parseResult.data.images.length > 5 && (
                            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                              <span className="text-xs font-medium text-slate-500">+{parseResult.data.images.length - 5}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sections Preview */}
                    <div className="p-3">
                      <p className="text-xs font-medium text-slate-500 mb-2">Document Structure</p>
                      <div className="space-y-1">
                        {parseResult.data.sections.slice(0, 6).map((section, idx) => (
                          <div key={section.id} className="flex items-center gap-2 text-sm">
                            <span className="w-5 h-5 flex items-center justify-center bg-slate-200 rounded text-xs font-medium text-slate-600">
                              {idx + 1}
                            </span>
                            <span className="text-slate-600 truncate">
                              {section.type === "hero" ? (section.content.title as string) : (section.content.heading as string) || section.title}
                            </span>
                            <span className="text-xs text-slate-400 capitalize">{section.type}</span>
                          </div>
                        ))}
                        {parseResult.data.sections.length > 6 && (
                          <p className="text-xs text-slate-400 pl-7">+{parseResult.data.sections.length - 6} more sections</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter a title for your proposal"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {state === "error" && parseResult && !parseResult.success && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="max-w-md space-y-5 -mt-16">
                <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700 mb-1">Upload Failed</p>
                    <p className="text-sm text-red-600">{parseResult.error.message}</p>
                  </div>
                </div>

                <button
                  onClick={resetState}
                  className="w-full py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(state === "idle" || state === "dragging") && (
          <div className="flex-shrink-0 px-8 py-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              LightNote uses AI to convert your document into an editable proposal. By using it, you agree to its{" "}
              <a href="/terms" className="text-slate-600 hover:underline">Terms</a>
            </p>
          </div>
        )}
        
        {state === "success" && (
          <div className="flex-shrink-0 px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
            <button
              onClick={resetState}
              className="px-4 py-2.5 text-slate-600 font-medium hover:text-slate-800 transition-colors"
            >
              Upload Different File
            </button>
            
            <motion.button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Continue to Editor</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

export default UploadDocumentModal
