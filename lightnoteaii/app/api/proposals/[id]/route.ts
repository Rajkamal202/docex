// API route for single proposal operations: GET, PUT, DELETE
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("proposals").select("*").eq("id", id).eq("user_id", user.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        return Response.json({ error: "Proposal not found" }, { status: 404 })
      }
      console.error("[Proposal API] Fetch error:", error)
      return Response.json({ error: "Failed to fetch proposal" }, { status: 500 })
    }

    return Response.json({ success: true, proposal: data })
  } catch (error) {
    console.error("[Proposal API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
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

    // Build update object dynamically based on provided fields
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (body.name !== undefined) updates.name = body.name
    if (body.client !== undefined) updates.client_name = body.client
    if (body.clientName !== undefined) updates.client_name = body.clientName
    if (body.industry !== undefined) updates.industry = body.industry
    if (body.value !== undefined) updates.value = body.value
    if (body.score !== undefined) updates.score = body.score
    if (body.status !== undefined) updates.status = body.status
    if (body.deadline !== undefined) updates.deadline = body.deadline
    if (body.content !== undefined) updates.content = body.content
    if (body.originalContent !== undefined) updates.original_content = body.originalContent
    if (body.improvedContent !== undefined) updates.improved_content = body.improvedContent
    if (body.scoreBreakdown !== undefined) updates.score_breakdown = body.scoreBreakdown
    if (body.issues !== undefined) updates.issues = body.issues
    if (body.improvements !== undefined) updates.improvements = body.improvements
    if (body.templateId !== undefined) updates.template_id = body.templateId
    if (body.proposalType !== undefined) updates.proposal_type = body.proposalType
    if (body.sections !== undefined) updates.sections = body.sections
    if (body.formInputs !== undefined) updates.form_inputs = body.formInputs
    if (body.generationStatus !== undefined) updates.generation_status = body.generationStatus

    const { data, error } = await supabase
      .from("proposals")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return Response.json({ error: "Proposal not found" }, { status: 404 })
      }
      console.error("[Proposal API] Update error:", error)
      return Response.json({ error: "Failed to update proposal" }, { status: 500 })
    }

    return Response.json({ success: true, proposal: data })
  } catch (error) {
    console.error("[Proposal API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("proposals").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("[Proposal API] Delete error:", error)
      return Response.json({ error: "Failed to delete proposal" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("[Proposal API] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
