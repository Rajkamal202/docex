"use client"

export function FeaturedQuoteSection() {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <blockquote className="text-[24px] md:text-[32px] font-medium tracking-tight leading-[1.3] text-[#0f0f0f] mb-8">
            "Metrics like proposal quality, win-rate, and decision confidence are hard to track - which is why LightNote
            AI is so powerful: it shows how clients are evaluating your proposals."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-[#6b7280]">LR</span>
            </div>
            <div className="text-left">
              <div className="font-medium text-[#0f0f0f]">Lily Ray</div>
              <div className="text-sm text-[#6b7280]">VP Proposal Strategy, Amsive</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
