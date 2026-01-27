"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, ChevronDown, ChevronUp, Columns, Rows, GitCompare } from "lucide-react"

interface Change {
  type: "addition" | "removal" | "modification"
  original: string
  improved: string
  reason: string
  impact?: "high" | "medium" | "low"
  accepted?: boolean
}

interface DiffViewProps {
  original: string
  improved: string
  changes: Change[]
  onAcceptChange?: (index: number) => void
  onRejectChange?: (index: number) => void
  onAcceptAll?: () => void
}

type ViewMode = "side-by-side" | "unified" | "changes"

// Simple diff algorithm to highlight differences - safely handles large texts
const computeWordDiff = (original: string | undefined | null, improved: string | undefined | null) => {
  // Handle null/undefined cases
  if (!original || !improved || typeof original !== 'string' || typeof improved !== 'string') {
    return { removed: [], added: [] }
  }
  
  // Limit text size to prevent performance issues
  const maxLength = 10000
  const safeOriginal = original.slice(0, maxLength)
  const safeImproved = improved.slice(0, maxLength)
  
  const originalWords = safeOriginal.split(/\s+/).filter(w => w.length > 0)
  const improvedWords = safeImproved.split(/\s+/).filter(w => w.length > 0)
  
  const originalSet = new Set(originalWords)
  const improvedSet = new Set(improvedWords)
  
  // Limit number of highlighted words to prevent performance issues
  const removed = originalWords.filter(w => w.trim() && !improvedSet.has(w)).slice(0, 50)
  const added = improvedWords.filter(w => w.trim() && !originalSet.has(w)).slice(0, 50)
  
  return { removed, added }
}

// Safe text escaping for HTML
const escapeHtml = (text: string | undefined | null): string => {
  if (!text || typeof text !== 'string') return ''
  // Limit text length to prevent memory issues
  const safeText = text.slice(0, 50000)
  return safeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlightDiff = (text: string | undefined | null, highlights: string[], type: "added" | "removed"): string => {
  if (!text || typeof text !== 'string') return ''
  if (highlights.length === 0) return escapeHtml(text)
  
  const colorClass = type === "added" 
    ? "bg-emerald-100 text-emerald-800 px-0.5 rounded" 
    : "bg-rose-100 text-rose-800 line-through px-0.5 rounded"
  
  // Create a set for O(1) lookups
  const highlightSet = new Set(highlights.map(h => h.toLowerCase()))
  
  // Split text into words while preserving whitespace
  const parts = text.split(/(\s+)/)
  
  // Process each part
  const result = parts.map(part => {
    if (!part.trim()) return part // preserve whitespace
    
    const escaped = escapeHtml(part)
    if (highlightSet.has(part.toLowerCase())) {
      return `<span class="${colorClass}">${escaped}</span>`
    }
    return escaped
  }).join('')
  
  return result
}

export function DiffView({ 
  original, 
  improved, 
  changes,
  onAcceptChange,
  onRejectChange,
  onAcceptAll,
}: DiffViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side")
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set())
  const [acceptedChanges, setAcceptedChanges] = useState<Set<number>>(new Set())
  const [rejectedChanges, setRejectedChanges] = useState<Set<number>>(new Set())

  const { removed, added } = useMemo(() => computeWordDiff(original, improved), [original, improved])

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedChanges)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedChanges(newExpanded)
  }

  const handleAccept = (index: number) => {
    setAcceptedChanges(prev => new Set([...prev, index]))
    setRejectedChanges(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    onAcceptChange?.(index)
  }

  const handleReject = (index: number) => {
    setRejectedChanges(prev => new Set([...prev, index]))
    setAcceptedChanges(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    onRejectChange?.(index)
  }

  const handleAcceptAll = () => {
    const allIndexes = new Set(changes.map((_, i) => i))
    setAcceptedChanges(allIndexes)
    setRejectedChanges(new Set())
    onAcceptAll?.()
  }

  const getImpactBadge = (impact?: string) => {
    switch (impact) {
      case "high":
        return <span className="px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-700 rounded-full">High Impact</span>
      case "medium":
        return <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">Medium</span>
      case "low":
        return <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">Low</span>
      default:
        return null
    }
  }

  const stats = useMemo(() => ({
    total: changes.length,
    accepted: acceptedChanges.size,
    rejected: rejectedChanges.size,
    pending: changes.length - acceptedChanges.size - rejectedChanges.size,
  }), [changes.length, acceptedChanges.size, rejectedChanges.size])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500">{stats.accepted} accepted</span>
          <span className="text-slate-500">{stats.rejected} rejected</span>
          <span className="text-slate-500">{stats.pending} pending</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("side-by-side")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === "side-by-side" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              Side by Side
            </button>
            <button
              onClick={() => setViewMode("unified")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === "unified" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Rows className="h-3.5 w-3.5" />
              Unified
            </button>
            <button
              onClick={() => setViewMode("changes")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "changes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Changes ({changes.length})
            </button>
          </div>

          <button
            onClick={handleAcceptAll}
            className="px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Side by Side View */}
        {viewMode === "side-by-side" && (
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <div>
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-medium text-slate-500">Original</span>
              </div>
              <div 
                className="p-4 text-sm leading-relaxed text-slate-600 max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: highlightDiff(original, removed, "removed") }}
              />
            </div>
            <div>
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-medium text-slate-500">Improved</span>
              </div>
              <div 
                className="p-4 text-sm leading-relaxed text-slate-700 max-h-[400px] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: highlightDiff(improved, added, "added") }}
              />
            </div>
          </div>
        )}

        {/* Unified View */}
        {viewMode === "unified" && (
          <div className="p-4 space-y-2 text-sm max-h-[400px] overflow-y-auto">
            {original.split('\n\n').slice(0, 10).map((para, i) => (
              <div key={`orig-${i}`} className="flex gap-2 items-start">
                <span className="text-rose-500 text-xs font-mono mt-0.5">-</span>
                <p className="text-rose-600 bg-rose-50 px-2 py-1 rounded flex-1">{para}</p>
              </div>
            ))}
            <div className="border-t border-slate-200 my-3" />
            {improved.split('\n\n').slice(0, 10).map((para, i) => (
              <div key={`imp-${i}`} className="flex gap-2 items-start">
                <span className="text-emerald-500 text-xs font-mono mt-0.5">+</span>
                <p className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded flex-1">{para}</p>
              </div>
            ))}
          </div>
        )}

        {/* Changes List View */}
        {viewMode === "changes" && (
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {changes.map((change, index) => {
              const isAccepted = acceptedChanges.has(index)
              const isRejected = rejectedChanges.has(index)
              const isExpanded = expandedChanges.has(index)

              return (
                <div key={index} className="rounded-lg overflow-hidden transition-colors">
                  <div 
                    className="px-3 py-2.5 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                        change.type === "addition" 
                          ? "bg-emerald-100 text-emerald-700"
                          : change.type === "removal"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {change.type}
                      </span>
                      <span className="text-sm text-slate-600 truncate max-w-md">
                        {change.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!isAccepted && !isRejected && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAccept(index); }}
                            className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors"
                            title="Accept"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReject(index); }}
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors"
                            title="Reject"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="border-t border-slate-200"
                      >
                        <div className="p-3 grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-slate-500 mb-1 block">Original</span>
                            <p className="text-sm text-rose-600 bg-rose-50 p-2 rounded">
                              {change.original || "(empty)"}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 mb-1 block">Improved</span>
                            <p className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded">
                              {change.improved || "(empty)"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
