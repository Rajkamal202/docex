"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  Layout,
  TrendingUp,
  Share2,
  Trophy,
  XCircle,
  Lock,
  Sparkles,
  Loader2,
  UserCheck,
  Clock,
  PenLine,
  FileText,
  Copy,
  ArrowUpRight,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockResults = {
  overallScore: 87,
  verdict: "A well-structured proposal with strong fundamentals, but could strengthen persuasion and credibility.",
  dimensions: {
    clarity: { score: 92, label: "Clarity", description: "How clear and understandable is your proposal" },
    persuasion: { score: 85, label: "Persuasion", description: "How convincing are your arguments" },
    structure: { score: 88, label: "Structure", description: "Organization and flow of content" },
    compliance: { score: 83, label: "Compliance", description: "Adherence to proposal best practices" },
  },
  freeWeaknesses: [
    { section: "Value Proposition", issue: "Lacks specific, quantifiable outcomes" },
    { section: "Credibility", issue: "Missing social proof or case studies" },
    { section: "Call-to-Action", issue: "Ending could be more actionable" },
  ],
  lockedPreview: [
    "Why your opening may not capture attention",
    "Pricing presentation improvements",
    "3 missing elements that build trust",
  ],
  sections: [
    { name: "Executive Summary", score: 92, status: "good" },
    { name: "Problem Statement", score: 85, status: "good" },
    { name: "Proposed Solution", score: 78, status: "warning" },
    { name: "Timeline & Milestones", score: 90, status: "good" },
    { name: "Pricing & Budget", score: 88, status: "good" },
  ],
  issues: [
    {
      type: "warning",
      title: "Vague value proposition",
      description:
        'The solution section lacks specific metrics. Consider adding quantifiable outcomes like "reduce costs by 30%".',
      section: "Proposed Solution",
      impact: "high",
    },
    {
      type: "warning",
      title: "Missing case study",
      description: "Include at least one relevant case study or testimonial to build credibility.",
      section: "Proposed Solution",
      impact: "medium",
    },
    {
      type: "suggestion",
      title: "Strengthen call-to-action",
      description: "End with a clear next step. Suggest scheduling a call or meeting to discuss further.",
      section: "Conclusion",
      impact: "low",
    },
  ],
  benchmarks: {
    industry: "Marketing Agency",
    yourScore: 87,
    industryAverage: 72,
    topPerformers: 94,
    percentile: 78,
  },
  winProbability: 73,
}

const mockDetailedFeedback = [
  {
    section: "Executive Summary",
    rating: "Strong",
    analysis:
      "Your executive summary effectively communicates the core value proposition, but could benefit from a stronger hook in the opening sentence.",
    suggestion:
      "Lead with the client's primary pain point, then position your solution as the answer. Consider: 'Reducing customer churn by 40% requires...'",
    impact: "Improves first impression and keeps readers engaged",
  },
  {
    section: "Value Proposition",
    rating: "Needs Work",
    analysis:
      "The current value proposition is generic and doesn't differentiate from competitors. Decision-makers need specific outcomes to justify the investment.",
    suggestion:
      "Replace vague claims with quantifiable results. Instead of 'improve efficiency', state 'reduce processing time from 2 hours to 15 minutes, saving $50,000 annually'.",
    impact: "Quantified value is 3x more persuasive to budget holders",
  },
  {
    section: "Credibility & Proof",
    rating: "Missing",
    analysis:
      "Your proposal lacks social proof, which is critical for new client relationships. Without case studies or testimonials, prospects must take your claims on faith.",
    suggestion:
      "Add 1-2 relevant case studies with specific metrics. Include client logos if permitted. Even a brief testimonial quote adds significant credibility.",
    impact: "Proposals with case studies have 45% higher close rates",
  },
  {
    section: "Pricing Presentation",
    rating: "Good",
    analysis:
      "Pricing is clearly structured but presented as a cost rather than an investment. The ROI justification is weak.",
    suggestion:
      "Frame pricing against the value delivered. Show the cost of inaction or calculate ROI: 'Investment: $15,000 → Expected return: $75,000 in Year 1'.",
    impact: "Value-framed pricing reduces price objections by 60%",
  },
  {
    section: "Call-to-Action",
    rating: "Weak",
    analysis:
      "The proposal ends without a clear next step, leaving the decision in limbo. Prospects need guidance on what to do next.",
    suggestion:
      "End with a specific, low-friction next step: 'Let's schedule a 30-minute call this week to discuss your questions. I've blocked Thursday at 2 PM or Friday at 10 AM.'",
    impact: "Clear CTAs increase response rates by 35%",
  },
]

