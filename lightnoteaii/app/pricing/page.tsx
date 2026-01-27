import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pricing - LightNote AI",
  description: "Simple, transparent pricing. Start free and upgrade as you grow.",
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out LightNote AI",
    features: ["3 proposal audits per month", "Basic feedback report", "Overall score & rating", "Email support"],
    cta: "Get Started",
    href: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professionals who submit proposals regularly",
    features: [
      "Unlimited proposal audits",
      "Detailed analysis reports",
      "Compliance checking",
      "Section-by-section feedback",
      "Improvement suggestions",
      "Priority support",
      "Export to PDF",
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "per month",
    description: "For teams that collaborate on proposals",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Team collaboration tools",
      "Shared proposal library",
      "Custom scoring criteria",
      "Analytics dashboard",
      "Dedicated support",
      "API access",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
]

const faqs = [
  {
    question: "How does the free trial work?",
    answer:
      "You can start with our Free plan immediately, no credit card required. Pro and Team plans come with a 14-day free trial.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What file formats do you support?",
    answer:
      "We support PDF, Word documents (.doc, .docx), and plain text files. Upload any of these formats for instant analysis.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. All proposals are encrypted in transit and at rest. We never use your documents for training our AI models.",
  },
]

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-semibold text-gray-900 md:text-5xl">Simple, transparent pricing</h1>
              <p className="mt-4 text-lg text-gray-400">Start free and upgrade when you need more. No hidden fees.</p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 ${
                    plan.popular ? "border-gray-900 bg-white shadow-lg" : "border-gray-200 bg-white"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-semibold text-gray-900">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                      plan.popular
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "border border-gray-200 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-12 text-center text-3xl font-semibold text-gray-900">Frequently asked questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border border-gray-200 p-5">
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
