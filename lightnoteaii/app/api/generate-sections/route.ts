/**
 * Proposal generation - SINGLE AI CALL to avoid timeout
 * Uses EXISTING Supabase schema - reads context from original_content, stores sections in improved_content
 */

import { generateWithRetry, QuotaExceededError } from "@/lib/gemini"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const maxDuration = 60

function safeParseJSON(value: string | null | undefined, defaultValue: any = {}): any {
  if (!value) return defaultValue
  try {
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

function buildFullProposalPrompt(context: any): string {
  return `You are a senior business consultant creating a complete proposal. Generate ALL sections in ONE response.

**CLIENT CONTEXT:**
- Client: ${context.client_name || context.clientName || "Client"}
- Company: ${context.client_company || context.clientCompany || "Their Company"}
- Industry: ${context.industry || "Business Services"}
- Challenge: ${context.problem_statement || context.problem || "Business improvement needed"}
- Solution Approach: ${context.solution || "To be defined"}
- Deliverables: ${context.deliverables || "To be defined based on scope"}
- Budget: ${context.budget || "To be discussed"}
- Timeline: ${context.timeline || "To be determined"}
- Tone: ${context.tone || "Professional"}

**OUTPUT FORMAT:** Return a JSON object with these exact keys:
{
  "executive_summary": "3-4 paragraphs opening with insight about their situation, demonstrating understanding, previewing approach, stating expected outcome",
  "problem_statement": "Reframe their challenge showing: immediate pain point, underlying business impact, consequences of inaction",
  "solution": "Your recommended approach with specific methodology and WHY it fits their situation",
  "deliverables": "5-8 specific deliverables as bullet points, each with clear acceptance criteria",
  "timeline": "Project schedule with named phases, activities, and key milestones",
  "investment": "Pricing breakdown framed as investment with payment terms",
  "why_us": "2-3 relevant experience points and what makes your approach different",
  "next_steps": "3-4 numbered action items starting with a frictionless immediate step"
}

**RULES:**
- NO generic phrases like "industry standard" or "best practices" without specifics
- Every sentence must add decision-making value
- Be specific to THEIR situation, not generic templates
- Write as a senior consultant who has done this before
- Each section minimum 100 words

Return ONLY valid JSON, no markdown formatting.`
}

export async function POST(req: Request) {
  const startTime = Date.now()

  try {
    const body = await req.json()
    const { proposalId, regenerateSection } = body

    if (!proposalId) {
      return Response.json({ error: "proposalId is required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !proposal) {
      return Response.json({ error: "Proposal not found" }, { status: 404 })
    }

    const proposalData = safeParseJSON(proposal.original_content, {})
    const context = proposalData.context || proposalData

    // Update status to generating
    await supabase
      .from("proposals")
      .update({
        original_content: JSON.stringify({
          ...proposalData,
          generation_status: "generating",
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", proposalId)

    const prompt = buildFullProposalPrompt(context)

    console.log("[generate-sections] Starting single AI call for proposal:", proposalId)

    const rawResponse = await generateWithRetry(prompt, {
      maxRetries: 2,
      jsonMode: true,
    })

    // Parse the JSON response
    let generatedSections: Record<string, string>
    try {
      // Clean any markdown formatting
      const cleanedResponse = rawResponse
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/gi, "")
        .trim()

      generatedSections = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("[generate-sections] JSON parse failed, attempting extraction:", parseError)

      // Fallback: try to extract JSON from response
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        generatedSections = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Failed to parse AI response as JSON")
      }
    }

    // Validate we have the required sections
    const requiredSections = ["executive_summary", "problem_statement", "solution", "deliverables"]
    for (const section of requiredSections) {
      if (!generatedSections[section] || generatedSections[section].length < 50) {
        generatedSections[section] = generatedSections[section] || `Please regenerate the ${section} section.`
      }
    }

    const formattedContent = formatSectionsAsContent(generatedSections)

    // Save all sections at once
    await supabase
      .from("proposals")
      .update({
        improved_content: JSON.stringify(generatedSections),
        content: formattedContent,
        original_content: JSON.stringify({
          ...proposalData,
          generation_status: "complete",
        }),
        status: "draft",
        updated_at: new Date().toISOString(),
      })
      .eq("id", proposalId)

    console.log("[generate-sections] Complete in", Date.now() - startTime, "ms")

    return Response.json({
      success: true,
      proposalId,
      sections: generatedSections,
      formattedContent,
      processingTime: Date.now() - startTime,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[generate-sections] Error:", error)

    if (error instanceof QuotaExceededError) {
      return Response.json(
        {
          success: false,
          error: error.message,
          isDailyLimit: error.isDailyLimit,
          retryAfter: error.retryAfter,
          isRateLimited: true,
        },
        { status: 429 },
      )
    }

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function formatSectionsAsContent(sections: Record<string, string>): string {
  const order = [
    { key: "executive_summary", label: "EXECUTIVE SUMMARY" },
    { key: "problem_statement", label: "THE CHALLENGE" },
    { key: "solution", label: "RECOMMENDED APPROACH" },
    { key: "deliverables", label: "DELIVERABLES" },
    { key: "timeline", label: "PROJECT TIMELINE" },
    { key: "investment", label: "INVESTMENT" },
    { key: "why_us", label: "WHY WORK WITH US" },
    { key: "next_steps", label: "NEXT STEPS" },
  ]

  return order
    .map(({ key, label }) => {
      const content = sections[key]
      if (!content) return null
      return `## ${label}\n\n${content}`
    })
    .filter(Boolean)
    .join("\n\n")
}
