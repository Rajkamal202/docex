import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Target,
  FileText,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

export default function AuditProposalGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      {/* Breadcrumb */}
      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documentation
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 mb-6">
            <BookOpen className="h-4 w-4" />
            <span>Complete Guide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
            How to Write a Compelling Audit Proposal
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Master the art of writing audit proposals that win clients. Learn the proven structure, essential
            components, and AI-powered tips to create proposals that stand out.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              15 min read
            </span>
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Updated January 2026
            </span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 aspect-video">
            <Image
              src="/professional-business-proposal-document-with-chart.jpg"
              alt="Professional audit proposal document"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">In This Guide</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: "1", title: "Understanding Audit Proposals", anchor: "#understanding" },
                { num: "2", title: "Essential Components", anchor: "#components" },
                { num: "3", title: "Writing the Executive Summary", anchor: "#executive-summary" },
                { num: "4", title: "Defining Scope & Objectives", anchor: "#scope" },
                { num: "5", title: "Methodology & Approach", anchor: "#methodology" },
                { num: "6", title: "Timeline & Deliverables", anchor: "#timeline" },
                { num: "7", title: "Pricing Strategies", anchor: "#pricing" },
                { num: "8", title: "Using AI to Enhance Your Proposal", anchor: "#ai-tips" },
              ].map((item) => (
                <Link
                  key={item.num}
                  href={item.anchor}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white transition-colors"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700">
                    {item.num}
                  </span>
                  <span className="text-sm text-gray-700">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Section 1: Understanding */}
            <section id="understanding" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Lightbulb className="h-5 w-5" />
                </span>
                Understanding Audit Proposals
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                An audit proposal is a formal document that outlines your plan to evaluate and assess a client&apos;s
                systems, processes, or financial records. Unlike general service proposals, audit proposals require a
                structured approach that demonstrates your expertise, methodology, and commitment to thoroughness.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/audit-proposal-structure-diagram-showing-executive.jpg"
                  alt="Audit proposal structure diagram"
                  width={800}
                  height={400}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    title: "Financial Audits",
                    desc: "Review of financial statements, internal controls, and compliance",
                    icon: DollarSign,
                  },
                  {
                    title: "Operational Audits",
                    desc: "Assessment of efficiency, effectiveness, and process optimization",
                    icon: Target,
                  },
                  {
                    title: "Compliance Audits",
                    desc: "Verification of adherence to regulations, standards, and policies",
                    icon: CheckCircle2,
                  },
                ].map((type) => (
                  <div key={type.title} className="rounded-xl border border-gray-200 p-4 bg-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 mb-3">
                      <type.icon className="h-5 w-5 text-gray-700" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{type.title}</h3>
                    <p className="text-sm text-gray-500">{type.desc}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 mb-1">Key Insight</p>
                  <p className="text-sm text-amber-700">
                    The best audit proposals address not just what you&apos;ll do, but why your approach is uniquely
                    suited to the client&apos;s specific situation and challenges.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2: Components */}
            <section id="components" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <FileText className="h-5 w-5" />
                </span>
                Essential Components of an Audit Proposal
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                A winning audit proposal includes several critical sections that work together to demonstrate your
                competence and build trust with potential clients.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/infographic-showing-8-components-of-audit-proposal.jpg"
                  alt="Essential components of an audit proposal"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: "01",
                    title: "Cover Letter",
                    desc: "Personal introduction that sets the tone and highlights key value propositions",
                  },
                  {
                    num: "02",
                    title: "Executive Summary",
                    desc: "Concise overview of your understanding, approach, and expected outcomes",
                  },
                  {
                    num: "03",
                    title: "Scope of Work",
                    desc: "Detailed description of areas to be audited and boundaries",
                  },
                  {
                    num: "04",
                    title: "Methodology",
                    desc: "Step-by-step approach explaining how you'll conduct the audit",
                  },
                  {
                    num: "05",
                    title: "Team Qualifications",
                    desc: "Credentials and experience of team members assigned to the project",
                  },
                  { num: "06", title: "Timeline & Milestones", desc: "Realistic schedule with key deliverable dates" },
                  { num: "07", title: "Pricing & Payment Terms", desc: "Clear fee structure and payment schedule" },
                  {
                    num: "08",
                    title: "Terms & Conditions",
                    desc: "Legal terms, confidentiality, and professional standards",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-medium flex-shrink-0">
                      {item.num}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Executive Summary */}
            <section id="executive-summary" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                Writing the Executive Summary
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                The executive summary is often the most-read section of your proposal. It should capture the essence of
                your entire proposal in 1-2 pages and convince the reader to continue reading.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/executive-summary-template-example-with-highlighte.jpg"
                  alt="Executive summary example"
                  width={800}
                  height={450}
                  className="w-full"
                />
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-6">
                <h3 className="font-semibold mb-4">Executive Summary Formula</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Hook", desc: "Open with the client's primary challenge or goal" },
                    { label: "Understanding", desc: "Demonstrate deep knowledge of their situation" },
                    { label: "Solution", desc: "Present your approach as the ideal solution" },
                    { label: "Value", desc: "Highlight specific benefits and expected outcomes" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-800 mb-1">Pro Tip</p>
                  <p className="text-sm text-emerald-700">
                    Write your executive summary last, after completing all other sections. This ensures it accurately
                    reflects the full scope and value of your proposal.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Scope */}
            <section id="scope" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <Target className="h-5 w-5" />
                </span>
                Defining Scope & Objectives
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                A well-defined scope prevents misunderstandings and scope creep. Be specific about what&apos;s included
                and, importantly, what&apos;s not included in your audit.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                  <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    In Scope
                  </h3>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      Review of financial statements for FY 2025
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      Assessment of internal control procedures
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      Compliance testing for industry regulations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                      Management letter with recommendations
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Out of Scope
                  </h3>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      Tax preparation or filing services
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      IT security penetration testing
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      Legal advice or representation
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                      Implementation of recommended changes
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <Image
                  src="/scope-definition-diagram-showing-audit-boundaries-.jpg"
                  alt="Scope definition diagram"
                  width={800}
                  height={400}
                  className="w-full"
                />
              </div>
            </section>

            {/* Section 5: Methodology */}
            <section id="methodology" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5" />
                </span>
                Methodology & Approach
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Your methodology section should explain how you&apos;ll conduct the audit step by step. This builds
                confidence by showing your systematic and professional approach.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/audit-methodology-flowchart-showing-phases-plannin.jpg"
                  alt="Audit methodology flowchart"
                  width={800}
                  height={500}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                {[
                  {
                    phase: "Phase 1: Planning",
                    duration: "Week 1-2",
                    activities: [
                      "Initial meetings",
                      "Risk assessment",
                      "Audit program development",
                      "Resource allocation",
                    ],
                  },
                  {
                    phase: "Phase 2: Fieldwork",
                    duration: "Week 3-6",
                    activities: ["Document review", "Testing procedures", "Interviews", "Data analysis"],
                  },
                  {
                    phase: "Phase 3: Analysis",
                    duration: "Week 7-8",
                    activities: [
                      "Findings compilation",
                      "Root cause analysis",
                      "Recommendation development",
                      "Quality review",
                    ],
                  },
                  {
                    phase: "Phase 4: Reporting",
                    duration: "Week 9-10",
                    activities: [
                      "Draft report preparation",
                      "Management discussion",
                      "Final report delivery",
                      "Exit meeting",
                    ],
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{item.phase}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{item.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.activities.map((activity, j) => (
                        <span
                          key={j}
                          className="text-sm bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-gray-600"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6: Timeline */}
            <section id="timeline" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Clock className="h-5 w-5" />
                </span>
                Timeline & Deliverables
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Provide a realistic timeline with clear milestones. Clients appreciate knowing exactly when they can
                expect updates and deliverables.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/project-timeline-gantt-chart-showing-audit-phases-.jpg"
                  alt="Audit timeline gantt chart"
                  width={800}
                  height={400}
                  className="w-full"
                />
              </div>

              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 mb-4">Key Deliverables Checklist</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Engagement letter",
                    "Audit plan document",
                    "Weekly status updates",
                    "Preliminary findings memo",
                    "Draft audit report",
                    "Final audit report",
                    "Management letter",
                    "Executive presentation",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-indigo-100">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                      <span className="text-sm text-indigo-900">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 7: Pricing */}
            <section id="pricing" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <DollarSign className="h-5 w-5" />
                </span>
                Pricing Strategies
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Present your pricing clearly and justify the value. Consider offering multiple options to give clients
                flexibility while anchoring them to your preferred package.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/pricing-table-comparison-showing-three-tiers-basic.jpg"
                  alt="Pricing comparison table"
                  width={800}
                  height={450}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    tier: "Basic",
                    price: "$5,000",
                    desc: "Essential audit coverage for small businesses",
                    highlight: false,
                  },
                  {
                    tier: "Standard",
                    price: "$12,000",
                    desc: "Comprehensive audit with detailed recommendations",
                    highlight: true,
                  },
                  {
                    tier: "Premium",
                    price: "$25,000",
                    desc: "Full-service audit with ongoing support",
                    highlight: false,
                  },
                ].map((item) => (
                  <div
                    key={item.tier}
                    className={`rounded-xl p-5 ${
                      item.highlight
                        ? "bg-gray-900 text-white border-2 border-gray-900"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className={`text-sm font-medium mb-1 ${item.highlight ? "text-gray-400" : "text-gray-500"}`}>
                      {item.tier}
                    </p>
                    <p className={`text-3xl font-bold mb-2 ${item.highlight ? "text-white" : "text-gray-900"}`}>
                      {item.price}
                    </p>
                    <p className={`text-sm ${item.highlight ? "text-gray-400" : "text-gray-500"}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: AI Tips */}
            <section id="ai-tips" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Sparkles className="h-5 w-5" />
                </span>
                Using AI to Enhance Your Proposal
              </h2>

              <p className="text-gray-600 mb-6 leading-relaxed">
                LightNote AI can help you create compelling audit proposals faster. Here&apos;s how to leverage AI tools
                effectively while maintaining your professional expertise.
              </p>

              <div className="rounded-2xl border border-gray-200 overflow-hidden mb-6">
                <Image
                  src="/ai-proposal-assistant-interface-showing-audit-prop.jpg"
                  alt="LightNote AI proposal assistant"
                  width={800}
                  height={450}
                  className="w-full"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    title: "AI Audit Feature",
                    desc: "Upload your draft and get instant feedback on structure, clarity, and persuasiveness",
                    cta: "Try Audit Proposal",
                  },
                  {
                    title: "Smart Generation",
                    desc: "Answer guided questions and let AI generate a professional proposal draft",
                    cta: "Generate Proposal",
                  },
                  {
                    title: "Template Library",
                    desc: "Choose from industry-specific templates optimized for different audit types",
                    cta: "Browse Templates",
                  },
                  {
                    title: "AI Rewriting",
                    desc: "Improve specific sections with AI suggestions for tone, clarity, and impact",
                    cta: "Open AI Studio",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                    <Button variant="outline" size="sm" className="rounded-full bg-transparent" asChild>
                      <Link href="/dashboard">{item.cta}</Link>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-violet-50 border border-violet-200 p-4 flex gap-3">
                <Sparkles className="h-5 w-5 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-violet-800 mb-1">AI Best Practice</p>
                  <p className="text-sm text-violet-700">
                    Always review and customize AI-generated content. Use AI as a starting point, then add your unique
                    expertise, industry knowledge, and personal touch to make the proposal truly yours.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">Ready to Create Your Audit Proposal?</h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Use LightNote AI to generate professional audit proposals in minutes, not hours. Start with our AI-powered
              tools today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="rounded-full bg-white text-gray-900 hover:bg-white/90" asChild>
                <Link href="/dashboard/generate">
                  Generate Proposal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-gray-700 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/dashboard/upload">Audit Existing Proposal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-medium text-gray-900 mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Writing Winning Service Proposals", href: "/docs/guides/service-proposal", category: "Guide" },
              { title: "Understanding AI Scoring", href: "/docs/features/ai-scoring", category: "Features" },
              { title: "Client Management Best Practices", href: "/docs/guides/client-management", category: "Guide" },
            ].map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="group rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <p className="text-xs text-gray-500 mb-2">{article.category}</p>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                  {article.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-sm text-gray-500 mt-3 group-hover:text-gray-900 transition-colors">
                  Read more
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
