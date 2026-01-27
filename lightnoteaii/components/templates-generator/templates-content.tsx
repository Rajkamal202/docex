"use client"

import { useState, useCallback, useRef, useEffect, memo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Heart,
  Clock,
  Layers,
  ChevronDown,
  ArrowRight,
  Star,
  TrendingUp,
  FileUp,
  Loader2,
  Crown,
  Search,
  LayoutGrid,
  List,
  Filter,
  Briefcase,
  PiggyBank,
  Megaphone,
  Code,
  Palette,
  Box,
  Users,
  DollarSign,
  Building,
  CalendarDays,
  Target,
  Scale,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Eye,
  SortAsc,
  SortDesc,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { StyledButton } from "@/components/ui/styled-button"
import { cn } from "@/lib/utils"
import { useTemplates } from "@/hooks/use-templates"
import { createProposalFromTemplate } from "@/hooks/use-proposals"
import type { Template } from "@/lib/supabase/types"
import { UploadDocumentModal } from "@/components/upload-document-modal"
import { createLocalProposal, saveLocalProposal, starterTemplates } from "@/hooks/use-local-proposal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1, rootMargin: "100px", ...options },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

interface TemplatesContentProps {
  activeFilter: "all" | "recent" | "favorites"
  onFilterChange: (filter: "all" | "recent" | "favorites") => void
  sortBy: string
  onSortChange: (sort: string) => void
}

// Sort options configuration
const sortOptions = [
  { id: "recently-modified", label: "Recently Modified", icon: Clock },
  { id: "name-asc", label: "Name (A-Z)", icon: SortAsc },
  { id: "name-desc", label: "Name (Z-A)", icon: SortDesc },
  { id: "rating", label: "Highest Rated", icon: Star },
  { id: "created", label: "Newest First", icon: CalendarDays },
]

// All available categories
const allCategories = [
  "All",
  "Sales",
  "Marketing",
  "Product",
  "Design",
  "Engineering",
  "Consulting",
  "Fundraising",
  "Finance",
  "Strategy",
  "Events",
  "Legal",
  "HR",
  "Management",
]

// Category configuration with icons and colors
const categoryConfig: Record<string, { icon: typeof Briefcase; color: string; bgColor: string; borderColor: string }> = {
  Sales: { icon: Briefcase, color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  Fundraising: { icon: PiggyBank, color: "text-violet-600", bgColor: "bg-violet-50", borderColor: "border-violet-200" },
  Marketing: { icon: Megaphone, color: "text-pink-600", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
  Engineering: { icon: Code, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  Design: { icon: Palette, color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  Product: { icon: Box, color: "text-cyan-600", bgColor: "bg-cyan-50", borderColor: "border-cyan-200" },
  Consulting: { icon: Users, color: "text-indigo-600", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
  Finance: { icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  Management: { icon: Building, color: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200" },
  HR: { icon: Users, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  Events: { icon: CalendarDays, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  Strategy: { icon: Target, color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
  Legal: { icon: Scale, color: "text-gray-600", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  Other: { icon: Layers, color: "text-slate-600", bgColor: "bg-slate-50", borderColor: "border-slate-200" },
}

const categoryColors: Record<string, string> = {
  Sales: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Fundraising: "bg-violet-50 text-violet-700 border border-violet-200",
  Marketing: "bg-pink-50 text-pink-700 border border-pink-200",
  Engineering: "bg-blue-50 text-blue-700 border border-blue-200",
  Design: "bg-amber-50 text-amber-700 border border-amber-200",
  Product: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  Consulting: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Finance: "bg-green-50 text-green-700 border border-green-200",
  Management: "bg-slate-50 text-slate-700 border border-slate-200",
  HR: "bg-orange-50 text-orange-700 border border-orange-200",
  Events: "bg-purple-50 text-purple-700 border border-purple-200",
  Strategy: "bg-red-50 text-red-700 border border-red-200",
  Legal: "bg-gray-50 text-gray-700 border border-gray-200",
  Other: "bg-slate-50 text-slate-700 border border-slate-200",
}

interface TemplateCardProps {
  template: Template
  index: number
  isHovered: boolean
  hasAnyHover: boolean
  isFavorite?: boolean
  viewMode?: "grid" | "list"
  onHover: (index: number | null) => void
  onOpenTemplate: (template: Template) => void
  onToggleFavorite: (template: Template) => void
  onPreview?: (template: Template) => void
}

const TemplateCard = memo(
  function TemplateCard({
    template,
    index,
    isHovered,
    hasAnyHover,
    isFavorite = false,
    viewMode = "grid",
    onHover,
    onOpenTemplate,
    onToggleFavorite,
    onPreview,
  }: TemplateCardProps) {
    const { ref, isInView } = useInView()

    const shouldBlur = hasAnyHover && !isHovered

    // Calculate time ago from updated_at
    const getTimeAgo = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 60) return `${diffMins} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      if (diffDays < 7) return `${diffDays} days ago`
      return date.toLocaleDateString()
    }

    // Check if recently edited (within last 24 hours)
    const isRecent = () => {
      const date = new Date(template.updated_at)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      return diffMs < 24 * 60 * 60 * 1000
    }

    const sectionCount = template.content?.sections?.length || 0

    const isPremium = template.is_premium

    // List View Render
    if (viewMode === "list") {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onMouseEnter={() => onHover(index)}
          onMouseLeave={() => onHover(null)}
          className={cn(
            "group flex items-center gap-4 p-4 bg-white/90 rounded-2xl border border-slate-200/80 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.45)] hover:border-slate-300 hover:bg-white transition-all cursor-pointer",
            isPremium && "border-amber-200/80 hover:border-amber-300",
            isHovered && "shadow-[0_18px_40px_-24px_rgba(15,23,42,0.6)] border-slate-300"
          )}
          onClick={() => onOpenTemplate(template)}
        >
          {/* Thumbnail */}
          <div className={cn(
            "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100",
            isPremium && "ring-2 ring-amber-400/50"
          )}>
            <img
              src={template.thumbnail_url || `/templates/${(template.category || "default").toLowerCase()}-template.jpg`}
              alt={template.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/templates/default-template.jpg"
              }}
            />
            {isPremium && (
              <div className="absolute top-1 left-1 flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded text-[10px] font-bold">
                <Crown className="h-2.5 w-2.5" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-900 truncate tracking-tight">{template.name}</h3>
              {template.category && (
                <span className={cn(
                  "px-2 py-0.5 text-[11px] font-semibold rounded-full flex-shrink-0",
                  categoryColors[template.category] || categoryColors.Other
                )}>
                  {template.category}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 line-clamp-1 mb-2">
              {template.description || "No description"}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                {sectionCount} sections
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {getTimeAgo(template.updated_at)}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                {template.rating || "4.5"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPreview?.(template)
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top">Preview</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(template)
                    }}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      isFavorite 
                        ? "text-pink-500 bg-pink-50 hover:bg-pink-100" 
                        : "text-slate-400 hover:text-pink-500 hover:bg-slate-100"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top">{isFavorite ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onOpenTemplate(template)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Use
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      )
    }

    // Grid View Render (default)
    return (
      <div
        ref={ref}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        className="relative"
        style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}
      >
        {isInView ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "group relative bg-white rounded-3xl overflow-hidden transition-all duration-300 ease-out border border-slate-200/80",
              "will-change-transform",
              shouldBlur && "blur-sm scale-[0.97] opacity-70",
              isPremium && "ring-2 ring-amber-400/40",
            )}
            style={{
              boxShadow: isHovered
                ? isPremium
                  ? "0 30px 60px -20px rgba(251, 191, 36, 0.35)"
                  : "0 30px 60px -22px rgba(15, 23, 42, 0.35)"
                : isPremium
                  ? "0 6px 24px -6px rgba(251, 191, 36, 0.25)"
                  : "0 10px 28px -16px rgba(15, 23, 42, 0.35)",
            }}
          >
            {isPremium && (
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </div>
            )}

            <div className="relative h-48 md:h-56 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
              {isPremium && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-600/10 z-[1]" />
              )}

              <img
                src={(() => {
                  if (template.thumbnail_url) return template.thumbnail_url
                  
                  const category = (template.category || "").toLowerCase().trim()
                  const validCategories = ["product", "fundraising", "consulting", "design", "sales", "marketing", "engineering"]
                  
                  // Try exact match first
                  if (validCategories.includes(category)) {
                    return `/templates/${category}-template.jpg`
                  }
                  
                  // For PREMIUM templates, try to extract category from name if not matched
                  if (isPremium && template.name) {
                    const nameLower = template.name.toLowerCase()
                    for (const cat of validCategories) {
                      if (nameLower.includes(cat)) {
                        return `/templates/${cat}-template.jpg`
                      }
                    }
                  }
                  
                  // Default fallback
                  return "/templates/default-template.jpg"
                })()}
                alt={template.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/templates/default-template.jpg"
                }}
              />

              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              >
                <h3
                  className={cn(
                    "text-xl md:text-2xl font-semibold tracking-tight bg-clip-text text-transparent mb-2",
                    isPremium
                      ? "bg-gradient-to-b from-amber-200 via-yellow-300 to-amber-400"
                      : "bg-gradient-to-b from-white to-white/80",
                  )}
                >
                  {template.name}
                </h3>
                <p className="text-sm text-white/70 line-clamp-2">{template.description || "No description"}</p>
              </div>

              {isPremium && (
                <div
                  className={cn(
                    "absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg shadow-lg shadow-amber-500/30 z-20 transition-all duration-300",
                    isHovered ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0",
                  )}
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span className="text-xs font-bold tracking-wide">PREMIUM</span>
                </div>
              )}

              <span
                className={cn(
                  `absolute px-2.5 py-1 text-[11px] font-semibold rounded-lg backdrop-blur-sm transition-opacity duration-300`,
                  categoryColors[template.category] || categoryColors.Other,
                  isHovered ? "opacity-0" : "opacity-100",
                  isPremium ? "top-12 left-3" : "top-3 left-3",
                )}
              >
                {template.category}
              </span>

              {isRecent() && !isPremium && (
                <span
                  className={cn(
                    "absolute top-3 left-3 mt-8 px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded flex items-center gap-1 shadow-md transition-opacity duration-300",
                    isHovered ? "opacity-0" : "opacity-100",
                  )}
                >
                  <TrendingUp className="h-3 w-3" />
                  NEW
                </span>
              )}

              {/* Quick Actions - Top Right */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                {/* Favorite Button */}
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          onToggleFavorite(template)
                        }}
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                          isPremium
                            ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-amber-500/40"
                            : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-pink-500 hover:bg-white shadow-md",
                        )}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className={cn("h-4 w-4", isPremium && "fill-current")} />
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 text-white border-0">
                      <p>Add to favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* More Options Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                        isHovered ? "opacity-100" : "opacity-0",
                        "bg-white/90 backdrop-blur-sm text-slate-500 hover:text-slate-700 hover:bg-white shadow-md",
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        onPreview?.(template)
                      }} 
                      className="cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Template
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenTemplate(template)
                      }} 
                      className="cursor-pointer"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Use This Template
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(template)
                      }} 
                      className="cursor-pointer"
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isFavorite && "fill-current text-pink-500")} />
                      {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Rating Badge */}
              <div
                className={cn(
                  "absolute top-3 left-3 flex items-center gap-1 px-2 py-1 backdrop-blur-sm rounded-lg shadow-md transition-all duration-300 z-20",
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
                  isPremium ? "bg-gradient-to-r from-amber-100 to-yellow-100" : "bg-white/90",
                )}
              >
                <Star className={cn("h-3.5 w-3.5 fill-current", "text-amber-500")} />
                <span className={cn("text-xs font-semibold", isPremium ? "text-amber-700" : "text-slate-700")}>
                  {template.rating || "4.5"}
                </span>
              </div>
            </div>

            <div className={cn("p-5", isPremium ? "bg-gradient-to-b from-white to-amber-50/50" : "bg-white")}>
              {/* Template Name - Always visible */}
              <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 tracking-tight">{template.name}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-1">{template.description || "No description"}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    {sectionCount} sections
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className={isRecent() ? "text-blue-500 font-medium" : ""}>
                      {getTimeAgo(template.updated_at)}
                    </span>
                  </span>
                </div>
                {isPremium && (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    Pro
                  </span>
                )}
              </div>

              <motion.button
                onClick={() => onOpenTemplate(template)}
                className={cn(
                  "group/btn relative w-full rounded-full p-px text-sm font-semibold overflow-hidden",
                  isPremium
                    ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white"
                    : "bg-slate-900 text-white",
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100",
                      isPremium
                        ? "bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_75%)]"
                        : "bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)]",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "relative flex items-center justify-center gap-2 z-10 rounded-full py-2.5 px-4 ring-1",
                    isPremium
                      ? "bg-gradient-to-r from-amber-600 to-yellow-600 ring-amber-400/30"
                      : "bg-slate-950 ring-white/10",
                  )}
                >
                  {isPremium && <Crown className="h-4 w-4" />}
                  Use Template
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                </span>
                <span
                  className={cn(
                    "absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r transition-opacity duration-500 group-hover/btn:opacity-40",
                    isPremium
                      ? "from-white/0 via-white/90 to-white/0"
                      : "from-emerald-400/0 via-emerald-400/90 to-emerald-400/0",
                  )}
                />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div
            className={cn(
              "rounded-2xl h-[340px] animate-pulse",
              isPremium ? "bg-gradient-to-br from-amber-100 to-yellow-50" : "bg-slate-100",
            )}
          />
        )}
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.template.id === nextProps.template.id &&
      prevProps.isHovered === nextProps.isHovered &&
      prevProps.hasAnyHover === nextProps.hasAnyHover
    )
  },
)

export function TemplatesContent({ activeFilter, onFilterChange, sortBy, onSortChange }: TemplatesContentProps) {
  const router = useRouter()
  const [hoveredCardRaw, setHoveredCardRaw] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const hoveredCard = useDebounce(hoveredCardRaw, 30)
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Handle Create Template - creates local proposal and navigates to editor
  const handleCreateTemplate = () => {
    const proposal = createLocalProposal("Untitled Proposal", "blank", "blank")
    saveLocalProposal(proposal)
    router.push(`/editor/${proposal.id}`)
  }

  const { templates, total, isLoading, error, mutate } = useTemplates({
    filter: activeFilter === "all" ? undefined : activeFilter,
  })

  // Filter templates by search query, category, and active filter (favorites/recent)
  const filteredTemplates = templates
    .filter((template) => {
      const matchesSearch = debouncedSearch === "" || 
        template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        template.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        template.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
      
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
      
      // Apply active filter
      let matchesFilter = true
      if (activeFilter === "favorites") {
        matchesFilter = favorites.has(template.id)
      } else if (activeFilter === "recent") {
        // Show templates modified in the last 7 days
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        matchesFilter = new Date(template.updated_at) > weekAgo
      }
      
      return matchesSearch && matchesCategory && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "created":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "recently-modified":
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      }
    })

  // Get unique categories from templates for the filter
  const availableCategories = ["All", ...new Set(templates.map(t => t.category).filter(Boolean))]

  const handleHover = useCallback((index: number | null) => {
    setHoveredCardRaw(index)
  }, [])

  const handleOpenTemplate = async (template: Template) => {
    setIsCreating(true)
    try {
      const result = await createProposalFromTemplate(template.id, `${template.name} - Copy`)
      router.push(`/editor/${result.proposal.id}`)
    } catch (err) {
      console.error("Failed to create proposal:", err)
      alert("Failed to open template. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleFavorite = useCallback((template: Template) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(template.id)) {
        newFavorites.delete(template.id)
        toast.success("Removed from favorites", {
          description: `"${template.name}" has been removed from your favorites.`,
        })
      } else {
        newFavorites.add(template.id)
        toast.success("Added to favorites", {
          description: `"${template.name}" has been added to your favorites.`,
        })
      }
      return newFavorites
    })
  }, [])

  const handlePreviewTemplate = useCallback((template: Template) => {
    setPreviewTemplate(template)
  }, [])

  // Calculate counts for each filter
  const recentCount = templates.filter(t => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return new Date(t.updated_at) > weekAgo
  }).length

  const filters = [
    { id: "all" as const, label: "All Templates", count: templates.length },
    { id: "recent" as const, label: "Recently Edited", count: recentCount },
    { id: "favorites" as const, label: "Favorites", count: favorites.size, icon: Heart },
  ]

  const hasAnyHover = hoveredCard !== null

  if (isLoading) {
    return (
      <div>
        {/* Skeleton Hero */}
        <div className="mb-10 text-center">
          <div className="h-12 w-80 bg-slate-200 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-96 bg-slate-100 rounded-lg mx-auto mb-8 animate-pulse" />
          <div className="h-12 w-full max-w-xl mx-auto bg-slate-100 rounded-xl mb-8 animate-pulse" />
        </div>
        
        {/* Skeleton Category Chips */}
        <div className="mb-8">
          <div className="h-5 w-32 bg-slate-200 rounded mb-4 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 w-24 bg-slate-100 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        
        {/* Skeleton Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="h-48 bg-slate-100 animate-pulse" />
              <div className="p-4">
                <div className="h-5 w-3/4 bg-slate-200 rounded mb-2 animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded mb-4 animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                </div>
                <div className="h-10 w-full bg-slate-100 rounded-xl mt-4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-500 font-medium">Failed to load templates</p>
          <p className="text-slate-500 text-sm">{error.message}</p>
          <StyledButton variant="secondary" onClick={() => mutate()}>
            Try Again
          </StyledButton>
        </div>
      </div>
    )
  }

  return (
    <div>
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-slate-700 font-medium">Creating your proposal...</p>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <UploadDocumentModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      
      {/* Hero Section - Find Your Template */}
      <div className="mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.35em] text-slate-500 font-semibold mb-3"
        >
          Premium Templates
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 mb-4"
        >
          Templates Library
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-8"
        >
          Start with a curated structure, then tailor every section to match your brand and client.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <span className="sr-only">Clear search</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <motion.button
            onClick={handleCreateTemplate}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-medium shadow-lg hover:bg-slate-800 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="h-4 w-4" />
            <span>Create from Scratch</span>
          </motion.button>

          <motion.button
            onClick={() => setShowUploadModal(true)}
            className="group flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FileUp className="h-4 w-4" />
            <span>Upload Document</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Category Filter Chips */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Filter by Category</span>
          {selectedCategory !== "All" && (
            <button
              onClick={() => setSelectedCategory("All")}
              className="ml-2 flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
        {/* Horizontal scroll container on mobile */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide md:flex-wrap md:overflow-visible md:pb-0">
            {availableCategories.map((category) => {
              const config = categoryConfig[category] || categoryConfig.Other
              const CategoryIcon = config?.icon || Layers
              const isSelected = selectedCategory === category
              
              return (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0",
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category !== "All" && <CategoryIcon className="h-4 w-4" />}
                  {category}
                  {category === "All" && (
                    <span className={cn(
                      "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    )}>
                      {templates.length}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
          {/* Fade indicator on mobile */}
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden" />
        </div>
      </div>

      {/* Create Your Own Section */}
      <div className="mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent rounded-full blur-3xl" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full">
                  <Crown className="h-4 w-4 text-white" />
                  <span className="text-xs font-bold text-white tracking-wide">RECOMMENDED</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                  Best Practice
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Create Your Own Template
              </h2>
              
              <p className="text-slate-300 leading-relaxed mb-4 max-w-xl">
                Start from a curated structure and personalize it with your sections, visuals, and tone. 
                For the best results, consider <span className="text-white font-semibold">creating a custom template</span> or 
                <span className="text-white font-semibold">uploading your existing document</span>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  onClick={handleCreateTemplate}
                  className="group relative flex items-center gap-2.5 px-6 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Template</span>
                  <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </motion.button>

                <motion.button
                  onClick={() => setShowUploadModal(true)}
                  className="group flex items-center gap-2.5 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FileUp className="h-5 w-5" />
                  <span>Upload Document</span>
                </motion.button>
              </div>
            </div>

            {/* Right - Premium Coming Soon */}
            <div className="md:w-72 p-5 bg-gradient-to-br from-amber-500/20 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-amber-400 text-xs font-bold tracking-wider">COMING SOON</p>
                  <p className="text-white font-semibold">Premium Templates</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                Professionally designed, human-crafted templates for every industry and use case.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Actively in development
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header with View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-900">
              {selectedCategory === "All" ? "All Templates" : `${selectedCategory} Templates`}
            </h2>
            {debouncedSearch && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                Searching: "{debouncedSearch}"
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {filteredTemplates.length === 0 
              ? "No templates match your search criteria"
              : `Showing ${filteredTemplates.length} of ${total} templates`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100/80 text-slate-600 rounded-2xl backdrop-blur-sm text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              {filteredTemplates.length} available
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-1 p-1.5 bg-slate-100/80 rounded-2xl backdrop-blur-sm">
          {filters.map((filter) => {
            const FilterIcon = filter.icon
            return (
              <motion.button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeFilter === filter.id
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
                whileHover={{ scale: activeFilter === filter.id ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {FilterIcon && <FilterIcon className={cn("h-4 w-4", activeFilter === filter.id && filter.id === "favorites" && "fill-current text-pink-500")} />}
                <span>{filter.label}</span>
                <span className={cn(
                  "px-1.5 py-0.5 text-xs rounded-full font-semibold",
                  activeFilter === filter.id 
                    ? "bg-slate-900 text-white" 
                    : "bg-slate-200/80 text-slate-600"
                )}>
                  {filter.count}
                </span>
              </motion.button>
            )
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {(() => {
                const currentSort = sortOptions.find(s => s.id === sortBy) || sortOptions[0]
                const SortIcon = currentSort.icon
                return (
                  <>
                    <SortIcon className="h-4 w-4" />
                    <span className="font-medium text-slate-900">{currentSort.label}</span>
                  </>
                )
              })()}
              <ChevronDown className="h-4 w-4" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white/95 backdrop-blur-xl border-slate-200 shadow-xl rounded-xl p-1.5 min-w-[200px]"
          >
            {sortOptions.map((option) => {
              const OptionIcon = option.icon
              const isSelected = sortBy === option.id
              return (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => onSortChange(option.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg cursor-pointer px-3 py-2.5",
                    isSelected 
                      ? "bg-slate-900 text-white" 
                      : "text-slate-700 hover:bg-slate-100 focus:bg-slate-100"
                  )}
                >
                  <OptionIcon className="h-4 w-4" />
                  <span className="flex-1">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredTemplates.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200"
        >
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
            {debouncedSearch ? (
              <Search className="h-10 w-10 text-slate-400" />
            ) : (
              <Layers className="h-10 w-10 text-slate-400" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            {debouncedSearch 
              ? "No templates found" 
              : selectedCategory !== "All"
                ? `No ${selectedCategory} templates yet`
                : "No templates yet"}
          </h3>
          <p className="text-slate-500 text-center max-w-md mb-6 px-4">
            {debouncedSearch 
              ? `We couldn't find any templates matching "${debouncedSearch}". Try a different search term or browse all templates.`
              : "Create your first template to get started with professional proposals."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {debouncedSearch ? (
              <>
                <StyledButton variant="primary" onClick={() => setSearchQuery("")}>
                  Clear Search
                </StyledButton>
                <StyledButton variant="secondary" onClick={handleCreateTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Template
                </StyledButton>
              </>
            ) : (
              <StyledButton variant="primary" onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </StyledButton>
            )}
          </div>
          
          {/* Getting Started Guide */}
          {!debouncedSearch && templates.length === 0 && (
            <div className="mt-10 w-full max-w-2xl px-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-4 text-center">Getting Started</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <p className="text-sm text-slate-600">Create a new template or upload an existing document</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <p className="text-sm text-slate-600">Customize your template with the visual editor</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <p className="text-sm text-slate-600">Refine and review proposals with built‑in tools</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedCategory}-${debouncedSearch}-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "flex flex-col gap-4"
            )}
          >
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={index}
                isHovered={hoveredCard === index}
                hasAnyHover={hasAnyHover}
                isFavorite={favorites.has(template.id)}
                viewMode={viewMode}
                onHover={handleHover}
                onOpenTemplate={handleOpenTemplate}
                onToggleFavorite={handleToggleFavorite}
                onPreview={handlePreviewTemplate}
              />
            ))}

            {/* Create New Template Card - inside grid */}
            {viewMode === "grid" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={handleCreateTemplate}
                className={cn(
                  "group relative bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-900 transition-all duration-300 cursor-pointer min-h-[340px] flex flex-col items-center justify-center",
                  hasAnyHover && "blur-sm scale-[0.97] opacity-70",
                )}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-slate-900 flex items-center justify-center mb-4 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Plus className="h-7 w-7 text-slate-400 group-hover:text-white transition-colors" />
                </motion.div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">New Template</h3>
                <p className="text-xs text-slate-500 text-center px-6">Start from scratch</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Template Preview Modal */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {previewTemplate?.name}
                </DialogTitle>
                <DialogDescription className="text-slate-500 mt-1">
                  {previewTemplate?.description || "No description available"}
                </DialogDescription>
              </div>
              {previewTemplate?.category && (
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  categoryColors[previewTemplate.category] || categoryColors.Other
                )}>
                  {previewTemplate.category}
                </span>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto mt-4">
            {/* Template Preview Content */}
            <div className="bg-slate-50 rounded-xl p-6 min-h-[300px]">
              {previewTemplate?.content ? (
                <div className="space-y-4">
                  {(() => {
                    try {
                      const content = typeof previewTemplate.content === "string" 
                        ? JSON.parse(previewTemplate.content) 
                        : previewTemplate.content
                      
                      if (content.sections && Array.isArray(content.sections)) {
                        return content.sections.map((section: { id: string; title?: string; content?: unknown }, idx: number) => {
                          // Handle content that could be string or object
                          let displayContent = "No content"
                          if (section.content) {
                            if (typeof section.content === "string") {
                              displayContent = section.content
                            } else if (typeof section.content === "object") {
                              // Extract text from object fields
                              const contentObj = section.content as Record<string, unknown>
                              const textParts = Object.entries(contentObj)
                                .filter(([, value]) => typeof value === "string")
                                .map(([key, value]) => `${key}: ${value}`)
                              displayContent = textParts.join(" | ") || "Structured content"
                            }
                          }
                          
                          return (
                            <div key={section.id || idx} className="bg-white rounded-lg p-4 border border-slate-200">
                              <h4 className="font-semibold text-slate-900 mb-2">
                                {section.title || `Section ${idx + 1}`}
                              </h4>
                              <p className="text-sm text-slate-600 line-clamp-3">
                                {displayContent}
                              </p>
                            </div>
                          )
                        })
                      }
                      return <p className="text-slate-500">Template content preview</p>
                    } catch {
                      return <p className="text-slate-500">Unable to parse template content</p>
                    }
                  })()}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Layers className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-slate-500">No preview available</p>
                </div>
              )}
            </div>
            
            {/* Template Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Sections</p>
                <p className="text-lg font-semibold text-slate-900">
                  {(() => {
                    try {
                      const content = typeof previewTemplate?.content === "string" 
                        ? JSON.parse(previewTemplate?.content || "{}") 
                        : previewTemplate?.content
                      return content?.sections?.length || 0
                    } catch {
                      return 0
                    }
                  })()}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-lg font-semibold text-slate-900">{previewTemplate?.rating || "4.5"}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Last Updated</p>
                <p className="text-sm font-medium text-slate-900">
                  {previewTemplate?.updated_at ? new Date(previewTemplate.updated_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Created</p>
                <p className="text-sm font-medium text-slate-900">
                  {previewTemplate?.created_at ? new Date(previewTemplate.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <motion.button
              onClick={() => previewTemplate && handleToggleFavorite(previewTemplate)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                previewTemplate && favorites.has(previewTemplate.id)
                  ? "bg-pink-50 text-pink-600 border-pink-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart className={cn("h-4 w-4", previewTemplate && favorites.has(previewTemplate.id) && "fill-current")} />
              {previewTemplate && favorites.has(previewTemplate.id) ? "Favorited" : "Add to Favorites"}
            </motion.button>
            <motion.button
              onClick={() => {
                if (previewTemplate) {
                  handleOpenTemplate(previewTemplate)
                  setPreviewTemplate(null)
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-slate-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Use This Template
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
