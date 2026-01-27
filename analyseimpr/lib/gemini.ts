import { GoogleGenAI } from "@google/genai"
import { SYSTEM_PROMPTS, OUTPUT_SCHEMAS, VALIDATION, INDUSTRY_PROMPTS } from "./prompts"

// Initialize Gemini client
const genAI = new GoogleGenAI({ apiKey: process.env.LN_GEMINI_API_KEY || "" })

// Safety settings for business content
const safetySettings = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
]

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview"
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || "")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)
const MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES || 2)
const INITIAL_BACKOFF_MS = Number(process.env.GEMINI_RETRY_BACKOFF_MS || 800)

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 8192,
}

function buildModelConfig(modelName: string) {
  return {
    model: modelName,
    config: {
      ...generationConfig,
      safetySettings,
    },
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === "object") {
    const status = (error as { status?: number }).status
    if (typeof status === "number") return status
  }
  const message =
    typeof error === "string" ? error : (error as { message?: string } | undefined)?.message
  if (typeof message === "string") {
    const match = message.match(/\b(429|503|500)\b/)
    if (match) return Number(match[1])
  }
  return undefined
}

function isRetryableError(error: unknown): boolean {
  const status = getErrorStatus(error)
  if (status === 429 || status === 503) return true
  const message =
    typeof error === "string" ? error : (error as { message?: string } | undefined)?.message
  return Boolean(
    message && /overloaded|resource exhausted|too many requests|rate limit/i.test(message),
  )
}

async function generateTextWithRetry(input: any): Promise<string> {
  const modelCandidates = [DEFAULT_MODEL, ...FALLBACK_MODELS].filter(
    (m, i, arr) => m && arr.indexOf(m) === i,
  )

  let lastError: unknown
  for (const modelName of modelCandidates) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await genAI.models.generateContent({
          ...buildModelConfig(modelName),
          contents: input,
        })
        const text = typeof response.text === "function" ? response.text() : response.text
        return text || ""
      } catch (error) {
        lastError = error
        if (!isRetryableError(error) || attempt === MAX_RETRIES) {
          break
        }
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt)
        const jitter = Math.floor(Math.random() * 150)
        await sleep(backoff + jitter)
      }
    }
  }

  throw lastError
}

export interface AnalysisResult {
  overallScore: number
  scores: {
    clarity: number
    persuasion: number
    readability: number
    professionalism: number
  }
  issues: Array<{
    id: string
    type: "critical" | "warning" | "suggestion"
    category: string
    title: string
    description: string
    location?: string
    priority?: number
  }>
  summary: string
  strengths: string[]
  recommendations: string[]
  wordCount?: number
  readabilityGrade?: string
  readabilityMetrics?: {
    fleschKincaid: number
    gradeLevel: string
    avgSentenceLength: number
    avgWordLength: number
    passiveVoicePercent: number
    jargonDensity: number
    readingTimeMinutes: number
    sentenceCount: number
    paragraphCount: number
    complexWordPercent: number
  }
  sections?: Array<{
    id: string
    type: "problem" | "solution" | "pricing" | "timeline" | "casestudy" | "intro" | "conclusion" | "other"
    title: string
    content: string
    score: number
    suggestions: string[]
  }>
  benchmark?: {
    percentile: number
    industryAvg: number
    topPerformers: number
    comparisonNote: string
  }
  executiveSummary?: {
    summary: string
    keyDifferentiators: string[]
    valueProposition: string
  }
}

export interface ImprovementResult {
  changes: Array<{
    type: "addition" | "removal" | "modification"
    original: string
    improved: string
    reason: string
    impact?: "high" | "medium" | "low"
  }>
  overallImprovement: number
  keyImprovements: string[]
  metrics?: {
    clarityGain: number
    persuasionGain: number
    readabilityGain: number
    professionalismGain: number
  }
}

/**
 * Analyze a proposal for quality metrics and issues
 */
