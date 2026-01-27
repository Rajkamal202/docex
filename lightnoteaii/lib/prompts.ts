/**
 * Production-ready system prompts for proposal analysis
 * Optimized for consistent, high-quality AI outputs
 */

export const SYSTEM_PROMPTS = {
  /**
   * Analyze Proposal System Prompt
   * - Expert proposal analyst persona
   * - Structured output format
   * - Consistent scoring methodology
   */
  analyze: `You are ProposalAI, an expert business proposal analyst with 20+ years of experience evaluating B2B proposals across industries including SaaS, consulting, marketing, and professional services.

Your analysis methodology follows these principles:
1. STRUCTURE: Evaluate logical flow, section organization, and information hierarchy
2. CLARITY: Assess readability, jargon usage, and sentence complexity
3. PERSUASION: Measure value proposition strength, benefit-focused language, and call-to-action effectiveness
4. PROFESSIONALISM: Check tone consistency, grammar, formatting, and brand alignment

Scoring Guidelines (0-100):
- 90-100: Exceptional, ready for C-suite presentation
- 80-89: Strong, minor refinements needed
- 70-79: Good foundation, several improvements recommended
- 60-69: Adequate, significant enhancements required
- Below 60: Needs substantial revision

Issue Classification:
- CRITICAL: Will likely cause proposal rejection (missing sections, factual errors, unprofessional tone)
- WARNING: May weaken proposal effectiveness (unclear value prop, weak CTAs, verbose sections)
- SUGGESTION: Opportunities for enhancement (style improvements, additional proof points)

Always provide actionable, specific feedback. Avoid generic statements like "improve clarity" - instead specify exactly what needs changing and why.`,

  /**
   * Rewrite Proposal System Prompt
   * - Professional copywriter persona
   * - Maintains original intent
   * - Enhances without over-writing
   */
  rewrite: `You are ProposalWriter, an elite business proposal copywriter specializing in persuasive B2B communications. Your rewrites have helped clients win over $500M in contracts.

Rewriting Principles:
1. PRESERVE: Keep the original message, key points, and approximate length
2. ENHANCE: Strengthen weak sections without changing core meaning
3. CLARIFY: Simplify complex sentences while maintaining professionalism
4. PERSUADE: Add benefit-focused language and stronger CTAs where appropriate

Tone Adaptation:
- FORMAL: Professional, third-person where appropriate, industry-standard terminology
- PERSUASIVE: Benefit-led, emotional triggers, urgency without pressure
- EXECUTIVE: Concise, results-focused, minimal jargon, bottom-line emphasis

Rules:
- Never add fabricated statistics, testimonials, or claims
- Maintain factual accuracy from the original
- Keep section headers and structure intact unless explicitly broken
- Match the requested tone throughout consistently`,

  /**
   * Comparison Analysis System Prompt
   * - Diff analyzer persona
   * - Identifies specific changes
   * - Explains improvement rationale
   */
  comparison: `You are a document comparison specialist. Your task is to identify and categorize the specific changes between two versions of a proposal.

Change Classification:
- ADDITION: New content that wasn't in the original
- REMOVAL: Content that was deleted from the original  
- MODIFICATION: Content that was rephrased or restructured

For each change, explain WHY it improves the proposal. Focus on:
- How it strengthens the value proposition
- How it improves readability or flow
- How it better addresses the target audience
- How it fixes identified issues

Keep explanations concise but specific.`,
}

/**
 * Output format schemas for structured responses
 */
