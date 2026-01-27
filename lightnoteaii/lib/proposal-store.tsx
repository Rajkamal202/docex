"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { ProposalStats } from "@/types/proposal-stats"

export type ProposalStatus = "draft" | "submitted" | "pending" | "won" | "lost"
export type ProposalIndustry = "technology" | "finance" | "healthcare" | "retail" | "consulting" | "marketing" | "other"

export interface Proposal {
  id: string
  name: string
  client: string
  industry: ProposalIndustry
  value: number
  score: number | null
  status: ProposalStatus
  createdAt: Date
  updatedAt: Date
  submittedAt: Date | null
  deadline: Date | null
  scoreBreakdown: {
    structure: number
    credibility: number
    persuasion: number
    clarity: number
    callToAction: number
  } | null
  improvements: string[]
  issues: string[]
  content?: string
  originalContent?: string
  improvedContent?: string
}

interface ProposalState {
  proposals: Proposal[]
  isLoading: boolean
  userId: string | null
}

interface ProposalContextType extends ProposalState {
  addProposal: (proposal: Omit<Proposal, "id" | "createdAt" | "updatedAt">) => Promise<Proposal | null>
  updateProposal: (id: string, updates: Partial<Proposal>) => Promise<void>
  deleteProposal: (id: string) => Promise<void>
  getProposal: (id: string) => Proposal | undefined
  getStats: () => ProposalStats
  getRecentProposals: (limit?: number) => Proposal[]
  getUpcomingDeadlines: (limit?: number) => Proposal[]
  getTopPerformers: (limit?: number) => Proposal[]
  refreshProposals: () => Promise<void>
}

const ProposalContext = createContext<ProposalContextType | null>(null)

