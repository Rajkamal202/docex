import { GoogleGenAI } from "@google/genai"

const getApiKeys = () =>
  [
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    process.env.GOOGLE_GENERATIVE_AI_API_KEY_2 || "",
    process.env.GOOGLE_GENERATIVE_AI_API_KEY_3 || "",
    process.env.GOOGLE_GENERATIVE_AI_API_KEY_4 || "",
    process.env.GOOGLE_GENERATIVE_AI_API_KEY_5 || "",
  ].filter(Boolean)

const MODEL_NAME = "gemini-3-flash-preview"

let currentKeyIndex = 0
const exhaustedKeys: Map<number, number> = new Map()

function getGenAI(): GoogleGenAI | null {
  const API_KEYS = getApiKeys()
  if (API_KEYS.length === 0) {
    return null
  }
  return new GoogleGenAI({ apiKey: API_KEYS[currentKeyIndex] })
}

function requireGenAI(): GoogleGenAI {
  const genAI = getGenAI()
  if (!genAI) {
    throw new Error(
      "No Gemini API keys configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
    )
  }
  return genAI
}

function findAvailableKey(): number | null {
  const API_KEYS = getApiKeys()
  const now = Date.now()

  // Check if any exhausted keys have recovered (after 60 seconds cooldown)
  for (const [keyIndex, exhaustedTime] of exhaustedKeys.entries()) {
    if (now - exhaustedTime > 60000) {
      exhaustedKeys.delete(keyIndex)
    }
  }

  // Find first non-exhausted key
  for (let i = 0; i < API_KEYS.length; i++) {
    if (!exhaustedKeys.has(i)) {
      return i
    }
  }

  return null
}

function switchToNextKey(): boolean {
  const API_KEYS = getApiKeys()
  // Mark current key as exhausted
  exhaustedKeys.set(currentKeyIndex, Date.now())

  const availableKey = findAvailableKey()
  if (availableKey !== null) {
    currentKeyIndex = availableKey
    console.log(`[Gemini] Switched to API key ${currentKeyIndex + 1} of ${API_KEYS.length}`)
    return true
  }
  return false
}

function resetKeyIndex() {
  currentKeyIndex = 0
  // Don't clear exhaustedKeys - they need time to recover
}

export class QuotaExceededError extends Error {
  retryAfter: number
  isDailyLimit: boolean
  constructor(message: string, retryAfter: number, isDailyLimit = false) {
    super(message)
    this.name = "QuotaExceededError"
    this.retryAfter = retryAfter
    this.isDailyLimit = isDailyLimit
  }
}

function isDailyLimitError(errorMessage: string): boolean {
  return errorMessage.includes("PerDayPerProject") || errorMessage.includes("limit: 0")
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function generateWithRetry(
  prompt: string,
  options: {
    maxRetries?: number
    jsonMode?: boolean
  } = {},
): Promise<string> {
  const API_KEYS = getApiKeys()
  const { maxRetries = 3, jsonMode = true } = options

  if (API_KEYS.length === 0) {
    throw new Error(
      "No Gemini API keys configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
    )
  }

  let lastError: Error | null = null
  let lastRetryDelay = 60000

  const availableKey = findAvailableKey()
  if (availableKey !== null) {
    currentKeyIndex = availableKey
  } else {
    // All keys exhausted - throw immediately with helpful message
    throw new QuotaExceededError(
      "All API keys have reached their daily limit. Please try again later or upgrade to a paid Google AI plan.",
      3600000, // 1 hour
      true,
    )
  }

  for (let attempt = 0; attempt < maxRetries * Math.max(API_KEYS.length, 1); attempt++) {
    try {
      const genAI = requireGenAI()
      const response = await genAI.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: jsonMode
          ? {
              responseMimeType: "application/json",
            }
          : undefined,
      })
      const text = typeof response.text === "function" ? response.text() : response.text
      return text || ""
    } catch (error: unknown) {
      lastError = error as Error
      const errorMessage = (error as Error).message || ""

      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota")
      ) {
        console.log(`[Gemini] Rate limited on key ${currentKeyIndex + 1} of ${API_KEYS.length}`)

        const isDaily = isDailyLimitError(errorMessage)

        // Extract retry delay from error or use defaults
        const retryMatch = errorMessage.match(/retryDelay.*?(\d+)/i)
        lastRetryDelay = retryMatch ? Math.ceil(Number.parseInt(retryMatch[1]) * 1000) : isDaily ? 3600000 : 60000

        // Try switching to next key
        if (switchToNextKey()) {
          console.log(`[Gemini] Retrying with key ${currentKeyIndex + 1}...`)
          await delay(1000)
          continue
        }

        const message = isDaily
          ? "All API keys have reached their daily quota limit. The free tier allows limited requests per day. Please try again tomorrow or upgrade to a paid Google AI plan for higher limits."
          : `All ${API_KEYS.length} API keys are temporarily rate limited. Please try again in ${Math.ceil(lastRetryDelay / 1000)} seconds.`

        throw new QuotaExceededError(message, lastRetryDelay, isDaily)
      }

      throw error
    }
  }

  throw lastError || new Error("Failed to generate content after retries")
}

