"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useCredits } from "@/lib/credit-store"
import { AddCreditsModal } from "@/components/dashboard/add-credits-modal"
import { Upload, FileText, Sparkles, Check, X, Clock, ChevronDown, Wand2, Settings2 } from "lucide-react"

type ToneProfile = "formal" | "persuasive" | "executive-formal"

interface OptimizationGoal {
  id: string
  label: string
  checked: boolean
}

interface UploadedFile {
  name: string
  size: number
  type: string
  content?: string
}

const ANALYSIS_COST = 1.0

export function ImproveProposal() {
  const { balance, canAfford, deductCredit } = useCredits()
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [showPasteInput, setShowPasteInput] = useState(false)
  const [pastedText, setPastedText] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Settings state
  const [toneProfile, setToneProfile] = useState<ToneProfile>("executive-formal")
  const [optimizationGoals, setOptimizationGoals] = useState<OptimizationGoal[]>([
    { id: "clarity", label: "Clarity & Conciseness", checked: true },
    { id: "persuasion", label: "Persuasion Power", checked: false },
    { id: "readability", label: "Readability Score", checked: true },
    { id: "legal", label: "Legal Risk Check", checked: false },
  ])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    if (balance < ANALYSIS_COST) {
      setShowCreditsModal(true)
      return
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]
    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".pdf") &&
      !file.name.endsWith(".docx")
    ) {
      setError("Please upload a PDF, DOCX, or TXT file")
      return
    }

    setError(null)

    let content = ""
    try {
      content = await file.text()
    } catch {
      setError("Failed to read file content")
      return
    }

    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type,
      content,
    })
  }

  const toggleOptimizationGoal = (id: string) => {
    setOptimizationGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, checked: !goal.checked } : goal)))
  }

  const handleAnalyze = async () => {
    if (balance < ANALYSIS_COST) {
      setShowCreditsModal(true)
      return
    }

    if (!uploadedFile && !pastedText) {
      setError("Please upload a file or paste proposal text")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Simulate analysis for now
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await deductCredit(ANALYSIS_COST, "AI Proposal Analysis")
      setAnalysisComplete(true)
    } catch (err) {
      setError("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setAnalysisComplete(false)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">LightNote AI</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="/dashboard/proposals" className="text-sm text-blue-600 font-medium">
                Proposals
              </a>
              <a href="/dashboard/clients" className="text-sm text-gray-600 hover:text-gray-900">
                Clients
              </a>
              <a href="/dashboard/settings" className="text-sm text-gray-600 hover:text-gray-900">
                Settings
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              <img src="/professional-avatar.png" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Sub Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-lg font-semibold text-gray-900">AI Proposal Studio</h1>
              <div className="flex items-center border-b-2 border-transparent">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-[2px]">
                  Improve Proposal
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Templates & Generator
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last saved 2m ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-[1fr_360px] gap-6 max-w-[1400px] mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Upload Card */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                {!uploadedFile && !showPasteInput ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
                      isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                        <Upload className="h-6 w-6 text-blue-500" />
                      </div>
                      <h3 className="text-base font-medium text-gray-900 mb-1">Upload your proposal</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Drag and drop your PDF or DOCX file here to start analyzing.
                      </p>
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white mb-3">Select File</Button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowPasteInput(true)
                        }}
                        className="text-sm text-blue-500 hover:text-blue-600"
                      >
                        Paste proposal text instead
                      </button>
                    </div>
                  </div>
                ) : showPasteInput ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Paste your proposal text</h3>
                      <button
                        onClick={() => {
                          setShowPasteInput(false)
                          setPastedText("")
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <textarea
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your proposal content here..."
                      className="w-full h-48 p-4 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setShowPasteInput(false)}
                        disabled={!pastedText.trim()}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Use This Text
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                        <p className="text-sm text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results Card */}
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Analysis Results
                  {isAnalyzing && (
                    <div className="ml-auto">
                      <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                      </div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisComplete ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    {/* Skeleton preview placeholder */}
                    <div className="w-full max-w-md space-y-3 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-100 rounded w-3/4" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6" />
                      <div className="h-3 bg-gray-100 rounded w-4/6" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 mb-1">Ready for analysis</h3>
                    <p className="text-sm text-gray-500 text-center">
                      Upload a document above to see AI-driven improvements here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Analysis results would go here */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 font-medium">Analysis complete!</p>
                      <p className="text-sm text-green-600 mt-1">
                        Your proposal has been analyzed. View the improvements below.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings Sidebar */}
          <div className="space-y-6">
            <Card className="border-gray-200 sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <Settings2 className="h-4 w-4 text-gray-500" />
                  Improvement Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tone Profile */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tone Profile</label>
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setToneProfile("formal")}
                        className={cn(
                          "flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                          toneProfile === "formal"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        Formal
                      </button>
                      <button
                        onClick={() => setToneProfile("persuasive")}
                        className={cn(
                          "flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                          toneProfile === "persuasive"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
                        )}
                      >
                        Persuasive
                      </button>
                    </div>
                    <button
                      onClick={() => setToneProfile("executive-formal")}
                      className={cn(
                        "w-full px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors flex items-center justify-between",
                        toneProfile === "executive-formal"
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {toneProfile === "executive-formal" && <Check className="h-4 w-4" />}
                        <span>Executive - Formal</span>
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Optimization Goals */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Optimization Goals
                  </label>
                  <div className="mt-3 space-y-3">
                    {optimizationGoals.map((goal) => (
                      <label key={goal.id} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={goal.checked}
                          onCheckedChange={() => toggleOptimizationGoal(goal.id)}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">{goal.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 border-t border-gray-100">
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || (!uploadedFile && !pastedText)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Analyze & Improve
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">Uses 1 AI credit per analysis.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddCreditsModal isOpen={showCreditsModal} onClose={() => setShowCreditsModal(false)} />
    </div>
  )
}
