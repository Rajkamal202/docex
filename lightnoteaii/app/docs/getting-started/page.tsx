import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up for LightNote AI using your email or connect with Google. Your first 14 days are free with full access to all features.",
    time: "2 min",
  },
  {
    number: "02",
    title: "Set up your workspace",
    description:
      "Add your business details, upload your logo, and customize your proposal templates to match your brand identity.",
    time: "5 min",
  },
  {
    number: "03",
    title: "Add your first client",
    description:
      "Import client information manually or connect your CRM. LightNote AI will use this data to personalize proposals.",
    time: "3 min",
  },
  {
    number: "04",
    title: "Create your first proposal",
    description:
      "Use our AI-powered editor to craft a compelling proposal. Simply describe the project and let AI do the heavy lifting.",
    time: "10 min",
  },
]

const features = [
  "AI-powered writing suggestions",
  "Professional template library",
  "Real-time collaboration",
  "Client engagement tracking",
  "One-click PDF export",
  "Unlimited proposals",
]

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#0f0f0f] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documentation
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-medium text-[#0f0f0f] mb-4">
              <Zap className="h-3.5 w-3.5" />
              Getting Started
            </div>
            <h1 className="text-3xl md:text-4xl font-medium text-[#0f0f0f] mb-4">Quick Start Guide</h1>
            <p className="text-lg text-[#6b7280] max-w-2xl">
              Get up and running with LightNote AI in under 20 minutes. Follow these simple steps to create your first
              winning proposal.
            </p>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center gap-2 p-4 rounded-xl bg-[#f9fafb] border border-gray-100 mb-12">
            <Clock className="h-5 w-5 text-[#6b7280]" />
            <span className="text-sm text-[#6b7280]">Estimated time: </span>
            <span className="text-sm font-medium text-[#0f0f0f]">20 minutes</span>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative pl-16 pb-8 border-l-2 border-gray-100 last:border-l-0 last:pb-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0f0f0f] text-white text-xs font-medium">
                  {step.number}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#0f0f0f] mb-2">{step.title}</h3>
                    <p className="text-[#6b7280] leading-relaxed">{step.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#9ca3af] bg-[#f3f4f6] px-2 py-1 rounded-full">
                    {step.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="rounded-2xl bg-[#f9fafb] p-8 mb-12">
            <h2 className="text-xl font-medium text-[#0f0f0f] mb-6">{"What's included in your free trial"}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm text-[#0f0f0f]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-100">
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#0f0f0f] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Documentation
            </Link>
            <Link
              href="/docs/features"
              className="flex items-center gap-2 text-sm font-medium text-[#0f0f0f] hover:text-[#6b7280] transition-colors"
            >
              Features Overview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#f9fafb]">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-medium text-[#0f0f0f] mb-4">Ready to get started?</h2>
          <p className="text-[#6b7280] mb-6">Create your free account and start winning more clients today.</p>
          <Button className="rounded-full bg-[#0f0f0f]" asChild>
            <Link href="/signup">Start Free Trial</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
