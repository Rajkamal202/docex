"use client"

import { Settings, Keyboard, HelpCircle, MessageSquare, FileText } from "lucide-react"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const keyboardShortcuts = [
  { key: "N", description: "New template" },
  { key: "U", description: "Upload document" },
  { key: "/", description: "Search templates" },
  { key: "G", description: "Toggle grid/list view" },
]

export function TemplatesFooter() {
  return (
    <footer className="px-6 py-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left - Brand & Links */}
          <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-900 flex items-center justify-center">
                <FileText className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold text-slate-700">LightNoteAI</span>
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">v1.0</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/improve-proposal" 
                className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
              >
                Review Studio
              </Link>
              <Link 
                href="#" 
                className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
              >
                Help Center
              </Link>
              <Link 
                href="#" 
                className="text-slate-500 hover:text-slate-700 transition-colors duration-200"
              >
                Changelog
              </Link>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {/* Keyboard Shortcuts */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                    <Keyboard className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Shortcuts</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="p-3 bg-slate-900 border-0">
                  <p className="text-xs font-semibold text-white mb-2">Keyboard Shortcuts</p>
                  <div className="space-y-1.5">
                    {keyboardShortcuts.map((shortcut) => (
                      <div key={shortcut.key} className="flex items-center justify-between gap-4 text-xs">
                        <span className="text-slate-400">{shortcut.description}</span>
                        <kbd className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded font-mono text-[10px]">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-px h-4 bg-slate-200" />

            {/* Feedback */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Feedback</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Send feedback or report issues</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Help */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Help</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>View documentation and guides</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="hidden md:block w-px h-4 bg-slate-200" />

            {/* Settings */}
            <Link
              href="#"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-3 pt-3 border-t border-slate-100 text-center sm:text-left">
          <p className="text-xs text-slate-400">
            © 2026 LightNoteAI. Built for better proposals.
          </p>
        </div>
      </div>
    </footer>
  )
}