export async function analyzeProposal(
  content: string,
  tone: string,
  industry = "general",
  goals?: { clarity?: boolean; persuasion?: boolean; readability?: boolean; legalRisk?: boolean },
): Promise<AnalysisResult> {
  // Build goals string
  const activeGoals =
    Object.entries(goals || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", ") || "clarity, persuasion, readability, professionalism"

  // Get industry-specific prompt modifier
  const industryPrompt = INDUSTRY_PROMPTS[industry] || INDUSTRY_PROMPTS.general

  const prompt = `${SYSTEM_PROMPTS.analyze}

INDUSTRY-SPECIFIC GUIDELINES:
${industryPrompt}

PROPOSAL TO ANALYZE:
"""
${content}
"""

REQUESTED TONE: ${tone}
FOCUS AREAS: ${activeGoals}

Analyze this proposal and return your assessment in the following JSON format ONLY (no markdown, no code blocks, no additional text):
${OUTPUT_SCHEMAS.analysis}

Important: Return ONLY the JSON object, nothing else.`

  const text = await generateTextWithRetry(prompt)

  // Parse JSON from response - handle potential markdown code blocks
  let jsonText = text.trim()

  // Remove markdown code blocks if present
  if (jsonText.startsWith("```json")) {
    jsonText = jsonText.slice(7)
  } else if (jsonText.startsWith("```")) {
    jsonText = jsonText.slice(3)
  }
  if (jsonText.endsWith("```")) {
    jsonText = jsonText.slice(0, -3)
  }

  // Find JSON object
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Failed to parse analysis response - no valid JSON found")
  }

  const parsed = JSON.parse(jsonMatch[0]) as AnalysisResult

  // Validate and sanitize response
  return {
    overallScore: Math.min(100, Math.max(0, parsed.overallScore || 0)),
    scores: {
      clarity: Math.min(100, Math.max(0, parsed.scores?.clarity || 0)),
      persuasion: Math.min(100, Math.max(0, parsed.scores?.persuasion || 0)),
      readability: Math.min(100, Math.max(0, parsed.scores?.readability || 0)),
      professionalism: Math.min(100, Math.max(0, parsed.scores?.professionalism || 0)),
    },
    issues: (parsed.issues || []).slice(0, VALIDATION.maxIssuesPerAnalysis).map((issue, i) => ({
      ...issue,
      id: issue.id || `issue-${i}-${Date.now()}`,
    })),
    summary: parsed.summary || "Analysis complete.",
    strengths: parsed.strengths || [],
    recommendations: parsed.recommendations || [],
    wordCount: parsed.wordCount,
    readabilityGrade: parsed.readabilityGrade,
    // Extended analysis fields
    readabilityMetrics: parsed.readabilityMetrics ? {
      fleschKincaid: Math.min(100, Math.max(0, parsed.readabilityMetrics.fleschKincaid || 0)),
      gradeLevel: parsed.readabilityMetrics.gradeLevel || "Unknown",
      avgSentenceLength: parsed.readabilityMetrics.avgSentenceLength || 0,
      avgWordLength: parsed.readabilityMetrics.avgWordLength || 0,
      passiveVoicePercent: Math.min(100, Math.max(0, parsed.readabilityMetrics.passiveVoicePercent || 0)),
      jargonDensity: Math.min(100, Math.max(0, parsed.readabilityMetrics.jargonDensity || 0)),
      readingTimeMinutes: parsed.readabilityMetrics.readingTimeMinutes || 1,
      sentenceCount: parsed.readabilityMetrics.sentenceCount || 0,
      paragraphCount: parsed.readabilityMetrics.paragraphCount || 0,
      complexWordPercent: Math.min(100, Math.max(0, parsed.readabilityMetrics.complexWordPercent || 0)),
    } : undefined,
    sections: parsed.sections?.map((section, i) => ({
      ...section,
      id: section.id || `section-${i}-${Date.now()}`,
      score: Math.min(100, Math.max(0, section.score || 0)),
      suggestions: section.suggestions || [],
    })),
    benchmark: parsed.benchmark ? {
      percentile: Math.min(100, Math.max(0, parsed.benchmark.percentile || 50)),
      industryAvg: Math.min(100, Math.max(0, parsed.benchmark.industryAvg || 65)),
      topPerformers: Math.min(100, Math.max(0, parsed.benchmark.topPerformers || 85)),
      comparisonNote: parsed.benchmark.comparisonNote || "",
    } : undefined,
    executiveSummary: parsed.executiveSummary ? {
      summary: parsed.executiveSummary.summary || "",
      keyDifferentiators: parsed.executiveSummary.keyDifferentiators || [],
      valueProposition: parsed.executiveSummary.valueProposition || "",
    } : undefined,
  }
}

/**
 * Rewrite a proposal based on tone and identified issues
 */
