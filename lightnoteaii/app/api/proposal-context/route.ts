/**
 * Backend API for managing proposal context and clarifications
 * Uses EXISTING Supabase schema - stores context in original_content column
 *
 * GET: Retrieve current proposal context and clarification state
 * POST: Create new proposal context or submit clarification answers
 */

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// solution, budget, timeline are OPTIONAL - will use defaults if not provided
const REQUIRED_FIELDS = [{ key: "problem_statement", label: "Problem/Challenge", minLength: 5 }] as const

const OPTIONAL_FIELDS = [
  { key: "solution", label: "Solution", minLength: 5 },
  { key: "budget", label: "Budget", minLength: 1 },
  { key: "timeline", label: "Timeline", minLength: 1 },
] as const

const CLARIFICATION_QUESTIONS: Record<string, { question: string; reason: string }> = {
  problem_statement: {
    question: "What problem or need does the client have? What are they trying to achieve?",
    reason: "Helps create a proposal that directly addresses the client's pain points.",
  },
  solution: {
    question: "What solution are you proposing to solve this problem?",
    reason: "Defines the core offering and value you're providing.",
  },
  budget: {
    question: "What's the budget range for this project?",
    reason: "Helps frame the investment section appropriately.",
  },
  timeline: {
    question: "What's the expected timeline for delivery?",
    reason: "Enables a realistic project schedule.",
  },
}

interface Clarification {
  question_id: string
  field_key: string
  question: string
  reason: string
  answered: boolean
  answer: string | null
  asked_at: string
  answered_at: string | null
}

interface ProposalContext {
  client_name?: string
  client_company?: string
  proposal_type?: string
  tone?: string
  template?: string
  industry?: string
  problem_statement?: string
  problem?: string // Frontend sends this
  solution?: string
  goals?: string
  budget?: string
  timeline?: string
  deliverables?: string
  unique_value?: string
  additional_context?: string
  clarifications?: Clarification[]
  generation_status?: string
}

