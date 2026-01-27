import { rewriteProposal, generateImprovements } from "@/lib/gemini"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { content, tone, issues } = await req.json()

    if (!content || content.length < 50) {
      return Response.json(
        {
          error: "Proposal content is too short to rewrite",
        },
        { status: 400 },
      )
    }

    // First, rewrite the proposal
    const improvedContent = await rewriteProposal(content, tone, issues)

    // Then, generate the improvement comparison
    const improvements = await generateImprovements(content, improvedContent)

    return Response.json({
      success: true,
      improvedContent,
      ...improvements,
    })
  } catch (error) {
    console.error("[Studio Rewrite API] Error:", error)

    const errorMessage = error instanceof Error ? error.message : ""
    const isRateLimit = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")

    return Response.json(
      {
        success: false,
        error: isRateLimit ? "Rate limit reached. Please wait a moment and try again." : "Failed to rewrite proposal",
        isRateLimited: isRateLimit,
      },
      { status: isRateLimit ? 429 : 500 },
    )
  }
}
