"use client"
import { Timeline } from "@/components/ui/timeline"

export function EvolutionTimelineSection() {
  const data = [
    {
      title: "2010",
      content: (
        <div className="max-w-lg">
          <h4 className="text-lg font-medium text-neutral-900 mb-3">The document era</h4>
          <p className="text-neutral-600 text-sm leading-relaxed mb-4">
            Proposals lived in Word files. Teams copied and pasted from previous versions, updated dates by hand, and
            hoped nothing got missed. Every proposal felt like starting from scratch.
          </p>
          <p className="text-neutral-500 text-sm">Hours spent formatting. Days waiting for feedback.</p>
        </div>
      ),
    },
    {
      title: "2015",
      content: (
        <div className="max-w-lg">
          <h4 className="text-lg font-medium text-neutral-900 mb-3">Templates helped, a little</h4>
          <p className="text-neutral-600 text-sm leading-relaxed mb-4">
            Cloud tools made collaboration easier. Teams built template libraries and connected their CRMs. The busywork
            shrank, but proposals still needed heavy editing. Every client was different.
          </p>
          <p className="text-neutral-500 text-sm">Better, but the real work remained manual.</p>
        </div>
      ),
    },
    {
      title: "2020",
      content: (
        <div className="max-w-lg">
          <h4 className="text-lg font-medium text-neutral-900 mb-3">AI entered the conversation</h4>
          <p className="text-neutral-600 text-sm leading-relaxed mb-4">
            Language models could draft sections. Suggest improvements. Catch awkward phrasing. The writing got faster,
            but the tools felt scattered. AI here, editing there, formatting somewhere else.
          </p>
          <p className="text-neutral-500 text-sm">Promising, but fragmented.</p>
        </div>
      ),
    },
    {
      title: "2026",
      content: (
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-lg font-medium text-neutral-900">Everything in one place</h4>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Now</span>
          </div>
          <p className="text-neutral-600 text-sm leading-relaxed mb-4">
            Intelligent drafting. A real editor. Templates that adapt. History that remembers. One workflow from blank
            page to sent proposal. The AI understands context. You stay in control.
          </p>
          <p className="text-neutral-900 text-sm font-medium">Write proposals in minutes, not days.</p>
        </div>
      ),
    },
  ]

  return (
    <section className="py-24 md:py-32 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10 mb-16">
        <h2 className="text-2xl md:text-3xl font-medium text-neutral-900 max-w-xl">How we got here</h2>
        <p className="text-neutral-500 text-base max-w-lg mt-3">
          Proposal writing has changed. Here's the short version.
        </p>
      </div>
      <Timeline data={data} />
    </section>
  )
}
