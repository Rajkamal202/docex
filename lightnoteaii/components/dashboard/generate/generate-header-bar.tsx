"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle2,
  Download,
  FileDown,
  History,
  Keyboard,
  Loader2,
  MessageSquare,
  PanelRight,
  PanelRightClose,
  RotateCcw,
  Save,
  Zap,
  DollarSign,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface GenerateHeaderBarProps {
  generationMode: "guided" | "quick"
  onModeChange: (mode: "guided" | "quick") => void
  balance: number
  costPerGen: number
  lastSaved: Date | null
  isSaving: boolean
  onSaveDraft: () => void
  onShowHistory: () => void
  onShowShortcuts: () => void
  onReset: () => void
  showSidebar: boolean
  onToggleSidebar: () => void
  onExportPdf: () => void
  onExportWord: () => void
}

export function GenerateHeaderBar({
  generationMode,
  onModeChange,
  balance,
  costPerGen,
  lastSaved,
  isSaving,
  onSaveDraft,
  onShowHistory,
  onShowShortcuts,
  onReset,
  showSidebar,
  onToggleSidebar,
  onExportPdf,
  onExportWord,
}: GenerateHeaderBarProps) {
  return (
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
            onClick={() => onModeChange("guided")}
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
            onClick={() => onModeChange("quick")}
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

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-1.5">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">${balance.toFixed(2)}</span>
          <span className="text-xs text-gray-400">(${costPerGen.toFixed(2)}/gen)</span>
        </div>

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

        <TooltipProvider>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSaveDraft}>
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save draft</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onShowHistory}>
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Version history</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onShowShortcuts}>
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Shortcuts</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onReset}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start over</TooltipContent>
            </Tooltip>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleSidebar}>
                  {showSidebar ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showSidebar ? "Hide panel" : "Show panel"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onExportPdf}>
                  <FileDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download PDF</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onExportWord}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download Word</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