export async function generateWithSchema<T>(
  prompt: string,
  parseResponse: (text: string) => T,
  options: { maxRetries?: number } = {},
): Promise<T> {
  const API_KEYS = getApiKeys()
  const { maxRetries = 3 } = options

  if (API_KEYS.length === 0) {
    throw new Error(
      "No Gemini API keys configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
    )
  }

  let lastError: Error | null = null
  let lastRetryDelay = 60000
  resetKeyIndex()

  for (let attempt = 0; attempt < maxRetries * Math.max(API_KEYS.length, 1); attempt++) {
    try {
      const genAI = requireGenAI()
      const response = await genAI.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      })
      const text = typeof response.text === "function" ? response.text() : response.text
      return parseResponse(text)
    } catch (error: unknown) {
      lastError = error as Error
      const errorMessage = (error as Error).message || ""

      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota")
      ) {
        console.log(`[Gemini] Rate limited on key ${currentKeyIndex + 1} of ${API_KEYS.length}`)

        const retryMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)/i)
        lastRetryDelay = retryMatch ? Math.ceil(Number.parseFloat(retryMatch[1]) * 1000) : 60000

        if (switchToNextKey()) {
          console.log(`[Gemini] Retrying with key ${currentKeyIndex + 1}...`)
          await delay(1000)
          continue
        }
        throw new QuotaExceededError(
          `All ${API_KEYS.length} API keys have exceeded quota. Please try again in ${Math.ceil(lastRetryDelay / 1000)} seconds.`,
          lastRetryDelay,
        )
      }
      throw error
    }
  }

  throw lastError || new Error("Failed to generate content")
}

export async function generateTextContent(
  prompt: string,
  options: { maxRetries?: number; maxTokens?: number } = {},
): Promise<string> {
  const API_KEYS = getApiKeys()
  const { maxRetries = 3, maxTokens = 4000 } = options

  if (API_KEYS.length === 0) {
    throw new Error(
      "No Gemini API keys configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
    )
  }

  let lastError: Error | null = null
  let lastRetryDelay = 60000
  resetKeyIndex()

  for (let attempt = 0; attempt < maxRetries * Math.max(API_KEYS.length, 1); attempt++) {
    try {
      const genAI = requireGenAI()
      const response = await genAI.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          maxOutputTokens: maxTokens,
        },
      })
      const text = typeof response.text === "function" ? response.text() : response.text
      return text || ""
    } catch (error: unknown) {
      lastError = error as Error
      const errorMessage = (error as Error).message || ""

      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED") ||
        errorMessage.includes("quota")
      ) {
        console.log(`[Gemini] Rate limited on key ${currentKeyIndex + 1} of ${API_KEYS.length}`)

        const retryMatch = errorMessage.match(/retry in (\d+(?:\.\d+)?)/i)
        lastRetryDelay = retryMatch ? Math.ceil(Number.parseFloat(retryMatch[1]) * 1000) : 60000

        if (switchToNextKey()) {
          console.log(`[Gemini] Retrying with key ${currentKeyIndex + 1}...`)
          await delay(1000)
          continue
        }
        throw new QuotaExceededError(
          `All ${API_KEYS.length} API keys have exceeded quota. Please try again in ${Math.ceil(lastRetryDelay / 1000)} seconds.`,
          lastRetryDelay,
        )
      }
      throw error
    }
  }

  throw lastError || new Error("Failed to generate text")
}