const mockRewrittenProposal = {
  deliveredAt: "2 hours ago",
  content: `Dear [Client Name],

After reviewing your requirements for modernizing your customer engagement platform, I'm confident our team can deliver a solution that reduces customer churn by 40% within the first quarter of implementation.

**The Challenge You're Facing**

Your current system struggles with fragmented customer data, leading to missed opportunities and inconsistent experiences. Based on similar projects, this typically results in 25-30% higher churn rates than industry benchmarks.

**Our Proven Approach**

We'll implement a unified customer data platform with:
- Real-time engagement scoring (reduces response time by 60%)
- Automated journey mapping with AI-driven recommendations
- Integration with your existing CRM within 2 weeks

**Why We're the Right Partner**

Having delivered 15+ similar transformations for companies like [Reference Client], we've refined a methodology that minimizes disruption while maximizing adoption. Our last three projects achieved ROI within 4 months.

**Investment & Timeline**

- Discovery & Planning: Week 1-2 ($8,000)
- Development & Integration: Week 3-8 ($32,000)
- Training & Optimization: Week 9-10 ($5,000)

Total Investment: $45,000

**Next Step**

I'd love to walk you through a case study from [Similar Company] and discuss how we'd tailor this approach for your specific needs. Are you available for a 30-minute call this Thursday or Friday?

Best regards,
[Your Name]`,
}

