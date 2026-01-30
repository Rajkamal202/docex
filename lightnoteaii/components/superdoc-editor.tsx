"use client"

import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { consumePendingDocxFile, setPendingDocxFile } from "@/lib/superdoc-upload"
import { ArrowLeft, FileText, Loader2, Upload, ZoomIn, ZoomOut } from "lucide-react"

type EditorStatus = "idle" | "loading" | "ready" | "error"

export function SuperDocEditor() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const superdocRef = useRef<unknown>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [status, setStatus] = useState<EditorStatus>("idle")
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const formatFileSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const statusStyles: Record<EditorStatus, string> = {
    idle: "bg-slate-100 text-slate-600",
    loading: "bg-blue-50 text-blue-700",
    ready: "bg-emerald-50 text-emerald-700",
    error: "bg-red-50 text-red-700",
  }

  const statusLabel: Record<EditorStatus, string> = {
    idle: "Waiting for file",
    loading: "Loading",
    ready: "Ready",
    error: "Error",
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(2))))
  const handleZoomOut = () => setZoom((prev) => Math.max(0.6, Number((prev - 0.1).toFixed(2))))
  const handleZoomReset = () => setZoom(1)

  useEffect(() => {
    const pending = consumePendingDocxFile()
    if (pending) {
      setDocFile(pending)
    }
  }, [])

  useEffect(() => {
    if (!docFile || !containerRef.current) return

    let cancelled = false
    setStatus("loading")

    const init = async () => {
      const { SuperDoc } = await import("superdoc")
      if (cancelled || !containerRef.current) return

      const instance = new SuperDoc({
        selector: containerRef.current,
        modules: {
          toolbar: {
            selector: "#superdoc-toolbar",
          },
        },
        pagination: true,
        rulers: true,
        document: { data: docFile },
        onReady: () => setStatus("ready"),
      })

      superdocRef.current = instance
    }

    init().catch(() => setStatus("error"))

    return () => {
      cancelled = true
      if (superdocRef.current && typeof (superdocRef.current as { destroy?: () => void }).destroy === "function") {
        ;(superdocRef.current as { destroy: () => void }).destroy()
      }
    }
  }, [docFile])

  const handlePickFile = () => {
    fileInputRef.current?.click()
  }

  const handleExport = () => {
    if (!superdocRef.current) return
    const instance = superdocRef.current as { export?: () => void }
    if (typeof instance.export === "function") {
      instance.export()
    }
  }

  const handleExportPdf = async () => {
    if (!superdocRef.current || status !== "ready") return
    setPdfError(null)
    setIsExportingPdf(true)

    try {
      const instance = superdocRef.current as {
        export?: (params?: { exportType?: string[]; triggerDownload?: boolean }) => Promise<Blob | ArrayBuffer | void>
      }
      const exported = await instance.export?.({ exportType: ["docx"], triggerDownload: false })

      if (!exported) {
        throw new Error("Unable to export DOCX for PDF conversion.")
      }

      const docxBlob =
        exported instanceof Blob
          ? exported
          : new Blob([exported], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })

      const formData = new FormData()
      const docxName = docFile?.name?.toLowerCase().endsWith(".docx") ? docFile.name : "document.docx"
      formData.append("file", docxBlob, docxName)

      const response = await fetch("/api/export/pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || "PDF export failed.")
      }

      const pdfBlob = await response.blob()
      const downloadUrl = URL.createObjectURL(pdfBlob)
      const anchor = document.createElement("a")
      anchor.href = downloadUrl
      anchor.download = docxName.replace(/\.docx$/i, "") + ".pdf"
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      setPdfError(error instanceof Error ? error.message : "PDF export failed.")
    } finally {
      setIsExportingPdf(false)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith(".docx")) {
      setStatus("error")
      return
    }

    setPendingDocxFile(file)
    setDocFile(file)
  }

  return (
    <div className="min-h-screen bg-slate-50 ln-superdoc">
      <div className="relative overflow-hidden border-b border-slate-200 bg-white/90">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => router.push("/templates")}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">LightNoteAI Editor</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                {statusLabel[status]}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Upload a DOCX proposal, make edits, and export in DOCX or PDF when you’re ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePickFile}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Upload DOCX
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={status !== "ready"}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Export DOCX
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={status !== "ready" || isExportingPdf}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExportingPdf ? "Preparing PDF..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="hidden"
        />

        {!docFile && (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-14 text-center shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.12),_transparent_55%)]" />
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FileText className="h-7 w-7" />
              </div>
              <p className="mt-5 text-xl font-semibold text-slate-800">Upload a DOCX file to start editing</p>
              <p className="mt-2 text-sm text-slate-500">
                Your document opens instantly in the editor with full formatting preserved.
              </p>
              <p className="mt-1 text-sm text-slate-500">Only .docx files can be edited here.</p>
              <button
                type="button"
                onClick={handlePickFile}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Upload className="h-4 w-4" />
                Choose DOCX file
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            We couldn’t load that file. Please upload a valid `.docx` document.
          </div>
        )}

        {pdfError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {pdfError}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {docFile && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{docFile.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(docFile.size)} • DOCX</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="text-slate-500 hover:text-slate-800 disabled:opacity-50"
                    disabled={zoom <= 0.6}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomReset}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="text-slate-500 hover:text-slate-800 disabled:opacity-50"
                    disabled={zoom >= 1.4}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}>
                  {statusLabel[status]}
                </span>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
              <div id="superdoc-toolbar" />
            </div>
            <div className="relative">
              <div className="relative min-h-[70vh] overflow-x-auto bg-white">
                <div
                  ref={containerRef}
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    width: `${100 / zoom}%`,
                  }}
                />
              </div>
              {status === "loading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-slate-600">Loading your document…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