export async function analyzeProposal(content: string, tone = "formal") {
  const prompt = `You are an expert proposal auditor. Analyze this proposal comprehensively and identify all issues.

Proposal content:
${content}

Analyze for:
1. Structure & Flow - Is there a clear executive summary, logical flow, proper sections?
2. Credibility Signals - Are there quantified claims, specific metrics, social proof?
3. Persuasion Strength - Is it outcome-focused, client-centric, compelling?
4. Clarity & Readability - Is the language clear, professional, easy to scan?
5. Call to Action - Is the closing confident and action-oriented?

Identify 4-8 specific issues with severity levels (critical, major, minor).
Score each category from 0-100.
Provide an overall score weighted by importance.

Return a JSON object with this exact structure:
{
  "issues": [
    {
      "id": "unique-id",
      "category": "Structure" | "Credibility" | "Value Proposition" | "Call to Action" | "Personalization" | "Methodology" | "Clarity" | "Tone",
      "severity": "critical" | "major" | "minor",
      "title": "Issue title",
      "description": "Detailed description",
      "location": "Where in the proposal",
      "suggestion": "How to fix it"
    }
  ],
  "scores": {
    "structure": 0-100,
    "credibility": 0-100,
    "persuasion": 0-100,
    "clarity": 0-100,
    "cta": 0-100
  },
  "overallScore": 0-100,
  "summary": "Brief summary of the analysis"
}`

  return generateWithSchema(prompt, (text) => {
    const parsed = JSON.parse(text)
    return {
      issues: parsed.issues || [],
      scores: parsed.scores || { structure: 50, credibility: 50, persuasion: 50, clarity: 50, cta: 50 },
      overallScore: parsed.overallScore || 50,
      summary: parsed.summary || "Analysis complete",
    }
  })
}

export async function rewriteProposal(content: string, tone = "formal", issues: unknown[] = []) {
  const prompt = `You are an elite proposal writer who has won thousands of contracts. Rewrite this proposal to be significantly more effective.

Original Proposal:
${content}

Identified Issues to Fix:
${JSON.stringify(issues, null, 2)}

Desired Tone: ${tone}
- formal: Professional, business-appropriate language
- persuasive: Action-oriented, compelling, urgent
- executive: C-suite focused, strategic, high-level

Requirements:
1. Add a compelling executive summary if missing
2. Quantify all experience claims with specific numbers
3. Structure with clear phases/milestones
4. Make value proposition outcome-focused, not feature-focused
5. Add credibility signals and social proof
6. Use confident, action-oriented language
7. Include a strong call to action
8. Maintain the original proposal's core intent and pricing

Return ONLY the rewritten proposal text, no explanations or markdown formatting.`

  return generateTextContent(prompt, { maxTokens: 4000 })
}

export async function generateImprovements(originalContent: string, improvedContent: string) {
  const prompt = `Compare the original and improved proposals. Identify 4-6 key improvements made.

Original Proposal:
${originalContent}

Improved Proposal:
${improvedContent}

For each improvement:
1. Extract the before/after text snippets
2. Explain WHY this change matters (rationale with statistics if possible)
3. Rate the impact (high/medium/low)

Also score the improved proposal on the same 5 categories.

Return a JSON object with this exact structure:
{
  "improvements": [
    {
      "id": "unique-id",
      "category": "Category name",
      "impact": "high" | "medium" | "low",
      "title": "Improvement title",
      "before": "Original text snippet",
      "after": "Improved text snippet",
      "rationale": "Why this change matters"
    }
  ],
  "improvedScores": {
    "structure": 0-100,
    "credibility": 0-100,
    "persuasion": 0-100,
    "clarity": 0-100,
    "cta": 0-100
  },
  "overallImprovedScore": 0-100
}`

  return generateWithSchema(prompt, (text) => {
    const parsed = JSON.parse(text)
    return {
      improvements: parsed.improvements || [],
      improvedScores: parsed.improvedScores || { structure: 80, credibility: 80, persuasion: 80, clarity: 80, cta: 80 },
      overallImprovedScore: parsed.overallImprovedScore || 80,
    }
  })
}

// Export for legacy compatibility - now returns null during build
export const genAI = null // Deprecated - use getGenAI() function instead
export { getGenAI, requireGenAI }
