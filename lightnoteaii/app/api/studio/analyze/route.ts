import { analyzeProposal } from "@/lib/gemini"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { content, tone } = await req.json()

    if (!content || content.length < 50) {
      return Response.json(
        {
          error: "Proposal content is too short to analyze",
        },
        { status: 400 },
      )
    }

    const analysis = await analyzeProposal(content, tone)

    return Response.json({
      success: true,
      ...analysis,
    })
  } catch (error) {
    console.error("[Studio Analyze API] Error:", error)

    const errorMessage = error instanceof Error ? error.message : ""
    const isRateLimit = errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED")

    return Response.json(
      {
        success: false,
        error: isRateLimit ? "Rate limit reached. Please wait a moment and try again." : "Failed to analyze proposal",
        isRateLimited: isRateLimit,
      },
      { status: isRateLimit ? 429 : 500 },
    )
  }
}
