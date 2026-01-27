"use client"

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-transparent relative overflow-hidden">
      {/* Container for Testimonials */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-[36px] md:text-[44px] font-medium tracking-tight leading-[1.1] text-[#0f0f0f]">
            Check what the best
            <br />
            proposal writers say about LightNote AI
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              quote:
                "LightNote AI offers key insights on proposal quality, helping us stay ahead in the age of AI-driven decisions. As clients use AI to evaluate proposals, LightNote measures our competitive edge.",
              name: "Crystal Carter",
              role: "Head of Business Development",
              company: "WIX",
            },
            {
              quote:
                "LightNote avoids the issues we see with other proposal tools, where there's often an overload of features and information that isn't of primary importance. It keeps things simple - see your proposal intelligence, and act on top insights.",
              name: "Ethan Smith",
              role: "CEO",
              company: "GRAPHITE",
            },
            {
              quote:
                "LightNote AI helps us identify what's being cited, adjust our strategy with decision confidence, and stay ahead of a rapidly evolving landscape. For our team, the clarity and simplicity of the platform is invaluable when making strategic decisions.",
              name: "Thomas Smeaton",
              role: "Proposal Manager",
              company: "SQUARESPACE",
            },
            {
              quote:
                "LightNote allows us to pinpoint the exact types of content that win in specific industries. With that visibility, we've been able to prioritize our content strategy and significantly improve our win-rate.",
              name: "Jon Gitlin",
              role: "Strategy Lead",
              company: "MERGE",
            },
            {
              quote:
                "LightNote AI gave us a data-informed view of our proposal strategy with measurable clarity. With its insights, our proposals improved in quality and decision confidence. I am really impressed with the platform, and the exceptional support from the team.",
              name: "Sepy Bazzazi",
              role: "Head of Marketing",
              company: "Glide",
            },
            {
              quote:
                "As proposal writers, our decisions should always be driven by data. LightNote AI provides exactly the proposal intelligence we need to stay competitive in the ever-evolving world of business development.",
              name: "Artur Kosch",
              role: "General Manager",
              company: "KP",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="border border-gray-200 rounded-xl p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300"
            >
              <blockquote className="text-[14px] text-[#6b7280] mb-6 leading-relaxed">{testimonial.quote}</blockquote>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-medium text-[#6b7280]">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-[#0f0f0f]">{testimonial.name}</div>
                    <div className="text-xs text-[#6b7280]">{testimonial.role}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#9ca3af] tracking-wide">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
