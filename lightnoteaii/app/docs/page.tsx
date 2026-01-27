import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Book, Zap, HelpCircle, MessageSquare, FileText, Settings, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"

const docCategories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Learn the basics of LightNote AI and create your first winning proposal in minutes.",
    href: "/docs/getting-started",
    articles: ["Quick Start Guide", "Account Setup", "Your First Proposal", "Platform Overview"],
  },
  {
    icon: FileText,
    title: "Guides",
    description: "In-depth tutorials on writing compelling proposals that win clients.",
    href: "/docs/guides",
    articles: ["How to Write an Audit Proposal", "Service Proposal Tips", "Pricing Strategies", "Client Communication"],
  },
  {
    icon: FileText,
    title: "Features Overview",
    description: "Explore all the powerful features that help you craft compelling proposals.",
    href: "/docs/features",
    articles: ["AI Writing Assistant", "Template Library", "Client Management", "Analytics Dashboard"],
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Customize LightNote AI to match your workflow and brand identity.",
    href: "/docs/configuration",
    articles: ["Workspace Settings", "Brand Customization", "Team Permissions", "Integrations"],
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Find solutions to common issues and get back to winning projects.",
    href: "/docs/troubleshooting",
    articles: ["Common Issues", "Error Messages", "Performance Tips", "Browser Support"],
  },
  {
    icon: MessageSquare,
    title: "FAQs",
    description: "Quick answers to the most frequently asked questions about LightNote AI.",
    href: "/docs/faq",
    articles: ["Billing & Plans", "Data Privacy", "AI Accuracy", "Export Options"],
  },
  {
    icon: Book,
    title: "API Reference",
    description: "Technical documentation for developers integrating with LightNote AI.",
    href: "/docs/api",
    articles: ["Authentication", "Endpoints", "Webhooks", "Rate Limits"],
  },
]

const popularArticles = [
  { title: "How to Write a Compelling Audit Proposal", href: "/docs/guides/audit-proposal", category: "Guide" },
  { title: "How to write a winning proposal", href: "/docs/guides/winning-proposal", category: "Guide" },
  { title: "Setting up your first template", href: "/docs/guides/first-template", category: "Getting Started" },
  { title: "Understanding AI suggestions", href: "/docs/features/ai-suggestions", category: "Features" },
  { title: "Managing multiple clients", href: "/docs/features/client-management", category: "Features" },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm mb-6">
            <Book className="h-4 w-4" />
            <span>Documentation</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
            <span className="text-[#0f0f0f]">How can we</span> <span className="text-[#9ca3af]">help you?</span>
          </h1>

          <p className="text-lg text-[#6b7280] mb-8 max-w-2xl mx-auto">
            Everything you need to know about LightNote AI. Find guides, tutorials, and answers to help you create
            winning proposals.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9ca3af]" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0f0f0f]/10 focus:border-[#0f0f0f]"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {docCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f9fafb] mb-4">
                  <category.icon className="h-5 w-5 text-[#0f0f0f]" />
                </div>

                <h3 className="text-lg font-medium text-[#0f0f0f] mb-2 group-hover:text-[#0f0f0f]">{category.title}</h3>

                <p className="text-sm text-[#6b7280] mb-4 leading-relaxed">{category.description}</p>

                <ul className="space-y-2">
                  {category.articles.map((article) => (
                    <li key={article} className="flex items-center gap-2 text-sm text-[#9ca3af]">
                      <div className="h-1 w-1 rounded-full bg-[#d1d5db]" />
                      {article}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1 text-sm font-medium text-[#0f0f0f] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 px-4 bg-[#f9fafb]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-medium text-[#0f0f0f] mb-8 text-center">Popular Articles</h2>

          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {popularArticles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="flex items-center justify-between p-4 hover:bg-[#f9fafb] transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f4f6]">
                    <FileText className="h-4 w-4 text-[#6b7280]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0f0f0f]">{article.title}</p>
                    <p className="text-xs text-[#9ca3af]">{article.category}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-[#9ca3af]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Video Tutorials */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f0f0f] mb-4">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#0f0f0f] mb-2">Video Tutorials</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                Watch step-by-step video guides to master LightNote AI quickly.
              </p>
              <Button variant="outline" className="rounded-full bg-transparent" asChild>
                <Link href="/docs/videos">Watch Videos</Link>
              </Button>
            </div>

            {/* Contact Support */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3f4f6] mb-4">
                <MessageSquare className="h-6 w-6 text-[#0f0f0f]" />
              </div>
              <h3 className="text-lg font-medium text-[#0f0f0f] mb-2">Contact Support</h3>
              <p className="text-sm text-[#6b7280] mb-4">
                {"Can't find what you're looking for? Our team is here to help."}
              </p>
              <Button className="rounded-full bg-[#0f0f0f]" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-[#0f0f0f] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">Ready to create winning proposals?</h2>
            <p className="text-[#9ca3af] mb-6 max-w-lg mx-auto">
              Join thousands of freelancers and agencies using LightNote AI to win more clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="rounded-full bg-white text-[#0f0f0f] hover:bg-white/90" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-[#333] text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
