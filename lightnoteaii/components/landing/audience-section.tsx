export function AudienceSection() {
  const audiences = [
    {
      title: "Independent Consultants",
      subtitle: "Win more high-value engagements",
      description:
        "Proposal intelligence that helps solo practitioners compete with larger firms. Gain decision confidence before every submission and focus your energy on opportunities with the highest win-rate potential.",
    },
    {
      title: "Agency Teams",
      subtitle: "Scale proposal quality across accounts",
      description:
        "Streamline collaboration across creative, strategy, and account teams. LightNote AI integrates into your existing workflow to ensure every proposal meets the standard that wins—without bottlenecks or rework.",
    },
    {
      title: "Sales & Partnerships",
      subtitle: "Close deals with data-driven clarity",
      description:
        "Equip your team with measurable proposal insights that drive accountability. Track win-rate improvements, identify what resonates with buyers, and make every proposal a strategic asset.",
    },
  ]

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Ambient Glow Effects */}

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#111] mb-4">
          Built for teams that win work through proposals
        </h2>
        <p className="text-center text-[#6b7280] text-lg mb-16 max-w-2xl mx-auto">
          Whether you're a solo consultant or a global team, LightNote AI delivers the proposal intelligence you need to
          improve win-rate and decision confidence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="border border-[#e5e5e5] rounded-xl p-8 bg-white/80 backdrop-blur-sm flex flex-col hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-[#111] mb-1">{audience.title}</h3>
              <p className="text-sm font-medium text-[#9ca3af] mb-4">{audience.subtitle}</p>
              <p className="text-[#6b7280] text-base leading-relaxed">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
