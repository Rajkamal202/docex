import { generateWithRetry } from "@/lib/gemini"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content, sectionType, enhanceType, prompt, proposalId } = body

    if (!content || !sectionType) {
      return Response.json({ success: false, error: "Content and section type are required" }, { status: 400 })
    }

    const enhancePrompt = `You are an expert proposal writer. Your task is to enhance the following section of a business proposal.

**Section Type:** ${sectionType}

**Enhancement Request:** ${prompt}

**Original Content:**
${content}

---

**Instructions:**
1. Maintain the core message and key information
2. Apply the requested enhancement style
3. Keep the same general length unless asked to expand/shorten
4. Preserve any specific numbers, dates, or technical details
5. Make it more compelling and professional
6. Return ONLY the enhanced content, no explanations or headers

**Enhanced Content:**`

    const enhancedContent = await generateWithRetry(enhancePrompt, {
      maxRetries: 2,
      jsonMode: false,
    })

    const trimmedContent = enhancedContent.trim()

    if (proposalId) {
      try {
        const cookieStore = await cookies()
        const supabase = createClient(cookieStore)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          // Fetch current proposal
          const { data: proposal } = await supabase
            .from("proposals")
            .select("content, improved_content")
            .eq("id", proposalId)
            .eq("user_id", user.id)
            .single()

          if (proposal) {
            // Parse existing improved_content or create new
            let improvedData: Record<string, string> = {}
            try {
              improvedData = proposal.improved_content ? JSON.parse(proposal.improved_content) : {}
            } catch {
              improvedData = {}
            }

            // Update the specific section
            improvedData[sectionType] = trimmedContent

            // Update proposal in database
            await supabase
              .from("proposals")
              .update({
                improved_content: JSON.stringify(improvedData),
                updated_at: new Date().toISOString(),
              })
              .eq("id", proposalId)
              .eq("user_id", user.id)

            console.log(`[Enhance Section] Updated proposal ${proposalId}, section: ${sectionType}`)
          }
        }
      } catch (dbError) {
        console.error("[Enhance Section] Database error:", dbError)
        // Continue even if save fails
      }
    }

    return Response.json({
      success: true,
      enhancedContent: trimmedContent,
      enhanceType,
    })
  } catch (error) {
    console.error("Enhancement failed:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Enhancement failed",
      },
      { status: 500 },
    )
  }
}