export async function rewriteProposal(
  content: string,
  tone: string,
  issues: Array<{ title: string; description: string; type?: string }>,
): Promise<string> {
  // Format issues by priority
  const criticalIssues = issues.filter((i) => i.type === "critical")
  const warningIssues = issues.filter((i) => i.type === "warning")
  const suggestions = issues.filter((i) => i.type === "suggestion" || !i.type)

  const issuesList = [
    ...criticalIssues.map((i) => `[CRITICAL] ${i.title}: ${i.description}`),
    ...warningIssues.map((i) => `[WARNING] ${i.title}: ${i.description}`),
    ...suggestions.map((i) => `[SUGGESTION] ${i.title}: ${i.description}`),
  ].join("\n")

  const prompt = `${SYSTEM_PROMPTS.rewrite}

ORIGINAL PROPOSAL:
"""
${content}
"""

REQUESTED TONE: ${tone}

ISSUES TO ADDRESS (in priority order):
${issuesList}

Rewrite the proposal to address ALL issues while maintaining the original structure and key points.
Match the ${tone} tone throughout.

IMPORTANT FORMATTING RULES:
- Return ONLY plain text, NO markdown formatting whatsoever
- Do NOT use asterisks (*) for bold, italic, or bullet points
- Do NOT use underscores (_) for emphasis
- Do NOT use hashtags (#) for headers
- Use simple dashes (-) for bullet points if needed
- Use numbers (1. 2. 3.) for numbered lists
- Use ALL CAPS for section headers instead of markdown
- Keep text clean and readable without any special formatting characters

Return ONLY the improved proposal text, no explanations or commentary.`

  const rawText = (await generateTextWithRetry(prompt)).trim()

  return stripMarkdown(rawText)
}

// Function to strip markdown formatting from text
function stripMarkdown(text: string): string {
  return (
    text
      // Remove bold/italic markers
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      // Remove headers
      .replace(/^#{1,6}\s+/gm, "")
      // Convert markdown bullet points to plain dashes
      .replace(/^\*\s+/gm, "- ")
      .replace(/^-\s+/gm, "- ")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      // Remove links but keep text
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      // Clean up extra whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  )
}

/**
 * Generate a comparison between original and improved versions
 */
export async function generateImprovements(original: string, improved: string): Promise<ImprovementResult> {
  const prompt = `${SYSTEM_PROMPTS.comparison}

ORIGINAL VERSION:
"""
${original}
"""

IMPROVED VERSION:
"""
${improved}
"""

Analyze the changes and return your assessment in the following JSON format ONLY (no markdown, no code blocks):
${OUTPUT_SCHEMAS.improvements}

Important: Return ONLY the JSON object, nothing else.`

  const text = await generateTextWithRetry(prompt)

  // Parse JSON
  let jsonText = text.trim()
  if (jsonText.startsWith("```json")) jsonText = jsonText.slice(7)
  else if (jsonText.startsWith("```")) jsonText = jsonText.slice(3)
  if (jsonText.endsWith("```")) jsonText = jsonText.slice(0, -3)

  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error("Failed to parse improvements response")
  }

  const parsed = JSON.parse(jsonMatch[0]) as ImprovementResult

  return {
    changes: parsed.changes || [],
    overallImprovement: Math.min(100, Math.max(0, parsed.overallImprovement || 0)),
    keyImprovements: parsed.keyImprovements || [],
    metrics: parsed.metrics,
  }
}

/**
 * Generate content for a specific section
 */
export async function generateSection(
  sectionType: string,
  context: {
    proposalTitle?: string
    industry?: string
    previousContent?: string
    requirements?: string
  },
  tone: string,
): Promise<string> {
  const prompt = `You are an expert proposal writer. Generate content for a ${sectionType} section.

Context:
- Proposal Title: ${context.proposalTitle || "Business Proposal"}
- Industry: ${context.industry || "General"}
- Tone: ${tone}
${context.previousContent ? `- Previous Content: ${context.previousContent}` : ""}
${context.requirements ? `- Specific Requirements: ${context.requirements}` : ""}

Generate professional, compelling content for this section. Keep it concise but impactful.

IMPORTANT: Return ONLY plain text. Do NOT use any markdown formatting like asterisks, underscores, or hashtags. Use simple dashes for bullet points and ALL CAPS for headers if needed.

Return ONLY the section content, no headers or formatting instructions.`

  const text = await generateTextWithRetry(prompt)
  return stripMarkdown(text.trim())
}
