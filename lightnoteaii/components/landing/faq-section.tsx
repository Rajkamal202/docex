"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How is this different from ChatGPT or Claude?",
    answer:
      "Generic AI writes text. LightNote AI evaluates proposal quality, identifies risks, and helps improve win-rate.",
  },
  {
    question: "Is this only for freelancers?",
    answer: "No. LightNote AI is built for freelancers, agencies, and teams sending high-value proposals.",
  },
  {
    question: "Do I need past data to use this?",
    answer: "No. You can start with a single proposal and improve from there.",
  },
  {
    question: "Can I try it before paying?",
    answer: "Yes. New users get $20 in free credits to try all features.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-20 bg-transparent relative overflow-hidden">
      {/* Ambient Glow Effects */}

      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-[32px] md:text-[38px] font-medium tracking-tight leading-[1.1] text-[#0f0f0f] mb-3">
            FAQs
          </h2>
          <p className="text-[16px] text-[#6b7280]">Common questions about LightNote AI.</p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {faqs.map((faq, index) => (
              <div key={index} className="py-4">
                <button
                  className="flex w-full items-center justify-between text-left group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-medium text-[#0f0f0f] pr-8 text-[15px] group-hover:text-[#6b7280] transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#9ca3af] transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="mt-3 text-[#6b7280] text-[14px] leading-relaxed pr-8">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
