// API route for listing proposals and creating new proposals
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Proposals API] Fetch error:", error)
      return Response.json({ error: "Failed to fetch proposals" }, { status: 500 })
    }

    return Response.json({ success: true, proposals: data || [] })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { data, error } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        name: body.name || "Untitled Proposal",
        client_name: body.client || body.clientName || "",
        industry: body.industry || "other",
        value: body.value || 0,
        score: body.score || null,
        status: body.status || "draft",
        deadline: body.deadline || null,
        content: body.content || null,
        original_content: body.originalContent || null,
        improved_content: body.improvedContent || null,
        score_breakdown: body.scoreBreakdown || null,
        issues: body.issues || [],
        improvements: body.improvements || [],
      })
      .select()
      .single()

    if (error) {
      console.error("[Proposals API] Insert error:", error)
      return Response.json({ error: "Failed to create proposal" }, { status: 500 })
    }

    return Response.json({ success: true, proposal: data })
  } catch (error) {
    console.error("[Proposals API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
