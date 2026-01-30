"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, Upload, Loader2, File, CheckCircle2, AlertCircle, X } from "lucide-react"
import { StyledButton } from "@/components/ui/styled-button"
import { useCallback, useRef, useState } from "react"
import JSZip from "jszip"

interface ProposalInputProps {
  content: string
  onChange: (content: string) => void
  isAnalyzing: boolean
}

type UploadStatus = "idle" | "uploading" | "success" | "error"

interface UploadState {
  status: UploadStatus
  fileName?: string
  fileType?: string
  error?: string
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const zip = await JSZip.loadAsync(arrayBuffer)

  // Get the main document content
  const documentXml = zip.file("word/document.xml")
  if (!documentXml) {
    throw new Error("Invalid DOCX file: document.xml not found")
  }

  const xmlContent = await documentXml.async("string")

  // Extract text from <w:t> tags
  const textMatches: string[] = []
  const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g
  let match
  while ((match = regex.exec(xmlContent)) !== null) {
    if (match[1]) {
      textMatches.push(match[1])
    }
  }

  // Also check for paragraph breaks <w:p>
  // Split by paragraph markers to preserve structure
  let result = ""
  const paragraphs = xmlContent.split(/<w:p[^>]*>/)

  for (const paragraph of paragraphs) {
    const paraText: string[] = []
    const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
    let textMatch
    while ((textMatch = textRegex.exec(paragraph)) !== null) {
      if (textMatch[1]) {
        paraText.push(textMatch[1])
      }
    }
    if (paraText.length > 0) {
      result += paraText.join("") + "\n"
    }
  }

  // Clean up result
  result = result
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()

  if (!result || result.length < 10) {
    throw new Error("Could not extract text from DOCX file")
  }

  return result
}

export function ProposalInput({ content, onChange, isAnalyzing }: ProposalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" })

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Validate file type
      const supportedTypes = [
        "text/plain",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!supportedTypes.includes(file.type)) {
        setUploadState({
          status: "error",
          fileName: file.name,
          error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
        })
        return
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setUploadState({
          status: "error",
          fileName: file.name,
          error: "File size exceeds 10MB limit.",
        })
        return
      }

      setUploadState({
        status: "uploading",
        fileName: file.name,
        fileType: file.type.includes("pdf") ? "PDF" : file.type.includes("word") ? "DOCX" : "TXT",
      })

      try {
        // For plain text, read directly
        if (file.type === "text/plain") {
          const text = await file.text()
          onChange(text)
          setUploadState({
            status: "success",
            fileName: file.name,
            fileType: "TXT",
          })
          setTimeout(() => setUploadState({ status: "idle" }), 3000)
          return
        }

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          try {
            const extractedText = await extractTextFromDOCX(file)
            onChange(extractedText)
            setUploadState({
              status: "success",
              fileName: file.name,
              fileType: "DOCX",
            })
            setTimeout(() => setUploadState({ status: "idle" }), 3000)
            return
          } catch (docxError) {
            console.error("DOCX extraction error:", docxError)
            setUploadState({
              status: "error",
              fileName: file.name,
              error: "Could not extract text from DOCX. Please try copying and pasting the text directly.",
            })
            return
          }
        }

        // For PDF, use the server-side extraction API
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/studio/extract", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to extract text from file")
        }

        onChange(data.text)
        setUploadState({
          status: "success",
          fileName: file.name,
          fileType: data.fileType?.toUpperCase(),
        })

        setTimeout(() => setUploadState({ status: "idle" }), 3000)
      } catch (error) {
        setUploadState({
          status: "error",
          fileName: file.name,
          error: error instanceof Error ? error.message : "Failed to process file",
        })
      }
    },
    [onChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFileUpload(file)
    },
    [handleFileUpload],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const text = e.clipboardData.getData("text")
      if (text) {
        onChange(text)
      }
    },
    [onChange],
  )

  const clearUploadState = () => setUploadState({ status: "idle" })

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const isProcessing = uploadState.status === "uploading" || isAnalyzing

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-primary overflow-hidden rounded-2xl shadow-sm"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100/80 bg-slate-50/80 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Proposal Draft</h2>
          <p className="text-xs text-slate-500">Paste text or upload a PDF/DOCX/TXT to start the analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {uploadState.status === "uploading" ? "Processing..." : "Upload File"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {uploadState.status !== "idle" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`px-6 py-3 flex items-center justify-between ${
                uploadState.status === "uploading"
                  ? "bg-blue-50 border-b border-blue-100"
                  : uploadState.status === "success"
                    ? "bg-green-50 border-b border-green-100"
                    : "bg-red-50 border-b border-red-100"
              }`}
            >
              <div className="flex items-center gap-3">
                {uploadState.status === "uploading" && (
                  <>
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-700">
                      Extracting text from <strong>{uploadState.fileName}</strong>...
                    </span>
                  </>
                )}
                {uploadState.status === "success" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Successfully loaded <strong>{uploadState.fileName}</strong> ({uploadState.fileType})
                    </span>
                  </>
                )}
                {uploadState.status === "error" && (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">{uploadState.error}</span>
                  </>
                )}
              </div>
              {(uploadState.status === "success" || uploadState.status === "error") && (
                <button onClick={clearUploadState} className="p-1 hover:bg-black/5 rounded transition-colors">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Area with drag & drop zone */}
      <div className="relative bg-white" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-700">
                {uploadState.status === "uploading"
                  ? `Extracting text from ${uploadState.fileType || "file"}...`
                  : "Analyzing your proposal..."}
              </p>
            </div>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste your proposal content here..."
          className="w-full min-h-[460px] p-6 text-slate-800 placeholder:text-slate-300 resize-none bg-white focus:outline-none text-sm leading-relaxed font-normal"
          disabled={isProcessing}
        />

        {!content && !isProcessing && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-400">Drop a file or paste content</p>
              <p className="mt-1 text-xs text-slate-300">Supports PDF, DOCX, or TXT</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div>{wordCount.toLocaleString()} words</div>
        <div>{charCount < 50 ? `${50 - charCount} more characters needed` : "Ready for analysis"}</div>
      </div>
    </motion.div>
  )
}
