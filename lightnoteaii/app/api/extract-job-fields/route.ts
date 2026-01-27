import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

// API key rotation
const API_KEYS = [
  process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_2,
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_3,
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_4,
  process.env.GOOGLE_GENERATIVE_AI_API_KEY_5,
].filter(Boolean) as string[]

let currentKeyIndex = 0

function getNextApiKey(): string {
  const key = API_KEYS[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length
  return key
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription } = await req.json()

    if (!jobDescription || jobDescription.length < 50) {
      return NextResponse.json({ error: "Job description must be at least 50 characters" }, { status: 400 })
    }

    const apiKey = getNextApiKey()
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

    const prompt = `Analyze the following job posting or project description and extract relevant information for creating a business proposal.

Job Description:
"""
${jobDescription}
"""

Extract the following fields and respond ONLY with valid JSON (no markdown, no code blocks):
{
  "proposalType": "The type of proposal (e.g., 'Software Development Proposal', 'Consulting Proposal', 'Service Proposal', 'Freelance Proposal', 'Marketing Proposal')",
  "clientCompany": "The company or client name if mentioned",
  "clientIndustry": "The industry of the client if identifiable",
  "problem": "The main problem, need, or project requirement described",
  "solution": "A brief suggested solution approach based on the requirements",
  "budget": "Any budget mentioned or a reasonable estimate based on scope",
  "timeline": "Any timeline mentioned or a reasonable estimate",
  "tone": "Recommended tone for the proposal (Professional, Friendly, Formal, Casual, Persuasive)",
  "confidence": {
    "proposalType": 0.0-1.0,
    "clientCompany": 0.0-1.0,
    "problem": 0.0-1.0,
    "budget": 0.0-1.0,
    "timeline": 0.0-1.0
  }
}

Rules:
- Set confidence scores based on how explicitly the information was stated (1.0 = explicitly stated, 0.5 = inferred, 0.2 = guessed)
- If a field is not mentioned, provide a reasonable default or leave empty
- Keep the problem description concise but comprehensive
- The solution should be a brief 1-2 sentence approach`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse JSON from response
    let extractedData
    try {
      // Remove any markdown code blocks if present
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim()
      extractedData = JSON.parse(cleanJson)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      // Return a fallback structure
      extractedData = {
        proposalType: "Service Proposal",
        clientCompany: "",
        problem: jobDescription.slice(0, 300),
        confidence: {
          proposalType: 0.5,
          clientCompany: 0.2,
          problem: 0.6,
          budget: 0.2,
          timeline: 0.2,
        },
      }
    }

    return NextResponse.json(extractedData)
  } catch (error) {
    console.error("[v0] Extract fields error:", error)
    return NextResponse.json({ error: "Failed to extract fields from job description" }, { status: 500 })
  }
}
