import type { TemplateProps } from "./types"

type PagedTemplateProps = TemplateProps & {
  currentPage?: number
  totalPages?: number
}

export function PagedTemplate({
  safeInfo,
  safeBranding,
  sections,
  currentDate,
  currentPage = 1,
  totalPages = 2,
}: PagedTemplateProps) {
  const summary = sections?.["EXECUTIVE SUMMARY"] || sections?.SUMMARY || safeInfo.summary || ""
  const problem = sections?.["PROBLEM STATEMENT"] || safeInfo.problem || ""
  const solution = sections?.["PROPOSED SOLUTION"] || sections?.SOLUTION || safeInfo.solution || ""
  const deliverables =
    sections?.DELIVERABLES ||
    (Array.isArray(safeInfo.deliverables) ? safeInfo.deliverables.join("\n• ") : safeInfo.deliverables) ||
    ""
  const timeline = sections?.TIMELINE || safeInfo.timeline || ""
  const investment = sections?.INVESTMENT || safeInfo.budget || ""
  const whyUs = sections?.["WHY CHOOSE US"] || sections?.WHY_US || ""
  const nextSteps = sections?.["NEXT STEPS"] || ""

  const pageLayouts =
    totalPages <= 2
      ? [
          ["summary"],
          ["problem", "solution", "deliverables", "timeline", "investment", "whyUs", "nextSteps"],
        ]
      : totalPages === 3
        ? [["summary"], ["problem", "solution"], ["deliverables", "timeline", "investment", "whyUs", "nextSteps"]]
        : [
            ["summary"],
            ["problem", "solution"],
            ["deliverables", "timeline", "investment"],
            ["whyUs", "nextSteps"],
          ]

  const sectionsByKey: Record<string, { title: string; content: string }> = {
    summary: { title: "Executive Summary", content: summary },
    problem: { title: "Problem Statement", content: problem },
    solution: { title: "Proposed Solution", content: solution },
    deliverables: { title: "Deliverables", content: deliverables },
    timeline: { title: "Project Timeline", content: timeline },
    investment: { title: "Investment", content: investment },
    whyUs: { title: "Why Choose Us", content: whyUs },
    nextSteps: { title: "Next Steps", content: nextSteps },
  }

  const contentKeys = pageLayouts[Math.min(currentPage, pageLayouts.length) - 1] || pageLayouts[0]

  return (
    <div
      style={{
        fontFamily: safeBranding.fontFamily || "Arial, sans-serif",
        width: "100%",
        minHeight: "1100px",
        backgroundColor: "#ffffff",
        padding: "56px 56px 48px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280" }}>
            {currentDate}
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, marginTop: "12px", color: "#0f172a" }}>
            {safeInfo.proposalType || "Proposal"}
          </div>
          <div style={{ fontSize: "14px", color: "#475569", marginTop: "6px" }}>
            Prepared for {safeInfo.clientCompany || safeInfo.clientName || "Client"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>Prepared by</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
            {safeInfo.preparedBy || safeBranding.companyName || "Your Company"}
          </div>
          {safeInfo.preparedByEmail && (
            <div style={{ fontSize: "12px", color: "#64748b" }}>{safeInfo.preparedByEmail}</div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "18px", flex: 1 }}>
        {contentKeys.map((key) => {
          const section = sectionsByKey[key]
          if (!section || !section.content) return null
          return (
            <div key={key}>
              <div
                style={{
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#64748b",
                  marginBottom: "8px",
                }}
              >
                {section.title}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  lineHeight: "1.6",
                  color: "#0f172a",
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
        <span>{safeBranding.companyName}</span>
        <span>
          Page {currentPage} of {pageLayouts.length}
        </span>
      </div>
    </div>
  )
}
