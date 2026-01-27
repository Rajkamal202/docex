/**
 * Main proposal generation API
 * Supports THREE request modes:
 * A) Initial generation: { formData }
 * B) Clarification submission: { proposalId, clarificationAnswers }
 * C) Resume generation: { proposalId }
 */

import { QuotaExceededError } from "@/lib/gemini"
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

function toStringArray(value: any): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.map((item: any) => String(item).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean)
  }
  return []
}

export async function POST(req: Request) {
  const startTime = Date.now()
  let debugStep = "init"

  try {
    // STEP 1: Parse request body
    debugStep = "parse_body"
    const body = await req.json()

    const proposalId = body.proposalId
    const clarificationAnswers = body.clarificationAnswers
    const formData = body.formData || body.proposalData
    const skipValidation = body.skipValidation === true

    const hasProposalId = !!proposalId
    const hasClarificationAnswers = clarificationAnswers && Object.keys(clarificationAnswers).length > 0
    const hasFormData = !!formData

    const hasMinimumData = typeof formData === "object" && (formData.problem?.trim() || formData.proposalType?.trim())

    if (!hasMinimumData && !hasProposalId) {
      return Response.json(
        { success: false, error: "Please provide proposal details", debugStep: "validation" },
        { status: 400 },
      )
    }

    // STEP 2: Auth
    debugStep = "auth"
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      return Response.json({ success: false, error: "Auth error: " + authError.message, debugStep }, { status: 401 })
    }

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized - no user", debugStep }, { status: 401 })
    }

    let currentProposalId = proposalId

    // STEP 3: Mode A - Create proposal
    if (!hasProposalId && hasFormData) {
      debugStep = "mode_a_create"

      const problemValue = formData.problem || formData.problem_statement || formData.problemStatement || ""

      const mappedContext = {
        client_name: formData.clientName || formData.client_name || "",
        client_company: formData.clientCompany || formData.client_company || "",
        proposal_type: formData.proposalType || formData.proposal_type || "Business Proposal",
        tone: formData.tone || "professional",
        template: formData.template || "professional",
        industry: formData.industry || formData.clientIndustry || "general",
        problem_statement: problemValue,
        problem: problemValue,
        solution: formData.solution || "",
        goals: formData.goals || "",
        budget: formData.budget || "To be discussed",
        timeline: formData.timeline || "To be determined",
        deliverables: formData.deliverables || "",
        unique_value: formData.uniqueValue || formData.unique_value || "",
        additional_context: formData.additionalContext || formData.additional_context || "",
      }

      const hasProblem = (mappedContext.problem_statement || "").trim().length >= 1

      let needsClarification = false
      let pendingQuestions: any[] = []

      if (!hasProblem && !skipValidation) {
        needsClarification = true
        pendingQuestions = [
          {
            question_id: `problem_statement_${Date.now()}`,
            field_key: "problem_statement",
            question: "What problem or need does the client have? What are they trying to achieve?",
            reason: "Helps create a proposal that directly addresses the client's pain points.",
            answered: false,
            answer: null,
            asked_at: new Date().toISOString(),
            answered_at: null,
          },
        ]
      }

      debugStep = "mode_a_insert"
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
        return Response.json(
          { success: false, error: "DB Insert failed: " + (insertError?.message || "No data returned"), debugStep },
          { status: 500 },
        )
      }

      currentProposalId = newProposal.id

      if (needsClarification) {
        return Response.json({
          success: false,
          needsClarification: true,
          proposalId: currentProposalId,
          clarifyingQuestions: pendingQuestions.map((q) => ({
            question: q.question,
            reason: q.reason,
            field: q.field_key,
          })),
          message: "I need a bit more context to create a compelling proposal.",
          debugStep: "clarification_needed",
        })
      }
    }

    // STEP 4: Mode B - Clarification answers
    if (hasProposalId && hasClarificationAnswers) {
      debugStep = "mode_b_clarification"

      const { data: proposal, error: fetchError } = await supabase
        .from("proposals")
        .select("original_content")
        .eq("id", proposalId)
        .eq("user_id", user.id)
        .single()

      if (fetchError || !proposal) {
        return Response.json(
          { success: false, error: "Proposal not found: " + (fetchError?.message || ""), debugStep },
          { status: 404 },
        )
      }

      const existingData = safeParseJSON(proposal.original_content, {})
      const currentContext = existingData.context || existingData
      const currentClarifications = existingData.clarifications || []

      const updatedClarifications = currentClarifications.map((c: any) => {
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
              updatedContext.additional_context = (updatedContext.additional_context || "") + "\n" + trimmedAnswer
            }
          }
        }
      }

      debugStep = "mode_b_update"
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
        return Response.json(
          { success: false, error: "DB Update failed: " + updateError.message, debugStep },
          { status: 500 },
        )
      }

      currentProposalId = proposalId
    }

    // STEP 5: Mode C - Resume
    if (hasProposalId && !hasClarificationAnswers && !hasFormData) {
      debugStep = "mode_c_resume"

      const { data: proposal, error } = await supabase
        .from("proposals")
        .select("id, user_id, original_content")
        .eq("id", proposalId)
        .single()

      if (error || !proposal) {
        return Response.json({ success: false, error: "Resume: Proposal not found", debugStep }, { status: 404 })
      }

      if (proposal.user_id !== user.id) {
        return Response.json({ success: false, error: "Unauthorized", debugStep }, { status: 401 })
      }

      currentProposalId = proposalId
    }

    // STEP 6: Fetch proposal for generation
    debugStep = "fetch_for_gen"
    const { data: proposalForGen, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", currentProposalId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !proposalForGen) {
      return Response.json(
        { success: false, error: "Fetch for gen failed: " + (fetchError?.message || ""), debugStep },
        { status: 404 },
      )
    }

    const proposalData = safeParseJSON(proposalForGen.original_content, {})
    const context = proposalData.context || proposalData

    // STEP 7: Update status
    debugStep = "update_status_generating"
    await supabase
      .from("proposals")
      .update({
        original_content: JSON.stringify({
          ...proposalData,
          generation_status: "generating",
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentProposalId)

    // STEP 8: AI Generation
    debugStep = "ai_import"
    const { generateWithRetry } = await import("@/lib/gemini")

    debugStep = "ai_build_prompt"
    const prompt = buildFullProposalPrompt(context)

    debugStep = "ai_call"
    let generatedSections: Record<string, string>
    try {
      const rawResponse = await generateWithRetry(prompt, { maxRetries: 2, jsonMode: true })

      debugStep = "ai_parse"
      const cleanedResponse = rawResponse
        .replace(/```json\n?/gi, "")
        .replace(/```\n?/gi, "")
        .trim()

      generatedSections = JSON.parse(cleanedResponse)
    } catch (parseError: any) {
      if (parseError instanceof QuotaExceededError) {
        return Response.json(
          {
            success: false,
            error: parseError.message,
            isDailyLimit: parseError.isDailyLimit,
            retryAfter: parseError.retryAfter,
            isRateLimited: true,
            proposalId: currentProposalId,
            debugStep,
          },
          { status: 429 },
        )
      }

      return Response.json(
        {
          success: false,
          error: "AI generation failed: " + (parseError?.message || "Unknown"),
          proposalId: currentProposalId,
          debugStep,
        },
        { status: 500 },
      )
    }

    // STEP 9: Validate sections
    debugStep = "validate_sections"
    const requiredSections = ["executive_summary", "problem_statement", "solution", "deliverables"]
    for (const section of requiredSections) {
      if (!generatedSections[section] || generatedSections[section].length < 50) {
        generatedSections[section] = generatedSections[section] || `Content for ${section} section.`
      }
    }

    // STEP 10: Save
    debugStep = "save_final"
    const formattedContent = formatSectionsAsContent(generatedSections)

    const { error: saveError } = await supabase
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
      .eq("id", currentProposalId)

    if (saveError) {
      return Response.json({ success: false, error: "Save failed: " + saveError.message, debugStep }, { status: 500 })
    }

    const clientName = context.client_name || context.clientName || formData?.clientName || "Client"
    const clientCompany = context.client_company || context.clientCompany || formData?.clientCompany || "Company"
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

    return Response.json({
      success: true,
      proposal: {
        title: `Proposal for ${clientName}`,
        summary: generatedSections.executive_summary || "",
        problemStatement: generatedSections.problem_statement || "",
        solution: generatedSections.solution || "",
        deliverables: toStringArray(generatedSections.deliverables),
        timeline: generatedSections.timeline || "",
        investment: generatedSections.investment || "",
        whyUs: generatedSections.why_us || "",
        nextSteps: toStringArray(generatedSections.next_steps),
        metadata: {
          preparedFor: clientName,
          company: clientCompany,
          preparedBy: "Your Name",
          date: today,
          industry: context.industry || formData?.industry || "Business Services",
        },
      },
      savedProposal: { id: currentProposalId },
      proposalId: currentProposalId,
      processingTime: Date.now() - startTime,
      generatedAt: new Date().toISOString(),
      debugStep: "complete",
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    return Response.json(
      {
        success: false,
        error: `Error at step [${debugStep}]: ${errorMessage}`,
        debugStep,
        processingTime: duration,
      },
      { status: 500 },
    )
  }
}

function buildFullProposalPrompt(context: any): string {
  const clientName = context.client_name || context.clientName || "the client"
  const clientCompany = context.client_company || context.clientCompany || ""
  const industry = context.industry || "general"
  const businessGoal = context.goal || context.businessGoal || "grow their business"
  const problem = context.problem_statement || context.problem || ""
  const solution = context.solution || ""
  const budget = context.budget || ""
  const timeline = context.timeline || ""
  const tone = context.tone || "Professional"
  const additionalContext = context.additional_context || ""
  const proposalType = context.proposal_type || context.proposalType || ""

  const websitePages = context.websitePages || context.website_pages || ""
  const websiteFeatures = context.websiteFeatures || context.website_features || ""
  const primaryAction = context.primaryAction || context.primary_action || ""

  const industryContext = getIndustryContext(industry)
  const goalContext = getGoalContext(businessGoal)

  const industryLower = industry.toLowerCase()
  const proposalTypeLower = proposalType.toLowerCase()
  const problemLower = problem.toLowerCase()
  const solutionLower = solution.toLowerCase()

  // Website project detection - be VERY aggressive
  const isWebsiteProject =
    // Direct website mentions
    proposalTypeLower.includes("website") ||
    problemLower.includes("website") ||
    solutionLower.includes("website") ||
    problemLower.includes("online presence") ||
    problemLower.includes("web design") ||
    // Restaurant/hospitality industry (they almost always need websites)
    industryLower.includes("restaurant") ||
    industryLower.includes("hospitality") ||
    industryLower.includes("food") ||
    industryLower.includes("dining") ||
    industryLower.includes("cafe") ||
    industryLower.includes("bar") ||
    // Other local businesses that typically need websites
    industryLower.includes("retail") ||
    industryLower.includes("salon") ||
    industryLower.includes("spa") ||
    industryLower.includes("fitness") ||
    industryLower.includes("gym") ||
    industryLower.includes("real estate") ||
    // Website-specific data was collected
    websitePages !== "" ||
    websiteFeatures !== "" ||
    primaryAction !== ""

  // Removed debug console.log at line 486-500

  const buildWebsiteDeliverables = () => {
    const deliverables = []

    // Parse pages
    if (websitePages.includes("4-5")) {
      deliverables.push("Custom 5-page responsive website (Home, About, Services/Menu, Gallery, Contact)")
    } else if (websitePages.includes("6-8")) {
      deliverables.push("Custom 7-page responsive website with expanded sections")
    } else if (websitePages.includes("10+")) {
      deliverables.push("Custom 10+ page website with blog and multiple service pages")
    } else {
      // Use specific deliverable if available, fallback to general
      deliverables.push(industryContext.specificDeliverables[0] || "Custom website pages")
    }

    // Parse features
    const featureList = websiteFeatures.toLowerCase()
    if (featureList.includes("contact")) deliverables.push("Contact form with email notifications")
    if (featureList.includes("booking") || featureList.includes("reservation"))
      deliverables.push("Online booking/reservation system integration")
    if (featureList.includes("menu") || featureList.includes("price"))
      deliverables.push("Interactive menu/price list display")
    if (featureList.includes("gallery") || featureList.includes("photo"))
      deliverables.push("Photo gallery with lightbox")
    if (featureList.includes("map")) deliverables.push("Google Maps integration with directions")
    if (featureList.includes("call") || featureList.includes("phone"))
      deliverables.push("Click-to-call button (mobile)")
    if (featureList.includes("social")) deliverables.push("Social media integration")
    if (featureList.includes("review")) deliverables.push("Customer reviews/testimonials display")

    // Always include these for websites
    deliverables.push("Mobile-responsive design (works on all devices)")
    deliverables.push("Basic SEO setup (meta tags, sitemap, local search)")
    deliverables.push("2 rounds of revisions included")
    deliverables.push("Launch support and handover documentation")

    return deliverables
  }

  if (isWebsiteProject) {
    return buildWebsiteProposalPrompt({
      clientName,
      clientCompany,
      industry,
      businessGoal,
      problem,
      solution,
      budget,
      timeline,
      tone,
      additionalContext,
      websitePages,
      websiteFeatures,
      primaryAction,
      industryContext,
      goalContext,
      deliverables: buildWebsiteDeliverables(),
    })
  }

  // ... existing consulting prompt code ...
  return buildConsultingProposalPrompt({
    clientName,
    clientCompany,
    industry,
    businessGoal,
    problem,
    solution,
    budget,
    timeline,
    tone,
    additionalContext,
    industryContext,
    goalContext,
  })
}

function buildWebsiteProposalPrompt(ctx: any): string {
  const {
    clientName,
    clientCompany,
    industry,
    businessGoal,
    problem,
    solution,
    budget,
    timeline,
    primaryAction,
    industryContext,
    goalContext,
    deliverables,
  } = ctx

  const clientDisplay = clientCompany || clientName
  const primaryActionText = primaryAction || "contact them or make a reservation"

  return `You are writing a WEBSITE PROPOSAL for a ${industry} business. This is NOT a consulting proposal.

**CRITICAL: THIS IS A WEBSITE BUILD, NOT CONSULTING**

ABSOLUTELY BANNED - DO NOT USE:
- "strategy document" / "strategic planning" / "optimization phase"
- "training sessions" / "workshops" / "discovery phase"
- "customer flow mapping" / "process optimization"
- "operational" / "synergy" / "holistic" / "robust"
- "leverage" / "comprehensive solution" / "innovative approach"
- "industry best practices" / "proven methodologies"
- Any abstract consulting language

REQUIRED - USE THESE INSTEAD:
- Specific PAGE NAMES: "Homepage", "About page", "Services/Menu page", "Contact page"
- Specific FEATURES: "contact form", "click-to-call button", "Google Maps embed"
- Specific USER ACTIONS: "fill out the form", "tap to call", "make a reservation"
- Specific OUTCOMES: "more phone calls", "more reservations", "more walk-ins"

**CLIENT CONTEXT:**
- Business: ${clientDisplay}
- Industry: ${industry}
- Their Problem: ${problem || industryContext.problemExamples[0]}
- What They Want: A website that helps them ${businessGoal.toLowerCase()}
- Primary Goal: Get visitors to ${primaryActionText}
- Budget: ${budget || "To be discussed"}
- Timeline: ${timeline || "4-6 weeks"}

**THEIR CUSTOMERS:**
${industryContext.customerLanguage}

**GENERATE THIS EXACT JSON:**

{
  "executive_summary": "[MAX 60 WORDS. 3-4 sentences only.]
  
  Start with their customer: 'When a ${industryContext.customerLanguage.split(",")[0].toLowerCase()}, they need to find you fast.'
  
  Then the problem: '${problem || industryContext.problemExamples[0]}'
  
  Then what we build: 'We'll build a mobile-friendly website with [key features] so visitors can [primary action] in seconds.'
  
  Then the outcome: 'Result: more ${primaryActionText.includes("call") ? "phone calls" : primaryActionText.includes("reservation") ? "reservations" : "customers"}.'
  
  NO consulting language. NO 'we are pleased.' Just direct value.",

  "problem_statement": "[3 short paragraphs. Each MAX 2 sentences.]
  
  PARAGRAPH 1 - What's happening now:
  Right now, when someone searches for a ${industry.toLowerCase()} like yours, [describe what they find - or don't find]. ${problem || industryContext.problemExamples[0]}
  
  PARAGRAPH 2 - What it's costing:
  Every day without a proper website, potential customers are [specific lost action: calling competitors, giving up, choosing someone else]. That's real money walking out the door.
  
  PARAGRAPH 3 - Why they need a real solution:
  A DIY website or outdated site doesn't cut it anymore. ${industryContext.customerLanguage.split(",")[0]} expect to find what they need in seconds on their phone.",

  "solution": "[WEBSITE-SPECIFIC STRUCTURE - NO CONSULTING PHASES]
  
  **What We'll Build For You**
  
  A custom, mobile-responsive website designed to turn visitors into ${primaryActionText.includes("call") ? "callers" : primaryActionText.includes("reservation") ? "bookings" : "customers"}.
  
  **Your Website Pages:**
  
  1. **Homepage** - First impression with clear call-to-action: '${primaryActionText}'
  2. **About Page** - Your story, what makes you different, why customers choose you
  3. **${industry.includes("Restaurant") ? "Menu Page" : "Services Page"}** - ${industry.includes("Restaurant") ? "Easy-to-read menu with photos and prices" : "What you offer with clear descriptions"}
  4. **${industry.includes("Restaurant") ? "Location Page" : "Gallery/Portfolio"}** - ${industry.includes("Restaurant") ? "Google Maps, hours, parking info" : "Show off your best work"}
  5. **Contact Page** - Form, phone (click-to-call on mobile), address, hours
  
  **Key Features:**
  - Mobile-responsive (looks great on phones - where ${industryContext.customerLanguage.split(",")[0]} are searching)
  - Click-to-call button (one tap to reach you)
  - ${industry.includes("Restaurant") ? "Online reservation button" : "Contact form with instant email notification"}
  - Google Maps integration (easy directions)
  - Fast loading speed (slow sites lose customers)
  
  **How We'll Build It:**
  
  Week 1-2: Design & Content
  - We create the visual design (you approve before we build)
  - You provide content: ${industryContext.clientInputs}
  - 2 design concepts to choose from
  
  Week 3-4: Development
  - We build all pages
  - Mobile optimization
  - Feature integration (forms, maps, etc.)
  - You review and request changes
  
  Week 5: Launch
  - 2 rounds of revisions
  - Final testing on all devices
  - Go live
  - Handover: you'll know how to make basic updates",

  "deliverables": ${JSON.stringify(deliverables, null, 4)},

  "timeline": "**Project Timeline: ${timeline || "4-5 weeks"}**
  
  | Week | What Happens | What You Do | What You Get |
  |------|--------------|-------------|--------------|
  | 1 | Design concepts | Review & pick your favorite | 2 homepage mockups |
  | 2 | Content setup | Provide photos, menu, info | Content organized |
  | 3 | Build pages | Review progress | Working draft site |
  | 4 | Features & testing | Test on your phone | Near-final site |
  | 5 | Revisions & launch | Final approval | LIVE WEBSITE |
  
  **Total time needed from you:** ~3-4 hours across 5 weeks (quick reviews and feedback)",

  "investment": "**Investment: ${budget || "Based on scope"}**
  
  ${goalContext.roiFraming}
  
  **What's Included:**
  ${deliverables.map((d: string, i: number) => `${i + 1}. ${d}`).join("\n  ")}
  
  **Not Included (available as add-ons):**
  - Logo design
  - Professional photography
  - Ongoing monthly maintenance
  - Additional pages beyond scope
  
  **Payment:**
  - 50% deposit to start
  - 50% before launch
  
  **Guarantee:** If you're not happy with the design direction after the first round, we'll refund your deposit.",

  "why_us": "**Why Work With Us**
  
  1. **We specialize in ${industry}** - We've built websites for ${industryContext.similarClientType}s. We know what works.
  
  2. **We focus on results** - Our websites are built to get you more ${primaryActionText.includes("call") ? "phone calls" : primaryActionText.includes("reservation") ? "reservations" : "customers"}, not just look pretty.
  
  3. **No tech headaches** - We handle everything. You just approve designs and provide content.
  
  4. **You own everything** - The website, the content, the domain. It's yours.",

  "next_steps": [
    "Reply 'Let's do it' to confirm you want to move forward",
    "We send a simple 1-page agreement (no legal jargon)",
    "You send the 50% deposit",
    "We schedule a 30-min kickoff call",
    "Design concepts in your inbox within 5 business days"
  ]
}

**FINAL CHECK - ALL MUST BE TRUE:**
1. Zero consulting language (no "strategy", "optimization", "phase", "discovery")
2. Every section mentions specific website pages or features
3. Client can visualize exactly what they're getting
4. Outcomes are concrete (more calls, more reservations, more walk-ins)
5. Sounds like a web designer wrote it, not a management consultant`
}

function buildConsultingProposalPrompt(ctx: any): string {
  const {
    clientName,
    clientCompany,
    industry,
    businessGoal,
    problem,
    solution,
    budget,
    timeline,
    tone,
    additionalContext,
    industryContext,
    goalContext,
  } = ctx

  // Format specific deliverables for the prompt
  const deliverablesListForPrompt = industryContext.specificDeliverables
    .map((d: string, i: number) => `${i + 1}. ${d}`)
    .join("\n    ")

  // Format problem examples
  const problemExamplesForPrompt = industryContext.problemExamples.map((p: string) => `- "${p}"`).join("\n    ")

  const situationText = problem || `Likely experiencing: ${industryContext.problemExamples[0]}`

  return `You are writing a proposal that must feel like it was written BY someone who deeply understands ${industry}, FOR a specific ${industry} business owner.

**THE CUSTOMER PERSPECTIVE YOU MUST ADOPT:**
${industryContext.customerLanguage}

This is how THEIR customers think and behave. Your proposal must show you understand this reality.

**CRITICAL: LANGUAGE ENFORCEMENT**

BANNED (instant failure if used):
- "operational inefficiencies" / "streamline operations" / "optimize processes"
- "leverage" / "synergy" / "holistic" / "robust" / "seamless"  
- "cutting-edge" / "state-of-the-art" / "innovative solution"
- "data-driven insights" / "strategic approach" / "comprehensive"
- "We are excited" / "We look forward" / "We would be honored"
- "industry best practices" / "proven methodologies"

REQUIRED instead:
- Speak in terms of ${industry} customers (${industryContext.customerLanguage.split(",")[0]})
- Reference real problems: ${problemExamplesForPrompt}
- Use concrete specifics, not abstract benefits

**CLIENT BRIEF:**
- Business: ${clientCompany || clientName}
- Industry: ${industry}
- Their Goal: ${businessGoal}
- Their Situation: ${situationText}
- Their Budget: ${budget || "To be discussed based on scope"}
- Their Timeline: ${timeline || "Standard project timeline"}
- Tone: ${tone}
${additionalContext ? `- Additional Context: ${additionalContext}` : ""}

**GENERATE THIS EXACT JSON STRUCTURE:**

{
  "executive_summary": "[Write 4-5 SHORT sentences. MAX 80 words total.]
  
  START with their customer's perspective: 'When someone [how their customers behave - ${industryContext.customerLanguage.split(",")[0]}], your [business type] needs to [what needs to happen].'
  
  Then: What's at stake (${goalContext.costOfInaction}).
  Then: What we'll build (concrete output).
  End: The outcome they'll achieve.
  
  NO generic openings. NO 'we are pleased to present.' Just value.",

  "problem_statement": "[Write 3 SHORT paragraphs. Each paragraph MAX 3 sentences.]
  
  PARAGRAPH 1 - Their Reality:
  Describe their day-to-day: ${industryContext.problemExamples.slice(0, 2).join(". ")}. Paint a picture of what they're experiencing RIGHT NOW that frustrates them.
  
  PARAGRAPH 2 - What It's Costing Them:
  ${goalContext.costOfInaction}. Be specific: lost customers, wasted time, missed opportunities. Use their industry language.
  
  PARAGRAPH 3 - Why Quick Fixes Haven't Worked:
  Why DIY solutions, cheap alternatives, or ignoring the problem makes it worse. Show you understand their skepticism.",

  "solution": "[Use this EXACT structure with headers. Each phase should be 3-4 bullet points MAX.]
  
  **Phase 1: ${industryContext.phase1Name}** (${timeline ? "Week 1-2" : "First 2 weeks"})
  
  What we do:
  - [Specific action 1]
  - [Specific action 2]
  
  What you'll have: [Tangible output they can see/use]
  
  **Phase 2: ${industryContext.phase2Name}** (${timeline ? "Week 3-4" : "Week 3-4"})
  
  What we build:
  - [Specific deliverable 1]
  - [Specific deliverable 2]
  - [Specific deliverable 3]
  
  What you'll have: [Tangible output]
  
  **Phase 3: ${industryContext.phase3Name}** (${timeline ? "Week 5-6" : "Week 5-6"})
  
  What we deliver:
  - [Final deliverable]
  - [Training/handoff]
  
  What you'll have: [The complete ${industryContext.primaryDeliverable} ready to use]",

  "deliverables": [
    ${industryContext.specificDeliverables.map((d: string) => `"${d}"`).join(",\n    ")}
  ],

  "timeline": "**Project Timeline: ${timeline || "6 weeks"}**

  | Phase | What Happens | Your Time Needed | You'll Have |
  |------|--------------|------------------|-------------|
  | Week 1-2 | ${industryContext.phase1Name} | 2-3 meetings (1hr each) | Strategy document |
  | Week 3-4 | ${industryContext.phase2Name} | Review sessions | Draft ${industryContext.primaryDeliverable} |
  | Week 5-6 | ${industryContext.phase3Name} | Final approval | Live ${industryContext.primaryDeliverable} |

  **What we need from you:** ${industryContext.clientInputs}",

  "investment": "**Investment: ${budget || "[Discuss based on scope]"}**

  ${goalContext.roiFraming}

  **What's Included:**
  ${deliverablesListForPrompt}
  
  **Bonus:** ${industryContext.bonusInclusion}

  **Payment:** 50% to start, 50% on completion.",

  "why_us": "**Why We're Right for This**

  1. **We Know ${industry}:** We've helped ${industryContext.similarClientType} businesses [achieve specific result]. We understand ${industryContext.commonChallenge}.

  2. **We Focus on Outcomes:** Our goal isn't just to deliver a ${industryContext.primaryDeliverable}—it's to help you ${businessGoal.toLowerCase()}.

  3. **${goalContext.differentiator}:** [Specific reason why our approach fits their situation]",

  "next_steps": [
    "Reply to this proposal to confirm you'd like to move forward",
    "We'll send a simple contract within 24 hours",
    "Kickoff call scheduled within 48 hours of signing",
    "First deliverable in your hands by [DATE based on ${timeline || "2 weeks"}]"
  ]
}

**FINAL QUALITY CHECK (all must be true):**
1. Zero banned phrases used
2. Every section uses industry-specific language
3. Deliverables are concrete and tangible
4. Client can visualize exactly what they're getting
5. Outcomes are specific and measurable`
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

function getIndustryContext(industry: string): {
  expertType: string
  expertise: string
  painPointLabel: string
  commonChallenge: string
  phase1Name: string
  phase2Name: string
  phase3Name: string
  commonTools: string
  deliverableExample1: string
  primaryDeliverable: string
  clientInputs: string
  bonusInclusion: string
  similarClientType: string
  customerLanguage: string // NEW: How end customers talk about this business
  specificDeliverables: string[] // NEW: Concrete deliverables list
  problemExamples: string[] // NEW: Real problems customers mention
} {
  const contexts: Record<string, any> = {
    "SaaS / Software": {
      expertType: "SaaS growth consultant",
      expertise:
        "You've helped 50+ SaaS companies improve activation rates, reduce churn, and scale MRR. You understand product-led growth, user onboarding, and the metrics that matter: CAC, LTV, MRR, churn rate.",
      painPointLabel: "Growth Challenge",
      commonChallenge: "the pressure to grow MRR while keeping CAC manageable",
      phase1Name: "Audit & Strategy",
      phase2Name: "Implementation",
      phase3Name: "Optimization & Handoff",
      commonTools: "Mixpanel/Amplitude for analytics, Intercom/Customer.io for engagement, Stripe for billing",
      deliverableExample1: "user onboarding flow with 5 triggered emails",
      primaryDeliverable: "growth system",
      clientInputs: "access to analytics, user interviews (we'll facilitate), product roadmap",
      bonusInclusion: "30-day post-launch optimization support",
      similarClientType: "B2B SaaS in the $10-50K MRR range",
      customerLanguage:
        "Users searching for solutions to specific workflow problems, comparing features, reading reviews on G2/Capterra, signing up for free trials",
      specificDeliverables: [
        "Custom onboarding flow with 5 automated email sequences",
        "In-app tooltips and guided product tour",
        "Activation milestone tracking dashboard",
        "Churn prediction alert system",
        "Customer health score implementation",
        "30-day post-launch optimization support",
      ],
      problemExamples: [
        "Users sign up but never complete setup",
        "Trial-to-paid conversion is below 5%",
        "Churn spikes after the first 90 days",
        "Support tickets from confused new users",
      ],
    },
    "E-commerce / Retail": {
      expertType: "e-commerce conversion specialist",
      expertise:
        "You've optimized 100+ online stores, improving conversion rates by an average of 35%. You understand the full funnel: traffic acquisition, product page optimization, cart abandonment, and post-purchase retention.",
      painPointLabel: "Sales Challenge",
      commonChallenge: "converting browsers into buyers while maintaining healthy margins",
      phase1Name: "Store Audit",
      phase2Name: "Conversion Optimization",
      phase3Name: "Launch & Scale",
      commonTools: "Shopify/WooCommerce, Klaviyo for email, Google Analytics 4, Hotjar for heatmaps",
      deliverableExample1: "optimized product page template with A/B test plan",
      primaryDeliverable: "conversion system",
      clientInputs: "store access, top 10 products data, customer feedback/reviews",
      bonusInclusion: "Email automation setup (abandoned cart + post-purchase)",
      similarClientType: "DTC brand doing $50K-500K/month",
      customerLanguage:
        "Shoppers browsing on phones during lunch, comparing prices, reading reviews, abandoning carts when shipping is unclear, coming back from email reminders",
      specificDeliverables: [
        "Optimized product page template (mobile-first design)",
        "Abandoned cart email sequence (3 emails)",
        "Post-purchase follow-up automation",
        "Product recommendation engine setup",
        "Checkout flow optimization",
        "A/B testing framework for ongoing improvements",
      ],
      problemExamples: [
        "Cart abandonment rate over 70%",
        "Visitors browse but don't buy",
        "Mobile conversion is half of desktop",
        "No repeat purchases from past customers",
      ],
    },
    "Restaurant / Hospitality": {
      expertType: "restaurant digital presence specialist",
      expertise:
        "You've helped 75+ restaurants get found online, fill more seats, and turn first-time diners into regulars. You understand what drives a hungry customer: appetizing photos, easy-to-read menus, quick reservation options, and showing up when they search 'restaurants near me'.",
      painPointLabel: "Visibility Challenge",
      commonChallenge:
        "getting found by hungry customers searching on their phones and turning website visitors into actual diners",
      phase1Name: "Discovery & Menu Analysis",
      phase2Name: "Website & Local SEO",
      phase3Name: "Launch & Diner Conversion Setup",
      commonTools: "Google Business Profile, OpenTable/Resy integration, mobile-responsive design, local SEO",
      deliverableExample1: "mobile-optimized website with online menu and reservation button",
      primaryDeliverable: "restaurant website",
      clientInputs:
        "menu (PDF or text), food photos (or we'll guide a photo shoot), hours, location, reservation system preference",
      bonusInclusion: "Google Business Profile optimization to improve local search ranking",
      similarClientType: "independent restaurant or small chain",
      customerLanguage:
        "Hungry people searching 'best Italian near me' on their phones, checking your menu before deciding where to eat tonight, looking for parking info, wanting to make a reservation without calling",
      specificDeliverables: [
        "5-page mobile-responsive website (Home, Menu, About, Location, Contact)",
        "Photo-rich menu page with categories and prices",
        "Click-to-call button and reservation integration",
        "Google Maps embed with directions",
        "Google Business Profile setup/optimization",
        "Basic SEO for 'restaurant + your neighborhood' searches",
      ],
      problemExamples: [
        "People can't find your menu online",
        "Your website looks broken on phones",
        "You don't show up when people search 'restaurants near me'",
        "Customers call just to ask basic questions (hours, address, menu)",
      ],
    },
    "Healthcare / Medical": {
      expertType: "healthcare digital presence specialist",
      expertise:
        "You've helped 40+ medical practices attract new patients while maintaining HIPAA compliance. You understand how patients search: they Google symptoms, look for doctors accepting their insurance, read reviews, and want to book online.",
      painPointLabel: "Patient Acquisition Challenge",
      commonChallenge: "being found by patients searching for care and building trust before they ever walk in",
      phase1Name: "Practice Audit & Compliance Review",
      phase2Name: "Website & Patient Portal Build",
      phase3Name: "Launch & Reputation Setup",
      commonTools: "HIPAA-compliant hosting, Healthgrades integration, Zocdoc, patient review management",
      deliverableExample1: "HIPAA-compliant website with online appointment requests",
      primaryDeliverable: "practice website",
      clientInputs: "services offered, insurance accepted, provider bios, compliance requirements",
      bonusInclusion: "HIPAA compliance documentation for all digital assets",
      similarClientType: "private practice or small clinic",
      customerLanguage:
        "Patients Googling their symptoms, searching 'dentist accepting Aetna near me', reading doctor reviews, wanting to book online without phone tag, checking if you're legit before making an appointment",
      specificDeliverables: [
        "HIPAA-compliant responsive website",
        "Online appointment request form",
        "Provider profile pages with credentials",
        "Services and conditions treated pages",
        "Insurance and payment information page",
        "Patient review display integration",
      ],
      problemExamples: [
        "New patients say they couldn't find your website",
        "Phone is your only booking option (and it goes to voicemail)",
        "You're not showing up in 'doctor near me' searches",
        "Website looks outdated, hurting trust",
      ],
    },
    "Finance / Fintech": {
      expertType: "fintech growth consultant",
      expertise:
        "You've helped 30+ financial services companies build trust online and convert skeptical visitors into clients. You understand the compliance requirements, the importance of trust signals, and how people research financial decisions.",
      painPointLabel: "Trust & Growth Challenge",
      commonChallenge:
        "building credibility online and converting visitors who are naturally skeptical about financial services",
      phase1Name: "Trust Audit & Compliance Review",
      phase2Name: "Credibility System Build",
      phase3Name: "Launch & Lead Capture Setup",
      commonTools: "Compliance-ready forms, secure document sharing, CRM integration, trust badge implementation",
      deliverableExample1: "compliance-ready lead capture system with secure document upload",
      primaryDeliverable: "client acquisition system",
      clientInputs: "compliance requirements, service offerings, credentials to highlight",
      bonusInclusion: "Lead nurture email sequence (compliance-approved)",
      similarClientType: "independent financial advisor or small fintech startup",
      customerLanguage:
        "People comparing advisors, checking credentials, reading reviews, wanting to see who they're trusting with their money, asking 'is this legit?'",
      specificDeliverables: [
        "Trust-focused website with compliance badges",
        "Secure contact and inquiry forms",
        "Advisor/team credential showcase pages",
        "Service explanation pages (clear, jargon-free)",
        "Client testimonial/case study section",
        "Lead capture with CRM integration",
      ],
      problemExamples: [
        "Website doesn't convey credibility",
        "No easy way for prospects to reach out securely",
        "Competitors look more established online",
        "Leads go cold because follow-up is manual",
      ],
    },
    "Agency / Creative": {
      expertType: "creative agency positioning consultant",
      expertise:
        "You've helped 60+ agencies differentiate themselves in crowded markets. You understand that agencies sell trust and taste—your website IS your portfolio, and it needs to immediately signal 'we're the right fit'.",
      painPointLabel: "Positioning Challenge",
      commonChallenge: "standing out in a sea of agencies and attracting clients who value quality over lowest price",
      phase1Name: "Portfolio & Positioning Audit",
      phase2Name: "Website & Case Study Build",
      phase3Name: "Launch & Lead Generation Setup",
      commonTools: "Portfolio platforms, case study templates, lead qualification forms, project showcases",
      deliverableExample1: "portfolio website with 5 detailed case studies",
      primaryDeliverable: "agency website",
      clientInputs: "best project examples, client testimonials, team bios, ideal client profile",
      bonusInclusion: "Lead qualification form to filter tire-kickers",
      similarClientType: "boutique agency or creative studio",
      customerLanguage:
        "Marketing managers searching for agencies, looking at portfolios, checking if you've done work in their industry, wanting to see process not just pretty pictures",
      specificDeliverables: [
        "Portfolio website with filterable project gallery",
        "5 detailed case studies with results",
        "Team/about page showcasing expertise",
        "Services page with clear offerings",
        "Lead qualification contact form",
        "Testimonial/client logo showcase",
      ],
      problemExamples: [
        "Website doesn't reflect the quality of your work",
        "Attracting price-shoppers instead of quality-seekers",
        "No clear differentiation from competitors",
        "Case studies don't tell a compelling story",
      ],
    },
    "Education / EdTech": {
      expertType: "education marketing specialist",
      expertise:
        "You've helped 35+ educational institutions and EdTech companies attract students and build enrollment. You understand the decision journey: research, comparison, trust-building, and the emotions involved in education purchases.",
      painPointLabel: "Enrollment Challenge",
      commonChallenge:
        "standing out to students (or parents) researching options and converting interest into enrollment",
      phase1Name: "Student Journey Mapping",
      phase2Name: "Enrollment System Build",
      phase3Name: "Launch & Nurture Setup",
      commonTools: "Student CRM, enrollment forms, virtual tour platforms, email nurture sequences",
      deliverableExample1: "enrollment landing page with inquiry capture",
      primaryDeliverable: "enrollment system",
      clientInputs: "program details, student success stories, differentiators, enrollment process",
      bonusInclusion: "Inquiry nurture email sequence",
      similarClientType: "private school, training program, or EdTech startup",
      customerLanguage:
        "Students/parents Googling programs, comparing options, reading reviews, wanting to see outcomes and success stories, nervous about making the right choice",
      specificDeliverables: [
        "Program landing pages optimized for enrollment",
        "Student inquiry and application forms",
        "Success stories/alumni showcase",
        "Program comparison tools",
        "Virtual tour or video integration",
        "Inquiry follow-up automation",
      ],
      problemExamples: [
        "Website doesn't convert visitors to inquiries",
        "Hard for students to understand program differences",
        "No showcase of student outcomes",
        "Losing students to competitors with better websites",
      ],
    },
    "Real Estate": {
      expertType: "real estate digital marketing specialist",
      expertise:
        "You've helped 50+ agents and brokerages generate leads and build their personal brand online. You understand that real estate is a trust business—clients choose agents, not companies—and your online presence needs to reflect your expertise.",
      painPointLabel: "Lead Generation Challenge",
      commonChallenge: "generating quality leads and building a personal brand that attracts ideal clients",
      phase1Name: "Brand & Market Analysis",
      phase2Name: "Website & Lead System Build",
      phase3Name: "Launch & Nurture Setup",
      commonTools: "IDX integration, CRM, lead capture forms, property showcase tools",
      deliverableExample1: "personal brand website with IDX property search",
      primaryDeliverable: "agent website",
      clientInputs: "headshots, testimonials, recent transactions, target neighborhoods",
      bonusInclusion: "Lead nurture email sequence for new inquiries",
      similarClientType: "individual agent or small team",
      customerLanguage:
        "Home buyers/sellers Googling agents, checking reviews, wanting to see local expertise, looking for someone who knows their neighborhood",
      specificDeliverables: [
        "Personal brand website with property search (IDX)",
        "Neighborhood/market expertise pages",
        "Recent sales and testimonial showcase",
        "Home valuation lead capture tool",
        "Contact form with CRM integration",
        "New listing announcement system",
      ],
      problemExamples: [
        "Leads go to Zillow instead of you",
        "No way to capture seller leads",
        "Website doesn't showcase your local expertise",
        "No follow-up system for inquiries",
      ],
    },
    "Consulting / Professional Services": {
      expertType: "professional services positioning consultant",
      expertise:
        "You've helped 80+ consultants and professional service firms attract better clients through clear positioning and trust-building content. You understand that clients are buying expertise and outcomes, not hours.",
      painPointLabel: "Client Acquisition Challenge",
      commonChallenge: "attracting ideal clients who value expertise over price and building credibility online",
      phase1Name: "Positioning & Value Audit",
      phase2Name: "Authority System Build",
      phase3Name: "Launch & Lead Generation Setup",
      commonTools: "Lead capture, content showcases, booking calendars, testimonial systems",
      deliverableExample1: "authority website with clear value proposition and booking system",
      primaryDeliverable: "authority website",
      clientInputs: "ideal client profile, case studies, thought leadership content, credentials",
      bonusInclusion: "LinkedIn profile optimization",
      similarClientType: "independent consultant or boutique firm",
      customerLanguage:
        "Executives researching consultants, checking credentials, looking for proof of results, wanting to see if you understand their industry challenges",
      specificDeliverables: [
        "Authority website with clear positioning",
        "Service offering pages with outcomes focus",
        "Case study/results showcase",
        "Thought leadership content hub",
        "Discovery call booking integration",
        "Lead qualification form",
      ],
      problemExamples: [
        "Website doesn't convey your expertise",
        "Attracting price-sensitive clients",
        "No clear differentiation from competitors",
        "Thought leadership isn't visible or organized",
      ],
    },
    "Non-profit / NGO": {
      expertType: "nonprofit digital strategist",
      expertise:
        "You've helped 40+ nonprofits increase donations and volunteer engagement through compelling storytelling and clear calls to action. You understand that donors give to impact, not overhead.",
      painPointLabel: "Engagement Challenge",
      commonChallenge: "turning website visitors into donors and volunteers by telling a compelling impact story",
      phase1Name: "Impact Story Development",
      phase2Name: "Website & Donation System Build",
      phase3Name: "Launch & Campaign Setup",
      commonTools:
        "Donation platforms (Stripe, PayPal), storytelling frameworks, volunteer management, email campaigns",
      deliverableExample1: "donation-optimized website with impact storytelling",
      primaryDeliverable: "nonprofit website",
      clientInputs: "impact stories, photos, donation tiers, volunteer opportunities",
      bonusInclusion: "Year-end giving campaign template",
      similarClientType: "local nonprofit or growing charity",
      customerLanguage:
        "Potential donors researching causes, wanting to see where their money goes, looking for transparency, deciding between multiple organizations to support",
      specificDeliverables: [
        "Impact-focused website with clear mission",
        "Donation page with suggested amounts and impact levels",
        "Impact stories and beneficiary showcases",
        "Volunteer signup and engagement system",
        "Donor thank-you automation",
        "Annual report/transparency page",
      ],
      problemExamples: [
        "Website doesn't convey impact clearly",
        "Donation process is complicated",
        "No compelling stories to share",
        "Losing donors to organizations with better websites",
      ],
    },
    "Manufacturing / Industrial": {
      expertType: "industrial marketing specialist",
      expertise:
        "You've helped 30+ manufacturers and industrial companies attract quality leads through clear capability showcasing. You understand the B2B buying process: long cycles, multiple stakeholders, and the need for technical credibility.",
      painPointLabel: "Visibility Challenge",
      commonChallenge: "being found by procurement managers and engineers who are researching suppliers",
      phase1Name: "Capability Audit",
      phase2Name: "Website & Lead System Build",
      phase3Name: "Launch & Sales Integration",
      commonTools: "RFQ forms, capability showcases, case studies, technical document libraries",
      deliverableExample1: "capability-focused website with RFQ system",
      primaryDeliverable: "company website",
      clientInputs: "capabilities list, certifications, case studies, technical specs",
      bonusInclusion: "Sales team integration training",
      similarClientType: "mid-size manufacturer or industrial service provider",
      customerLanguage:
        "Procurement managers researching suppliers, engineers checking capabilities, operations managers looking for reliability proof, multiple stakeholders comparing options",
      specificDeliverables: [
        "Capability-focused website with clear offerings",
        "RFQ/inquiry submission system",
        "Certification and quality showcase",
        "Case study/project portfolio",
        "Technical resource library",
        "Sales team lead notification system",
      ],
      problemExamples: [
        "Website doesn't reflect your capabilities",
        "No easy way for prospects to request quotes",
        "Certifications and credentials aren't visible",
        "Losing RFQs to competitors with better web presence",
      ],
    },
  }

  // Find matching context or return default
  for (const [key, value] of Object.entries(contexts)) {
    const keyLower = key.toLowerCase()
    const industryLower = industry.toLowerCase()

    // Try exact match first
    if (keyLower === industryLower) {
      return value
    }

    // Try partial match on first word
    const keyFirstWord = keyLower.split(" ")[0]
    if (industryLower.includes(keyFirstWord) || keyFirstWord.includes(industryLower.split(" ")[0])) {
      return value
    }

    // Try matching key aliases
    const keyAliases = keyLower.split(" / ")
    for (const alias of keyAliases) {
      if (industryLower.includes(alias.trim()) || alias.trim().includes(industryLower)) {
        return value
      }
    }
  }

  const defaultContext = {
    expertType: "business consultant",
    expertise:
      "You've helped 100+ businesses improve their online presence and attract more customers. You understand the fundamentals that drive business success across sectors.",
    painPointLabel: "Business Challenge",
    commonChallenge: "being found by potential customers and converting website visitors into actual business",
    phase1Name: "Discovery & Analysis",
    phase2Name: "Strategy & Implementation",
    phase3Name: "Launch & Optimization",
    commonTools: "industry-appropriate tools and platforms",
    deliverableExample1: "customized solution with clear outcomes",
    primaryDeliverable: "solution",
    clientInputs: "business data, team access, feedback on drafts",
    bonusInclusion: "30-day post-project support",
    similarClientType: "business in a similar growth stage",
    customerLanguage:
      "Potential customers searching online, comparing options, looking for credibility signals, wanting to contact you easily",
    specificDeliverables: [
      "Custom solution tailored to your needs",
      "Implementation documentation",
      "Training session for your team",
      "30-day post-launch support",
    ],
    problemExamples: [
      "Current solution isn't meeting your needs",
      "Missing opportunities due to gaps",
      "Competitors are ahead in this area",
    ],
  }

  return defaultContext
}

function getGoalContext(goal: string): {
  framingInstructions: string
  opportunityExample: string
  costOfInaction: string
  roiFraming: string
  differentiator: string
} {
  const contexts: Record<string, any> = {
    "Increase Revenue": {
      framingInstructions:
        "Frame everything in terms of revenue impact. Use specific dollar amounts and percentages. Show how each deliverable connects to more sales or higher transaction values.",
      opportunityExample: "Based on your current traffic, a 15% conversion improvement = $X additional revenue monthly",
      costOfInaction: "Every month without optimization is $X left on the table",
      roiFraming: "If this engagement increases your revenue by just 10%, you'll recoup this investment in 6-8 weeks.",
      differentiator: "Revenue Focus",
    },
    "Reduce Costs": {
      framingInstructions:
        "Frame everything in terms of cost savings and efficiency gains. Quantify time saved in hours and dollars. Show the compounding effect of operational improvements.",
      opportunityExample: "Automating this process saves 15 hours/week = $X/month in labor costs",
      costOfInaction: "You're currently spending $X/month on inefficiencies that could be eliminated",
      roiFraming: "The time savings alone will pay for this engagement within 2-3 months.",
      differentiator: "Efficiency Focus",
    },
    "Save Time": {
      framingInstructions:
        "Frame everything in terms of time reclaimed. Convert hours to dollars. Emphasize what they could do with recovered time (strategic work, growth initiatives, work-life balance).",
      opportunityExample: "This automation frees up 10+ hours weekly for strategic work",
      costOfInaction: "You're losing 40+ hours monthly to tasks that could be automated",
      roiFraming: "At your effective hourly rate, the time savings make this a 3X return.",
      differentiator: "Time Optimization",
    },
    "Acquire Customers": {
      framingInstructions:
        "Frame everything in terms of lead generation and customer acquisition cost. Show the funnel math: traffic → leads → customers. Emphasize sustainable acquisition channels.",
      opportunityExample: "This system can generate 50+ qualified leads monthly at $X per lead",
      costOfInaction: "Your competitors are capturing market share while you're invisible",
      roiFraming: "If each new customer is worth $X lifetime value, you need just 3-5 new customers to ROI.",
      differentiator: "Acquisition Expertise",
    },
    "Retain Customers": {
      framingInstructions:
        "Frame everything in terms of customer lifetime value and churn reduction. Show the math: 5% churn reduction = X% profit increase. Emphasize the cost of replacement vs. retention.",
      opportunityExample: "Reducing churn by 10% could add $X to your annual revenue",
      costOfInaction: "Every churned customer costs 5-7X more to replace than to retain",
      roiFraming: "Retaining just 5-10 additional customers/month covers this entire investment.",
      differentiator: "Retention Systems",
    },
  }

  // Default context
  const defaultContext = {
    framingInstructions:
      "Frame everything in terms of measurable business outcomes. Use specific numbers wherever possible. Connect each deliverable to tangible results.",
    opportunityExample: "This engagement positions you to achieve measurable growth within 90 days",
    costOfInaction: "Delaying this initiative costs you significant opportunity every month",
    roiFraming: "The value delivered will exceed this investment within the first 3-4 months.",
    differentiator: "Results Focus",
  }

  // Find matching context or return default
  for (const [key, value] of Object.entries(contexts)) {
    if (goal.toLowerCase().includes(key.toLowerCase().split(" ")[0])) {
      return value
    }
  }

  return defaultContext
}
