"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProposals } from "@/lib/proposal-store"
import {
  Search,
  FileText,
  Trophy,
  XCircle,
  Clock,
  Eye,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    won: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    lost: "bg-red-500/10 text-red-600 border-red-200",
    pending: "bg-amber-500/10 text-amber-600 border-amber-200",
    draft: "bg-gray-500/10 text-gray-600 border-gray-200",
  }
  return (
    <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.draft}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const ScoreBadge = ({ score }: { score: number }) => {
  const color =
    score >= 80
      ? "text-emerald-600 bg-emerald-50"
      : score >= 60
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50"
  return <div className={`px-2.5 py-1 rounded-full text-sm font-semibold ${color}`}>{score}/100</div>
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

function formatDate(dateString: string) {
  return dateFormatter.format(new Date(dateString))
}

function formatRelativeDate(date: Date) {
  const now = Date.now()
  const diffDays = Math.floor((now - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return dateFormatter.format(date)
}

function groupByDate(proposals: any[]): Map<string, any[]> {
  const groups = new Map<string, any[]>()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  for (const proposal of proposals) {
    const date = new Date(proposal.createdAt)
    const diffDays = Math.floor((now - date.getTime()) / dayMs)

    let groupKey: string
    if (diffDays === 0) groupKey = "Today"
    else if (diffDays === 1) groupKey = "Yesterday"
    else if (diffDays < 7) groupKey = "This Week"
    else if (diffDays < 30) groupKey = "This Month"
    else groupKey = "Earlier"

    const existing = groups.get(groupKey)
    if (existing) {
      existing.push(proposal)
    } else {
      groups.set(groupKey, [proposal])
    }
  }

  return groups
}

const ProposalRow = ({ proposal, onDelete }: { proposal: any; onDelete: (id: string) => void }) => {
  const createdAt = useMemo(() => new Date(proposal.createdAt), [proposal.createdAt])
  const relativeDate = useMemo(() => formatRelativeDate(createdAt), [createdAt])

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            proposal.status === "won"
              ? "bg-emerald-100"
              : proposal.status === "lost"
                ? "bg-red-100"
                : proposal.status === "pending"
                  ? "bg-amber-100"
                  : "bg-gray-100"
          }`}
        >
          {proposal.status === "won" ? (
            <Trophy className="h-5 w-5 text-emerald-600" />
          ) : proposal.status === "lost" ? (
            <XCircle className="h-5 w-5 text-red-600" />
          ) : proposal.status === "pending" ? (
            <Clock className="h-5 w-5 text-amber-600" />
          ) : (
            <FileText className="h-5 w-5 text-gray-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 truncate">{proposal.name}</h4>
            <StatusBadge status={proposal.status} />
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-500">
            <span className="truncate">{proposal.client}</span>
            <span className="text-gray-300">•</span>
            <span>{relativeDate}</span>
            {proposal.value > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-emerald-600 font-medium">${proposal.value.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ScoreBadge score={proposal.score || 0} />

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" asChild className="h-8 px-3">
            <Link href={`/dashboard/audit/${proposal.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/audit/${proposal.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(proposal.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default function HistoryContent() {
  const { proposals = [], isLoading, deleteProposal } = useProposals()
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProposals = useMemo(() => {
    let filtered = proposals

    if (filter !== "all") {
      filtered = filtered.filter((p) => p.status === filter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query) || p.client.toLowerCase().includes(query))
    }

    return filtered
  }, [proposals, filter, searchQuery])

  const groupedProposals = useMemo(() => groupByDate(filteredProposals), [filteredProposals])

  const stats = useMemo(() => {
    let won = 0
    let totalValue = 0
    let totalScore = 0

    for (const p of proposals) {
      if (p.status === "won") {
        won++
        totalValue += p.value || 0
      }
      totalScore += p.score || 0
    }

    const total = proposals.length
    return {
      won,
      total,
      totalValue,
      avgScore: total > 0 ? Math.round(totalScore / total) : 0,
      winRate: total > 0 ? Math.round((won / total) * 100) : 0,
    }
  }, [proposals])

  const handleDelete = useCallback(
    (id: string) => {
      deleteProposal(id)
    },
    [deleteProposal],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  const groupEntries = Array.from(groupedProposals.entries())

  return (
    <div className="p-6 space-y-6">
      {/* Mac-style Window */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-emerald-400 hover:bg-emerald-500 transition-colors cursor-pointer" />
            </div>
            <span className="text-sm font-medium text-gray-700">Proposal History</span>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50/50 border-b border-gray-100">
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-100">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Proposals</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-100">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Trophy className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Won</p>
              <p className="text-lg font-semibold text-emerald-600">{stats.won}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-100">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-semibold text-blue-600">{stats.winRate}%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-gray-100">
            <div className="p-2 bg-amber-50 rounded-lg">
              <DollarSign className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value Won</p>
              <p className="text-lg font-semibold text-amber-600">${stats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 bg-white">
          {["all", "won", "lost", "pending", "draft"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === status ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="divide-y divide-gray-100">
          {filteredProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">No proposals found</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-sm">
                {searchQuery
                  ? `No proposals matching "${searchQuery}"`
                  : filter !== "all"
                    ? `No ${filter} proposals yet.`
                    : "Start by auditing your first proposal."}
              </p>
              {filter === "all" && !searchQuery && (
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/dashboard/upload">
                    Upload Proposal
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            groupEntries.map(([group, groupProposals]) => (
              <div key={group}>
                {/* Date Group Header */}
                <div className="px-4 py-2 bg-gray-50/80 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <Calendar className="h-3 w-3" />
                    {group}
                    <span className="text-gray-400">({groupProposals.length})</span>
                  </div>
                </div>

                {/* Proposals in Group */}
                {groupProposals.map((proposal) => (
                  <ProposalRow key={proposal.id} proposal={proposal} onDelete={handleDelete} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
