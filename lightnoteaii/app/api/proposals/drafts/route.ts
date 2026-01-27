// API route for saving and loading draft proposals
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// GET - Load the most recent draft for the user
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

    // Get the most recent draft proposal
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "draft")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No draft found - return empty
        return Response.json({ success: true, draft: null })
      }
      console.error("[Drafts API] Fetch error:", error)
      return Response.json({ error: "Failed to fetch draft" }, { status: 500 })
    }

    // Parse stored form data and AI proposal from original_content and improved_content
    let formData = null
    let aiProposal = null

    try {
      if (data.original_content) {
        formData = JSON.parse(data.original_content)
      }
    } catch {
      // original_content is not JSON, keep as string
      formData = { rawContent: data.original_content }
    }

    try {
      if (data.improved_content) {
        aiProposal = JSON.parse(data.improved_content)
      }
    } catch {
      // improved_content is not JSON, keep as string
      aiProposal = { rawContent: data.improved_content }
    }

    return Response.json({
      success: true,
      draft: {
        ...data,
        formData,
        aiProposal,
      },
    })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Save or update a draft
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
    const { formData, aiProposal, proposalId } = body

    // If proposalId is provided, update existing proposal
    if (proposalId) {
      const { data, error } = await supabase
        .from("proposals")
        .update({
          original_content: formData ? JSON.stringify(formData) : null,
          improved_content: aiProposal ? JSON.stringify(aiProposal) : null,
          name: formData?.proposalType || aiProposal?.title || "Untitled Draft",
          client_name: formData?.clientName || formData?.clientCompany || "",
          industry: formData?.industry || "other",
          updated_at: new Date().toISOString(),
        })
        .eq("id", proposalId)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("[Drafts API] Update error:", error)
        return Response.json({ error: "Failed to update draft" }, { status: 500 })
      }

      return Response.json({ success: true, draft: data })
    }

    // Otherwise, create a new draft
    const { data, error } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        name: formData?.proposalType || "Untitled Draft",
        client_name: formData?.clientName || formData?.clientCompany || "",
        industry: formData?.industry || "other",
        status: "draft",
        original_content: formData ? JSON.stringify(formData) : null,
        improved_content: aiProposal ? JSON.stringify(aiProposal) : null,
      })
      .select()
      .single()

    if (error) {
      console.error("[Drafts API] Insert error:", error)
      return Response.json({ error: "Failed to create draft" }, { status: 500 })
    }

    return Response.json({ success: true, draft: data })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