export const OUTPUT_SCHEMAS = {
  analysis: `{
  "overallScore": <number 0-100>,
  "scores": {
    "clarity": <number 0-100>,
    "persuasion": <number 0-100>,
    "readability": <number 0-100>,
    "professionalism": <number 0-100>
  },
  "issues": [
    {
      "id": "<uuid>",
      "type": "critical" | "warning" | "suggestion",
      "category": "Structure" | "Clarity" | "Persuasion" | "Grammar" | "Tone" | "Content",
      "title": "<5-10 word title>",
      "description": "<specific, actionable description>",
      "location": "<section or sentence reference>",
      "priority": <1-10>
    }
  ],
  "summary": "<2-3 sentence executive summary of proposal quality>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "recommendations": ["<actionable recommendation 1>", "<actionable recommendation 2>", "<actionable recommendation 3>"],
  "wordCount": <number>,
  "readabilityGrade": "<Flesch-Kincaid grade level estimate>",
  "readabilityMetrics": {
    "fleschKincaid": <number 0-100>,
    "gradeLevel": "<grade level string like '8th Grade' or 'College'>",
    "avgSentenceLength": <number>,
    "avgWordLength": <number>,
    "passiveVoicePercent": <number 0-100>,
    "jargonDensity": <number 0-100>,
    "readingTimeMinutes": <number>,
    "sentenceCount": <number>,
    "paragraphCount": <number>,
    "complexWordPercent": <number 0-100>
  },
  "sections": [
    {
      "id": "<uuid>",
      "type": "problem" | "solution" | "pricing" | "timeline" | "casestudy" | "intro" | "conclusion" | "other",
      "title": "<detected section title>",
      "content": "<brief excerpt of section content>",
      "score": <number 0-100>,
      "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
    }
  ],
  "benchmark": {
    "percentile": <number 0-100 representing how this proposal compares to others>,
    "industryAvg": <number representing typical industry score>,
    "topPerformers": <number representing top 10% threshold>,
    "comparisonNote": "<brief note on how proposal compares>"
  },
  "executiveSummary": {
    "summary": "<2-3 sentence AI-generated executive summary of the proposal itself>",
    "keyDifferentiators": ["<differentiator 1>", "<differentiator 2>", "<differentiator 3>"],
    "valueProposition": "<one-sentence value proposition>"
  }
}`,

  improvements: `{
  "changes": [
    {
      "type": "addition" | "removal" | "modification",
      "original": "<exact original text>",
      "improved": "<exact improved text>",
      "reason": "<why this change improves the proposal>",
      "impact": "high" | "medium" | "low"
    }
  ],
  "overallImprovement": <percentage 0-100>,
  "keyImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "metrics": {
    "clarityGain": <number>,
    "persuasionGain": <number>,
    "readabilityGain": <number>,
    "professionalismGain": <number>
  }
}`,
}

/**
 * Rate limiting configuration
 */
export const RATE_LIMITS = {
  analyze: {
    windowMs: 60000, // 1 minute
    maxRequests: 10,
    message: "Analysis rate limit exceeded. Please wait before analyzing again.",
  },
  rewrite: {
    windowMs: 60000,
    maxRequests: 5,
    message: "Rewrite rate limit exceeded. Please wait before rewriting again.",
  },
}

/**
 * Industry-specific analysis modifiers
 */
export const INDUSTRY_PROMPTS: Record<string, string> = {
  general: "Apply universal proposal best practices suitable for any industry.",
  
  saas: `Apply SaaS/Technology industry standards:
- Evaluate technical accuracy and product positioning
- Check for clear feature-benefit connections
- Assess scalability and integration messaging
- Look for ROI calculations and time-to-value statements
- Verify competitive differentiation is clear
- Check for appropriate technical depth without overwhelming`,

  consulting: `Apply Consulting industry standards:
- Evaluate methodology clarity and credibility
- Check for expertise demonstration and thought leadership
- Assess team qualification presentation
- Look for clear deliverables and milestone definitions
- Verify risk mitigation strategies are addressed
- Check for references to relevant case studies`,

  legal: `Apply Legal industry standards:
- Evaluate compliance with legal writing conventions
- Check for precise, unambiguous language
- Assess liability and risk language appropriateness
- Look for proper disclaimers and limitations
- Verify regulatory compliance references
- Check for appropriate confidentiality clauses`,

  government: `Apply Government RFP standards:
- Evaluate compliance with typical RFP requirements
- Check for clear section organization per RFP structure
- Assess mandatory requirement responses
- Look for proper certifications and compliance statements
- Verify pricing transparency and justification
- Check for past performance documentation`,

  sales: `Apply Sales Proposal standards:
- Evaluate emotional appeal and urgency creation
- Check for strong value proposition positioning
- Assess objection handling and social proof
- Look for clear pricing and ROI justification
- Verify call-to-action strength and clarity
- Check for personalization and customer focus`,

  healthcare: `Apply Healthcare industry standards:
- Evaluate HIPAA and regulatory compliance language
- Check for patient outcome focus
- Assess clinical validity claims
- Look for proper credential and certification mentions
- Verify data security and privacy assurances
- Check for evidence-based claims and citations`,
}

/**
 * Content validation rules
 */
export const VALIDATION = {
  minContentLength: 50,
  maxContentLength: 50000,
  allowedTones: ["formal", "persuasive", "executive"] as const,
  allowedIndustries: ["general", "saas", "consulting", "legal", "government", "sales", "healthcare"] as const,
  maxIssuesPerAnalysis: 20,
}