function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label,
}: {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500"
    if (s >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={getColor(score)}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${getColor(score)}`}>{score}</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}

export function AuditResultsClient() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [expertAuditStatus, setExpertAuditStatus] = useState<"idle" | "requested" | "completed">("idle")
  const [isRequestingExpert, setIsRequestingExpert] = useState(false)
  const [rewriteStatus, setRewriteStatus] = useState<"idle" | "intake" | "processing" | "completed">("idle")
  const [isProcessingRewrite, setIsProcessingRewrite] = useState(false)
  const [rewriteIntake, setRewriteIntake] = useState({
    targetClient: "",
    primaryGoal: "",
    preferences: "",
  })

  const [originalScore] = useState(mockResults.overallScore)
  const [improvedScore, setImprovedScore] = useState<number | null>(null)
  const [risksReduced, setRisksReduced] = useState<string[]>([])

  const handleUnlock = async () => {
    setIsUnlocking(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsUnlocked(true)
    setIsUnlocking(false)
    const improvement = Math.min(12, Math.floor(Math.random() * 8) + 6)
    setImprovedScore(Math.min(100, originalScore + improvement))
    setRisksReduced(mockResults.freeWeaknesses.slice(0, 3).map((w) => w.section))
  }

  const handleRequestExpertAudit = async () => {
    setIsRequestingExpert(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setExpertAuditStatus("requested")
    setIsRequestingExpert(false)
  }

  const handleRewritePayment = async () => {
    setIsProcessingRewrite(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessingRewrite(false)
    setRewriteStatus("intake")
  }

  const handleRewriteSubmit = async () => {
    setRewriteStatus("processing")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setRewriteStatus("completed")
    const improvement = Math.min(20, Math.floor(Math.random() * 10) + 12)
    setImprovedScore(Math.min(100, originalScore + improvement))
    setRisksReduced(mockResults.freeWeaknesses.map((w) => w.section))
  }

  const handleCopyRewrite = () => {
    navigator.clipboard.writeText(mockRewrittenProposal.content)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100"
    if (score >= 60) return "bg-amber-100"
    return "bg-red-100"
  }

  const mockExpertFeedback = {
    reviewer: "Sarah Mitchell",
    title: "Senior Proposal Strategist",
    submittedAt: "2 hours ago",
    summary:
      "Your proposal has strong technical foundations but needs work on emotional resonance and urgency. Decision-makers often skim proposals—your key value needs to hit within the first 30 seconds of reading.",
    feedback: [
      {
        category: "Persuasion & Positioning",
        insight:
          "You're leading with features instead of outcomes. The client cares about results, not your process. Flip the narrative: start with what they'll achieve, then explain how.",
        recommendation:
          "Rewrite the opening to lead with a bold claim: 'This proposal outlines how [Client] can achieve [specific outcome] within [timeframe].'",
      },
      {
        category: "Clarity of Value",
        insight:
          "Your pricing section is buried and defensive. It reads like you're apologizing for the cost rather than justifying the investment.",
        recommendation:
          "Move pricing earlier and frame it as ROI. Show the cost of inaction alongside your investment ask.",
      },
      {
        category: "Missing Proof",
        insight:
          "No case studies, no testimonials, no logos. You're asking them to trust you on faith alone. That's a big ask for a new relationship.",
        recommendation:
          "Add at least one relevant case study with specific metrics. Even a brief quote from a past client adds significant credibility.",
      },
      {
        category: "Decision-Maker Risk",
        insight:
          "The proposal doesn't address the client's internal politics. Who else needs to approve this? What objections might they face from their team?",
        recommendation:
          "Add a section that helps your contact sell internally: key talking points, executive summary for stakeholders, risk mitigation.",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Audit Results</h1>
            <p className="text-sm text-muted-foreground">Q4 Marketing Proposal.pdf</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/portals/create?proposal=1">
              <Share2 className="mr-2 h-4 w-4" />
              Share with Client
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
            {/* Score Ring */}
            <div className="flex flex-col items-center mb-6 lg:mb-0">
              <ScoreRing score={mockResults.overallScore} label="Overall" />
              <Badge
                className={`mt-3 ${mockResults.overallScore >= 80 ? "bg-emerald-100 text-emerald-700" : mockResults.overallScore >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
              >
                {mockResults.overallScore >= 80 ? "Strong" : mockResults.overallScore >= 60 ? "Good" : "Needs Work"}
              </Badge>
            </div>

            {/* Verdict and Details */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Proposal Quality Review</h3>
                <p className="text-sm text-gray-500">
                  AI-powered analysis of clarity, persuasion, and approval likelihood
                </p>
              </div>
              <p className="text-gray-700 mb-4">{mockResults.verdict}</p>

              {improvedScore && improvedScore > originalScore && (
                <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-white border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Score improved from{" "}
                        <span className={`font-bold ${getScoreColor(originalScore)}`}>{originalScore}</span>
                        {" → "}
                        <span className={`font-bold ${getScoreColor(improvedScore)}`}>{improvedScore}</span>
                        <Badge className="ml-2 bg-emerald-100 text-emerald-700 text-[10px]">
                          +{improvedScore - originalScore} points
                        </Badge>
                      </p>
                      {risksReduced.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Key risks addressed: {risksReduced.join(", ")}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dimension scores */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(mockResults.dimensions).map(([key, dim]) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-lg bg-white border">
                    <span className="text-sm text-gray-600">{dim.label}</span>
                    <span className={`font-semibold ${getScoreColor(dim.score)}`}>{dim.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isUnlocked ? (
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 shrink-0">
                <Lock className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Detailed Feedback Available</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Detailed feedback can help you strengthen this proposal before sending.
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Includes analysis of:</p>
                  {mockResults.lockedPreview.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span className="blur-[2px] select-none">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Button onClick={handleUnlock} disabled={isUnlocking} className="bg-indigo-600 hover:bg-indigo-700">
                    {isUnlocking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Unlock Full Feedback — $2.99
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-400">
                    Get section-by-section analysis with specific improvement suggestions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Full Feedback Unlocked</CardTitle>
            </div>
            <CardDescription>Section-by-section analysis with specific improvement guidance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockDetailedFeedback.map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.section}</h4>
                  <Badge
                    variant="secondary"
                    className={
                      item.rating === "Strong"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.rating === "Good"
                          ? "bg-blue-100 text-blue-700"
                          : item.rating === "Needs Work"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                    }
                  >
                    {item.rating}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{item.analysis}</p>
                <div className="bg-indigo-50 rounded-lg p-3 mb-2">
                  <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide mb-1">Suggestion</p>
                  <p className="text-sm text-indigo-900">{item.suggestion}</p>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {item.impact}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 shrink-0">
              <UserCheck className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              {expertAuditStatus === "idle" && (
                <>
                  <h3 className="font-semibold text-gray-900">Expert Audit (Human Review)</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    A human expert will review your proposal to assess clarity, persuasion, and real-world
                    decision-maker impact.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This complements the AI audit by identifying risks that automated analysis may miss—such as
                    emotional tone, competitive positioning, and internal stakeholder concerns.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <Button
                      onClick={handleRequestExpertAudit}
                      disabled={isRequestingExpert}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50 bg-transparent"
                    >
                      {isRequestingExpert ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Request Expert Audit — $5.99
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400">Reviewed by experienced proposal strategists</p>
                  </div>
                </>
              )}

              {expertAuditStatus === "requested" && (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <h3 className="font-semibold text-gray-900">Expert Review in Progress</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    A human expert is reviewing your proposal. You'll receive detailed feedback within 24 hours.
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                      In Review
                    </Badge>
                    <span>Estimated completion: within 24 hours</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    We'll notify you by email when the review is complete. Your proposal remains accessible for viewing
                    or download.
                  </p>
                  {/* Demo button to simulate completion */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-xs text-gray-400"
                    onClick={() => setExpertAuditStatus("completed")}
                  >
                    (Demo: Mark as completed)
                  </Button>
                </>
              )}

              {expertAuditStatus === "completed" && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-semibold text-gray-900">Expert Feedback</h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 ml-2">
                      Completed
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                      SM
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{mockExpertFeedback.reviewer}</p>
                      <p className="text-xs text-gray-500">
                        {mockExpertFeedback.title} • Reviewed {mockExpertFeedback.submittedAt}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 mb-6">
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Summary</p>
                    <p className="text-sm text-amber-900">{mockExpertFeedback.summary}</p>
                  </div>

                  <div className="space-y-5">
                    {mockExpertFeedback.feedback.map((item, i) => (
                      <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <h4 className="font-medium text-gray-900 mb-2">{item.category}</h4>
                        <p className="text-sm text-gray-600 mb-3">{item.insight}</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Recommendation
                          </p>
                          <p className="text-sm text-gray-700">{item.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-violet-200 bg-gradient-to-br from-violet-50/50 to-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100">
              <PenLine className="h-5 w-5 text-violet-600" />
            </div>
            <div className="flex-1">
              {rewriteStatus === "idle" && (
                <>
                  <h3 className="font-semibold text-gray-900">Rewrite Done For You</h3>
                  <p className="text-sm text-gray-600 mt-1 mb-4">
                    We'll rewrite your proposal to improve clarity, persuasion, and alignment with the client's
                    expectations — so you can send it with confidence.
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1.5 mb-5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-violet-500" />
                      Full rewrite, not just suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-violet-500" />
                      Based on audit insights and best practices
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-violet-500" />
                      Optimized for maximum approval readiness
                    </li>
                  </ul>
                  <div className="flex flex-col gap-2">
                    <Button
                      className="bg-violet-600 hover:bg-violet-700 text-white"
                      onClick={handleRewritePayment}
                      disabled={isProcessingRewrite}
                    >
                      {isProcessingRewrite ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <PenLine className="mr-2 h-4 w-4" />
                          Rewrite My Proposal — $29
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400">Delivered within 24–48 hours</p>
                  </div>
                </>
              )}

              {rewriteStatus === "intake" && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <h3 className="font-semibold text-gray-900">Payment Successful</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-5">
                    Help us tailor your rewrite by answering a few quick questions.
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetClient" className="text-sm font-medium text-gray-700">
                        Target client or audience
                      </Label>
                      <Input
                        id="targetClient"
                        placeholder="e.g., Marketing agency, SaaS startup, Enterprise IT team"
                        value={rewriteIntake.targetClient}
                        onChange={(e) => setRewriteIntake((prev) => ({ ...prev, targetClient: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryGoal" className="text-sm font-medium text-gray-700">
                        Primary goal of this proposal
                      </Label>
                      <Input
                        id="primaryGoal"
                        placeholder="e.g., Win a $50k project, Secure a retainer agreement"
                        value={rewriteIntake.primaryGoal}
                        onChange={(e) => setRewriteIntake((prev) => ({ ...prev, primaryGoal: e.target.value }))}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferences" className="text-sm font-medium text-gray-700">
                        Any constraints or preferences? <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Textarea
                        id="preferences"
                        placeholder="e.g., Keep the pricing section as-is, Use a more formal tone"
                        value={rewriteIntake.preferences}
                        onChange={(e) => setRewriteIntake((prev) => ({ ...prev, preferences: e.target.value }))}
                        className="bg-white min-h-[80px]"
                      />
                    </div>
                    <Button
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white mt-2"
                      onClick={handleRewriteSubmit}
                      disabled={!rewriteIntake.targetClient || !rewriteIntake.primaryGoal}
                    >
                      Submit & Start Rewrite
                    </Button>
                  </div>
                </>
              )}

              {rewriteStatus === "processing" && (
                <>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-violet-500" />
                    <h3 className="font-semibold text-gray-900">Rewrite in Progress</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Our team is rewriting your proposal based on the audit insights and your preferences.
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
                    <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                      In Progress
                    </Badge>
                    <span>Estimated delivery: within 24–48 hours</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    We'll notify you by email when your rewritten proposal is ready.
                  </p>
                  {/* Demo button to simulate completion */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-xs text-gray-400"
                    onClick={() => setRewriteStatus("completed")}
                  >
                    (Demo: Mark as completed)
                  </Button>
                </>
              )}

              {rewriteStatus === "completed" && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-semibold text-gray-900">Rewritten Proposal</h3>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 ml-2">
                      Ready
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Delivered {mockRewrittenProposal.deliveredAt}</p>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 max-h-[400px] overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {mockRewrittenProposal.content}
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={handleCopyRewrite}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Text
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      View in Editor
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4">
            <ScoreRing score={mockResults.overallScore} size={140} strokeWidth={10} />
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">
                Top {100 - mockResults.benchmarks.percentile}%
              </Badge>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Better than {mockResults.benchmarks.percentile}% of {mockResults.benchmarks.industry} proposals
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Score Breakdown
            </CardTitle>
            <CardDescription>Performance across key dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {Object.entries(mockResults.dimensions).map(([key, dim]) => (
                <div key={key} className="flex flex-col items-center text-center">
                  <ScoreRing score={dim.score} size={80} strokeWidth={6} />
                  <p className="mt-2 font-medium">{dim.label}</p>
                  <p className="text-xs text-muted-foreground">{dim.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5" />
              Win Probability
            </CardTitle>
            <CardDescription>AI-predicted chance of winning this deal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-5xl font-bold text-primary">{mockResults.winProbability}%</div>
              <div className="flex-1 space-y-2">
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${mockResults.winProbability}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Based on clarity, persuasion, and industry benchmarks</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-muted-foreground">{mockResults.benchmarks.industryAverage}</p>
                <p className="text-xs text-muted-foreground">Industry Avg</p>
              </div>
              <div className="text-center border-x">
                <p className="text-2xl font-bold text-primary">{mockResults.benchmarks.yourScore}</p>
                <p className="text-xs text-muted-foreground">Your Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-500">{mockResults.benchmarks.topPerformers}</p>
                <p className="text-xs text-muted-foreground">Top 10%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Track Outcome
            </CardTitle>
            <CardDescription>Record the result to improve AI predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Did you win or lose this proposal? Tracking outcomes helps our AI learn and provide better feedback.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Trophy className="mr-2 h-4 w-4" />
                Won
              </Button>
              <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
                <XCircle className="mr-2 h-4 w-4" />
                Lost
              </Button>
            </div>
            <Button variant="ghost" className="w-full text-muted-foreground">
              Still pending
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sections" className="gap-2">
            <Layout className="h-4 w-4" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="issues" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Issues ({mockResults.issues.filter((i) => i.type === "warning").length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="strengths" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Strengths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
          <Card>
            <CardHeader>
              <CardTitle>Section Scores</CardTitle>
              <CardDescription>Performance breakdown by section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResults.sections.map((section) => (
                <div key={section.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{section.name}</span>
                    <span
                      className={
                        section.score >= 85
                          ? "font-medium text-emerald-500"
                          : section.score >= 70
                            ? "font-medium text-yellow-500"
                            : "font-medium text-red-500"
                      }
                    >
                      {section.score}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full transition-all ${
                        section.score >= 85 ? "bg-emerald-500" : section.score >= 70 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${section.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle>Issues to Fix</CardTitle>
              <CardDescription>Critical items that need attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResults.issues
                .filter((i) => i.type === "warning")
                .map((issue, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{issue.title}</p>
                          <Badge variant={issue.impact === "high" ? "destructive" : "secondary"}>
                            {issue.impact} impact
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{issue.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">Section: {issue.section}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
              <CardDescription>Optional enhancements to boost your score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResults.issues
                .filter((i) => i.type === "suggestion")
                .map((issue, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">{issue.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{issue.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">Section: {issue.section}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strengths">
          <Card>
            <CardHeader>
              <CardTitle>Strengths</CardTitle>
              <CardDescription>What your proposal does well</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Clear and concise executive summary",
                  "Well-structured timeline with realistic milestones",
                  "Competitive and transparent pricing",
                  "Professional tone throughout",
                  "Strong problem identification",
                ].map((strength) => (
                  <div key={strength} className="flex items-start gap-2 rounded-lg border bg-emerald-500/5 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
