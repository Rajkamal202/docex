/**
 * Backend API for submitting clarification answers
 * Ensures answers are persisted immediately and flow advances deterministically
 */

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { proposalId, answers } = body

    if (!proposalId) {
      return Response.json({ error: "proposalId is required" }, { status: 400 })
    }

    if (!answers || typeof answers !== "object") {
      return Response.json({ error: "answers object is required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Forward to proposal-context API
    const response = await fetch(new URL("/api/proposal-context", req.url).toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify({
        proposalId,
        clarificationAnswers: answers,
      }),
    })

    const result = await response.json()

    return Response.json(result)
  } catch (error) {
    console.error("[clarifications] Error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
