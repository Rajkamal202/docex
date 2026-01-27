import { generateWithRetry, QuotaExceededError } from "@/lib/gemini"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const maxDuration = 60

const MAX_CONTENT_LENGTH = 50000

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content, proposalType, proposalId } = body

    if (!content || content.length < 50) {
      return Response.json({
        overallScore: 0,
        categories: {},
        strengths: [],
        weaknesses: [],
        recommendations: [],
        verdict: "Insufficient content to audit",
        hasMoreFeedback: false,
      })
    }

    const truncatedContent =
      content.length > MAX_CONTENT_LENGTH
        ? content.slice(0, MAX_CONTENT_LENGTH) + "\n\n[Content truncated due to length...]"
        : content

    const prompt = `You are an expert proposal auditor, business consultant, and sales strategist. Perform a comprehensive, detailed analysis of this ${proposalType || "business"} proposal.

Proposal content:
${truncatedContent}

Analyze thoroughly and return a JSON object with this EXACT structure:
{
  "overallScore": <number 0-100>,
  "verdict": "<compelling one-line summary of proposal quality, max 80 chars>",
  "executiveSummary": "<2-3 sentence executive summary highlighting the most critical findings>",
  "winProbability": "<Low|Medium|High|Very High>",
  "estimatedReadTime": "<e.g., '5 min read'>",
  "wordCount": <number>,
  "categories": {
    "clarity": {
      "score": <number 0-100>,
      "label": "Clarity & Structure",
      "description": "<one sentence explaining this score>",
      "subMetrics": [
        {"name": "Logical Flow", "score": <0-100>},
        {"name": "Readability", "score": <0-100>},
        {"name": "Section Organization", "score": <0-100>}
      ]
    },
    "persuasion": {
      "score": <number 0-100>,
      "label": "Persuasion & Impact",
      "description": "<one sentence explaining this score>",
      "subMetrics": [
        {"name": "Value Proposition", "score": <0-100>},
        {"name": "Emotional Appeal", "score": <0-100>},
        {"name": "Call to Action", "score": <0-100>}
      ]
    },
    "specificity": {
      "score": <number 0-100>,
      "label": "Specificity & Evidence",
      "description": "<one sentence explaining this score>",
      "subMetrics": [
        {"name": "Concrete Details", "score": <0-100>},
        {"name": "Metrics & Data", "score": <0-100>},
        {"name": "Case Studies/Proof", "score": <0-100>}
      ]
    },
    "professionalism": {
      "score": <number 0-100>,
      "label": "Professionalism",
      "description": "<one sentence explaining this score>",
      "subMetrics": [
        {"name": "Tone & Voice", "score": <0-100>},
        {"name": "Grammar & Polish", "score": <0-100>},
        {"name": "Brand Consistency", "score": <0-100>}
      ]
    },
    "completeness": {
      "score": <number 0-100>,
      "label": "Completeness",
      "description": "<one sentence explaining this score>",
      "subMetrics": [
        {"name": "Required Sections", "score": <0-100>},
        {"name": "Pricing Clarity", "score": <0-100>},
        {"name": "Next Steps", "score": <0-100>}
      ]
    }
  },
  "strengths": [
    {
      "title": "<short title>",
      "description": "<detailed explanation of this strength>",
      "impact": "<High|Medium|Low>"
    }
  ],
  "weaknesses": [
    {
      "title": "<short title>",
      "description": "<detailed explanation of this weakness>",
      "severity": "<Critical|Major|Minor>",
      "location": "<approximate section/area where this issue appears>"
    }
  ],
  "recommendations": [
    {
      "title": "<action title>",
      "description": "<detailed actionable recommendation>",
      "priority": "<High|Medium|Low>",
      "expectedImpact": "<e.g., '+5-10 points' or 'Significant improvement'>",
      "effort": "<Quick Win|Moderate|Significant Rewrite>"
    }
  ],
  "competitiveAnalysis": {
    "differentiators": ["<what makes this proposal stand out>"],
    "missingElements": ["<common winning elements that are missing>"],
    "industryBenchmark": "<Above Average|Average|Below Average>"
  },
  "sentenceIssues": [
    {
      "original": "<problematic sentence or phrase from the proposal>",
      "issue": "<what's wrong with it>",
      "suggestion": "<improved version>",
      "category": "<Clarity|Grammar|Persuasion|Specificity>"
    }
  ]
}

IMPORTANT GUIDELINES:
- Provide 4-6 strengths with detailed descriptions
- Provide 4-6 weaknesses with severity levels and locations
- Provide 5-8 prioritized recommendations with effort estimates
- Provide 3-5 sentence-level issues with specific improvements
- Be specific, actionable, and reference actual content from the proposal
- Focus on EFFECTIVENESS (persuasion, client relevance, approval likelihood)
- Score fairly - 70-85 is average, 85+ is excellent, below 60 needs major work`

    const text = await generateWithRetry(prompt, { maxRetries: 3, jsonMode: true })
    const auditResult = JSON.parse(text)

    const response = {
      overallScore: auditResult.overallScore ?? 0,
      verdict: auditResult.verdict ?? "Analysis complete",
      executiveSummary: auditResult.executiveSummary ?? "",
      winProbability: auditResult.winProbability ?? "Medium",
      estimatedReadTime: auditResult.estimatedReadTime ?? "Unknown",
      wordCount: auditResult.wordCount ?? truncatedContent.split(/\s+/).length,
      categories: auditResult.categories ?? {},
      strengths: auditResult.strengths ?? [],
      weaknesses: auditResult.weaknesses ?? [],
      recommendations: auditResult.recommendations ?? [],
      competitiveAnalysis: auditResult.competitiveAnalysis ?? {
        differentiators: [],
        missingElements: [],
        industryBenchmark: "Average",
      },
      sentenceIssues: auditResult.sentenceIssues ?? [],
      hasMoreFeedback: true,
    }

    if (proposalId) {
      try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Calculate score breakdown from categories
          const scoreBreakdown = {
            structure: auditResult.categories?.clarity?.score || 0,
            credibility: auditResult.categories?.specificity?.score || 0,
            persuasion: auditResult.categories?.persuasion?.score || 0,
            clarity: auditResult.categories?.clarity?.score || 0,
            cta:
              auditResult.categories?.completeness?.subMetrics?.find((m: { name: string }) => m.name === "Next Steps")
                ?.score || 0,
          }

          // Extract issues and improvements
          const issues =
            auditResult.weaknesses?.map(
              (w: { title: string; description: string }) => `${w.title}: ${w.description}`,
            ) || []

          const improvements =
            auditResult.recommendations?.map(
              (r: { title: string; description: string }) => `${r.title}: ${r.description}`,
            ) || []

          await supabase
            .from("proposals")
            .update({
              score: auditResult.overallScore || 0,
              score_breakdown: scoreBreakdown,
              issues,
              improvements,
              updated_at: new Date().toISOString(),
            })
            .eq("id", proposalId)
            .eq("user_id", user.id)

          console.log(`[Audit Proposal] Saved audit results to proposal ${proposalId}`)
        }
      } catch (dbError) {
        console.error("[Audit Proposal] Database error:", dbError)
        // Continue even if save fails
      }
    }

    return Response.json(response)
  } catch (error) {
    console.error("[Audit API] Error:", error)

    if (error instanceof QuotaExceededError) {
      return Response.json(
        {
          error: "quota_exceeded",
          message: error.message,
          retryAfter: error.retryAfter,
        },
        { status: 429 },
      )
    }

    const errorMessage = error instanceof Error ? error.message : ""
    const isRateLimit =
      errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")

    if (isRateLimit) {
      return Response.json(
        {
          error: "rate_limited",
          message: "API rate limit reached. Please try again in a moment.",
          retryAfter: 60000,
        },
        { status: 429 },
      )
    }

    return Response.json(
      {
        error: "server_error",
        message: "An error occurred while auditing the proposal. Please try again.",
      },
      { status: 500 },
    )
  }
}