function mapDbRowToProposal(p: any): Proposal {
  return {
    id: p.id,
    name: p.name || p.title || "",
    client: p.client_name || "",
    industry: (p.industry as ProposalIndustry) || "other",
    value: p.value || 0,
    score: p.score,
    status: (p.status as ProposalStatus) || "draft",
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at),
    submittedAt: null,
    deadline: p.deadline ? new Date(p.deadline) : null,
    scoreBreakdown: p.score_breakdown
      ? {
          structure: p.score_breakdown.structure || 0,
          credibility: p.score_breakdown.credibility || 0,
          persuasion: p.score_breakdown.persuasion || 0,
          clarity: p.score_breakdown.clarity || 0,
          callToAction: p.score_breakdown.cta || 0,
        }
      : null,
    improvements: p.improvements || [],
    issues: p.issues || [],
    content: p.content,
    originalContent: p.original_content,
    improvedContent: p.improved_content,
  }
}

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProposalState>({
    proposals: [],
    isLoading: true,
    userId: null,
  })

  const mounted = useRef(false)
  const fetchInProgress = useRef(false)

  const proposalMap = useRef<Map<string, Proposal>>(new Map())

  useEffect(() => {
    proposalMap.current.clear()
    state.proposals.forEach((p) => proposalMap.current.set(p.id, p))
  }, [state.proposals])

  const fetchProposals = useCallback(async () => {
    if (fetchInProgress.current) return
    fetchInProgress.current = true

    if (typeof window === "undefined") {
      setState((prev) => ({ ...prev, isLoading: false }))
      fetchInProgress.current = false
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setState((prev) => ({ ...prev, isLoading: false }))
      fetchInProgress.current = false
      return
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        const errorMessage = authError.message || ""
        if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Refresh Token")) {
          if (mounted.current) {
            setState({ proposals: [], isLoading: false, userId: null })
          }
          fetchInProgress.current = false
          return
        }
      }

      if (!user) {
        if (mounted.current) {
          setState({ proposals: [], isLoading: false, userId: null })
        }
        fetchInProgress.current = false
        return
      }

      const { data, error } = await supabase
        .from("proposals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const proposals: Proposal[] = (data || []).map(mapDbRowToProposal)

      if (mounted.current) {
        setState({ proposals, isLoading: false, userId: user.id })
      }
    } catch (error) {
      console.error("Error fetching proposals:", error)
      if (mounted.current) {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    } finally {
      fetchInProgress.current = false
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    fetchProposals()

    if (typeof window === "undefined") return

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (mounted.current) {
        fetchProposals()
      }
    })

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [fetchProposals])

  const addProposal = useCallback(
    async (proposalData: Omit<Proposal, "id" | "createdAt" | "updatedAt">): Promise<Proposal | null> => {
      if (!state.userId) return null

      const supabase = getSupabaseBrowserClient()
      if (!supabase) return null

      try {
        let deadlineStr: string | null = null
        if (proposalData.deadline) {
          if (proposalData.deadline instanceof Date) {
            deadlineStr = proposalData.deadline.toISOString()
          } else if (typeof proposalData.deadline === "string") {
            deadlineStr = proposalData.deadline
          }
        }

        const { data, error } = await supabase
          .from("proposals")
          .insert({
            user_id: state.userId,
            name: proposalData.name,
            client_name: proposalData.client,
            industry: proposalData.industry,
            value: proposalData.value,
            score: proposalData.score,
            status: proposalData.status,
            deadline: deadlineStr,
            content: proposalData.content,
            original_content: proposalData.originalContent,
            improved_content: proposalData.improvedContent,
            score_breakdown: proposalData.scoreBreakdown
              ? {
                  structure: proposalData.scoreBreakdown.structure,
                  credibility: proposalData.scoreBreakdown.credibility,
                  persuasion: proposalData.scoreBreakdown.persuasion,
                  clarity: proposalData.scoreBreakdown.clarity,
                  cta: proposalData.scoreBreakdown.callToAction,
                }
              : null,
            issues: proposalData.issues,
            improvements: proposalData.improvements,
          })
          .select()
          .single()

        if (error) throw error

        const proposal = mapDbRowToProposal(data)

        setState((prev) => ({
          ...prev,
          proposals: [proposal, ...prev.proposals],
        }))

        return proposal
      } catch (error) {
        console.error("Error adding proposal:", error)
        return null
      }
    },
    [state.userId],
  )

  const updateProposal = useCallback(async (id: string, updates: Partial<Proposal>) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    try {
      const dbUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (updates.name !== undefined) dbUpdates.name = updates.name
      if (updates.client !== undefined) dbUpdates.client_name = updates.client
      if (updates.industry !== undefined) dbUpdates.industry = updates.industry
      if (updates.value !== undefined) dbUpdates.value = updates.value
      if (updates.score !== undefined) dbUpdates.score = updates.score
      if (updates.status !== undefined) dbUpdates.status = updates.status
      if (updates.deadline !== undefined) {
        if (updates.deadline instanceof Date) {
          dbUpdates.deadline = updates.deadline.toISOString()
        } else if (typeof updates.deadline === "string") {
          dbUpdates.deadline = updates.deadline
        } else {
          dbUpdates.deadline = null
        }
      }
      if (updates.content !== undefined) dbUpdates.content = updates.content
      if (updates.originalContent !== undefined) dbUpdates.original_content = updates.originalContent
      if (updates.improvedContent !== undefined) dbUpdates.improved_content = updates.improvedContent
      if (updates.scoreBreakdown !== undefined) {
        dbUpdates.score_breakdown = {
          structure: updates.scoreBreakdown.structure,
          credibility: updates.scoreBreakdown.credibility,
          persuasion: updates.scoreBreakdown.persuasion,
          clarity: updates.scoreBreakdown.clarity,
          cta: updates.scoreBreakdown.callToAction,
        }
      }
      if (updates.improvements !== undefined) dbUpdates.improvements = updates.improvements
      if (updates.issues !== undefined) dbUpdates.issues = updates.issues

      const { error } = await supabase.from("proposals").update(dbUpdates).eq("id", id)

      if (error) throw error

      setState((prev) => ({
        ...prev,
        proposals: prev.proposals.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
      }))
    } catch (error) {
      console.error("Error updating proposal:", error)
    }
  }, [])

  const deleteProposal = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    try {
      const { error } = await supabase.from("proposals").delete().eq("id", id)

      if (error) throw error

      setState((prev) => ({
        ...prev,
        proposals: prev.proposals.filter((p) => p.id !== id),
      }))
    } catch (error) {
      console.error("Error deleting proposal:", error)
    }
  }, [])

  const getProposal = useCallback((id: string): Proposal | undefined => {
    return proposalMap.current.get(id)
  }, [])

  const stats = useMemo((): ProposalStats => {
    const proposals = state.proposals

    let wonCount = 0
    let lostCount = 0
    let pendingCount = 0
    let draftCount = 0
    let totalScore = 0
    let scoredCount = 0
    let pipelineValue = 0
    let wonValue = 0
    const industryMap = new Map<ProposalIndustry, number>()

    const now = new Date()
    const monthlyMap = new Map<string, { proposals: number; wins: number; value: number }>()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      monthlyMap.set(key, { proposals: 0, wins: 0, value: 0 })
    }

    const activityMap = new Map<string, { proposals: number; wins: number }>()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      activityMap.set(date.toDateString(), { proposals: 0, wins: 0 })
    }

    for (const p of proposals) {
      switch (p.status) {
        case "won":
          wonCount++
          wonValue += p.value
          break
        case "lost":
          lostCount++
          break
        case "pending":
        case "submitted":
          pendingCount++
          pipelineValue += p.value
          break
        case "draft":
          draftCount++
          break
      }

      if (p.score !== null) {
        totalScore += p.score
        scoredCount++
      }

      industryMap.set(p.industry, (industryMap.get(p.industry) || 0) + 1)

      const monthKey = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`
      const monthData = monthlyMap.get(monthKey)
      if (monthData) {
        monthData.proposals++
        if (p.status === "won") {
          monthData.wins++
          monthData.value += p.value
        }
      }

      const dayKey = p.createdAt.toDateString()
      const dayData = activityMap.get(dayKey)
      if (dayData) {
        dayData.proposals++
        if (p.status === "won") {
          dayData.wins++
        }
      }
    }

    const total = proposals.length
    const decidedCount = wonCount + lostCount

    return {
      totalProposals: total,
      wonProposals: wonCount,
      lostProposals: lostCount,
      pendingProposals: pendingCount,
      draftProposals: draftCount,
      winRate: decidedCount > 0 ? Math.round((wonCount / decidedCount) * 100) : 0,
      averageScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
      totalPipelineValue: pipelineValue,
      wonValue,
      monthlyData: Array.from(monthlyMap.entries()).map(([key, data]) => {
        const [year, month] = key.split("-").map(Number)
        return {
          month: new Date(year, month).toLocaleDateString("en-US", { month: "short" }),
          ...data,
        }
      }),
      industryDistribution: Array.from(industryMap.entries()).map(([industry, count]) => ({
        industry,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      })),
      recentActivity: Array.from(activityMap.entries()).map(([date, data]) => ({
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        ...data,
      })),
    }
  }, [state.proposals])

  const getStats = useCallback(() => stats, [stats])

  const getRecentProposals = useCallback(
    (limit = 5) => {
      return state.proposals.slice(0, limit)
    },
    [state.proposals],
  )

  const getUpcomingDeadlines = useCallback(
    (limit = 5) => {
      const now = new Date()
      return state.proposals
        .filter((p) => p.deadline && p.deadline > now && p.status !== "won" && p.status !== "lost")
        .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
        .slice(0, limit)
    },
    [state.proposals],
  )

  const getTopPerformers = useCallback(
    (limit = 5) => {
      return state.proposals
        .filter((p) => p.score !== null)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, limit)
    },
    [state.proposals],
  )

  const refreshProposals = useCallback(async () => {
    await fetchProposals()
  }, [fetchProposals])

  const value: ProposalContextType = {
    ...state,
    addProposal,
    updateProposal,
    deleteProposal,
    getProposal,
    getStats,
    getRecentProposals,
    getUpcomingDeadlines,
    getTopPerformers,
    refreshProposals,
  }

  return <ProposalContext.Provider value={value}>{children}</ProposalContext.Provider>
}

export function useProposals() {
  const context = useContext(ProposalContext)
  if (!context) {
    throw new Error("useProposals must be used within a ProposalProvider")
  }
  return context
}