function safeParseJSON(value: string | null | undefined, defaultValue: any = {}): any {
  if (!value) return defaultValue
  try {
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

// GET: Retrieve proposal context and clarification state
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const proposalId = searchParams.get("proposalId")

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (proposalId) {
      const { data, error } = await supabase
        .from("proposals")
        .select("id, original_content, improved_content, content, status")
        .eq("id", proposalId)
        .eq("user_id", user.id)
        .single()

      if (error || !data) {
        return Response.json({ error: "Proposal not found" }, { status: 404 })
      }

      const contextData = safeParseJSON(data.original_content, {})
      const sectionsData = safeParseJSON(data.improved_content, {})

      return Response.json({
        success: true,
        proposalId: data.id,
        context: contextData.context || contextData,
        clarifications: contextData.clarifications || [],
        sections: sectionsData,
        generationStatus: contextData.generation_status || data.status || "pending",
      })
    }

    return Response.json({
      success: true,
      proposalId: null,
      context: {},
      clarifications: [],
      sections: {},
      generationStatus: "pending",
    })
  } catch (error) {
    console.error("[proposal-context GET] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: Create new proposal context or submit clarification answers
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { proposalId, context, clarificationAnswers } = body

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // MODE: Submitting clarification answers
    if (proposalId && clarificationAnswers) {
      console.log("[proposal-context] Processing clarification answers:", { proposalId, clarificationAnswers })

      const { data: proposal, error: fetchError } = await supabase
        .from("proposals")
        .select("original_content")
        .eq("id", proposalId)
        .eq("user_id", user.id)
        .single()

      if (fetchError || !proposal) {
        return Response.json({ error: "Proposal not found" }, { status: 404 })
      }

      const existingData = safeParseJSON(proposal.original_content, {})
      const currentContext: ProposalContext = existingData.context || existingData
      const currentClarifications: Clarification[] = existingData.clarifications || []

      const updatedClarifications = currentClarifications.map((c) => {
        if (!c.answered) {
          const answer = clarificationAnswers[c.field_key] || clarificationAnswers["additional_context"] || ""
          return {
            ...c,
            answered: true,
            answer: answer.trim() || "User provided response",
            answered_at: new Date().toISOString(),
          }
        }
        return c
      })

      const updatedContext = { ...currentContext }
      for (const [fieldKey, answer] of Object.entries(clarificationAnswers)) {
        if (answer && typeof answer === "string" && answer.trim()) {
          const trimmedAnswer = answer.trim()

          if (fieldKey === "problem_statement" || fieldKey === "problem") {
            updatedContext.problem_statement = trimmedAnswer
            updatedContext.problem = trimmedAnswer
          } else if (fieldKey === "solution") {
            updatedContext.solution = trimmedAnswer
          } else if (fieldKey === "budget") {
            updatedContext.budget = trimmedAnswer
          } else if (fieldKey === "timeline") {
            updatedContext.timeline = trimmedAnswer
          } else if (fieldKey === "additional_context") {
            if (!updatedContext.problem_statement || updatedContext.problem_statement.length < 5) {
              updatedContext.problem_statement = trimmedAnswer
              updatedContext.problem = trimmedAnswer
            } else {
              updatedContext.additional_context = updatedContext.additional_context
                ? `${updatedContext.additional_context}\n${trimmedAnswer}`
                : trimmedAnswer
            }
          }
        }
      }

      const { error: updateError } = await supabase
        .from("proposals")
        .update({
          original_content: JSON.stringify({
            context: updatedContext,
            clarifications: updatedClarifications,
            generation_status: "ready",
          }),
          status: "draft",
          updated_at: new Date().toISOString(),
        })
        .eq("id", proposalId)
        .eq("user_id", user.id)

      if (updateError) {
        console.error("[proposal-context POST] Update error:", updateError)
        return Response.json({ error: "Failed to update proposal" }, { status: 500 })
      }

      console.log("[proposal-context] Clarification processed, ready for generation")

      return Response.json({
        success: true,
        proposalId,
        context: updatedContext,
        clarifications: updatedClarifications,
        needsClarification: false,
        pendingQuestions: [],
        generationStatus: "ready",
      })
    }

    // MODE: Creating new proposal with initial context
    if (context) {
      const problemValue = context.problem || context.problem_statement || context.problemStatement || ""

      console.log("[proposal-context] Creating proposal with context:", {
        problemValue,
        problemLength: problemValue.length,
        hasTemplate: !!context.template,
        hasBudget: !!context.budget,
        hasTimeline: !!context.timeline,
      })

      const mappedContext: ProposalContext = {
        client_name: context.clientName || context.client_name || "",
        client_company: context.clientCompany || context.client_company || "",
        proposal_type: context.proposalType || context.proposal_type || "Business Proposal",
        tone: context.tone || "professional",
        template: context.template || "professional",
        industry: context.industry || context.clientIndustry || "general",
        problem_statement: problemValue,
        problem: problemValue,
        solution: context.solution || "",
        goals: context.goals || "",
        budget: context.budget || "To be discussed",
        timeline: context.timeline || "To be determined",
        deliverables: context.deliverables || "",
        unique_value: context.uniqueValue || context.unique_value || "",
        additional_context: context.additionalContext || context.additional_context || "",
      }

      const hasProblem = (mappedContext.problem_statement || "").trim().length >= 1

      let needsClarification = false
      let pendingQuestions: Clarification[] = []

      if (!hasProblem) {
        needsClarification = true
        pendingQuestions = [
          {
            question_id: `problem_statement_${Date.now()}`,
            field_key: "problem_statement",
            question: CLARIFICATION_QUESTIONS.problem_statement.question,
            reason: CLARIFICATION_QUESTIONS.problem_statement.reason,
            answered: false,
            answer: null,
            asked_at: new Date().toISOString(),
            answered_at: null,
          },
        ]
        console.log("[proposal-context] Problem is empty, asking for clarification")
      } else {
        console.log(
          "[proposal-context] Problem provided, proceeding without clarification:",
          mappedContext.problem_statement,
        )
      }

      const { data: newProposal, error: insertError } = await supabase
        .from("proposals")
        .insert({
          user_id: user.id,
          name: `Proposal for ${mappedContext.client_name || mappedContext.client_company || "Client"}`,
          client_name: mappedContext.client_name || mappedContext.client_company || "",
          industry: mappedContext.industry || "general",
          status: "draft",
          original_content: JSON.stringify({
            context: mappedContext,
            clarifications: pendingQuestions,
            generation_status: needsClarification ? "clarifying" : "ready",
          }),
          improved_content: JSON.stringify({}),
          content: "",
        })
        .select("id")
        .single()

      if (insertError || !newProposal) {
        console.error("[proposal-context POST] Insert error:", insertError)
        return Response.json({ error: "Failed to create proposal" }, { status: 500 })
      }

      console.log("[proposal-context] Created proposal:", {
        id: newProposal.id,
        needsClarification,
        hasProblem,
        problemLength: (mappedContext.problem_statement || "").length,
      })

      return Response.json({
        success: true,
        proposalId: newProposal.id,
        context: mappedContext,
        clarifications: pendingQuestions,
        needsClarification,
        pendingQuestions,
        generationStatus: needsClarification ? "clarifying" : "ready",
      })
    }

    return Response.json({ error: "Missing context or clarificationAnswers" }, { status: 400 })
  } catch (error) {
    console.error("[proposal-context POST] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
