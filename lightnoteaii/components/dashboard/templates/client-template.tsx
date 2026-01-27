import type { TemplateProps } from "./types"

export function ClientTemplate({
  safeInfo,
  safeBranding,
  sections,
  currentDate,
  currentPage = 1,
}: TemplateProps & { currentPage?: number }) {
  const info = {
    clientName: safeInfo?.clientName || "[Client Name]",
    companyName: safeInfo?.clientCompany || "[Company Name]",
    email: safeInfo?.clientEmail || "[email]",
    industry: safeInfo?.industry || "[Industry]",
    problem:
      safeInfo?.problem ||
      "This proposal outlines a streamlined solution designed to address key business challenges and drive growth.",
    solution: sections?.SOLUTION || "Our solution is designed to improve overall performance.",
    deliverables: safeInfo?.deliverables || "Deliverables to be determined",
    timeline: safeInfo?.timeline || "To be determined",
    budget: safeInfo?.budget || "To be discussed",
  }

  const branding = {
    companyName: safeBranding?.companyName || "Your Company",
    website: "www.company.com",
    email: "contact@company.com",
  }

  const content = {
    summary: sections?.SUMMARY || info.problem,
    problemStatement:
      sections?.["PROBLEM STATEMENT"] ||
      "Businesses today face challenges such as inefficiencies, rising costs, and evolving market demands. Addressing these issues requires a well-structured approach.",
    solution: sections?.SOLUTION || info.solution,
    marketOpportunity:
      sections?.["MARKET OPPORTUNITY"] ||
      "With industry trends shifting, adopting a forward-thinking model is essential. Our approach provides businesses with scalable solutions that align with market demands.",
    financialSummary:
      sections?.["FINANCIAL SUMMARY"] ||
      "Our strategies see an average 20% reduction in operational costs and a 35% improvement in workflow efficiency. Clients can expect a strong return on investment.",
  }

  const formatDate = () => {
    return currentDate || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  // Page 1: Cover
  if (currentPage === 1) {
    return (
      <div
        style={{
          fontFamily: "'Arial', sans-serif",
          width: "100%",
          minHeight: "800px",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "60px 50px",
          boxSizing: "border-box",
        }}
      >
        {/* Date */}
        <div
          style={{
            fontSize: "14px",
            color: "#666666",
            marginBottom: "80px",
          }}
        >
          {formatDate()}
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: "#000000",
              lineHeight: "1.1",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "-2px",
            }}
          >
            CLIENT
            <br />
            PROPOSAL
          </h1>
        </div>

        {/* Footer with contact info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            paddingTop: "40px",
            borderTop: "1px solid #e5e5e5",
          }}
        >
          {/* Prepared for */}
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#888888",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Prepared for:
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#000000",
                marginBottom: "4px",
              }}
            >
              {info.clientName}
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#000000",
                marginBottom: "8px",
              }}
            >
              {info.companyName}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666666",
                lineHeight: "1.6",
              }}
            >
              {info.email}
            </div>
          </div>

          {/* Prepared by */}
          <div>
            <div
              style={{
                fontSize: "11px",
                color: "#888888",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Prepared by:
            </div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#000000",
                marginBottom: "4px",
              }}
            >
              {branding.companyName}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666666",
                lineHeight: "1.6",
              }}
            >
              {branding.email}
              <br />
              {branding.website}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Page 2: Content with numbered sections
  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        width: "100%",
        minHeight: "800px",
        backgroundColor: "#ffffff",
        padding: "50px",
        boxSizing: "border-box",
      }}
    >
      {/* Section 01 - Summary */}
      <div style={{ marginBottom: "35px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#d4d4d4",
              lineHeight: "1",
              minWidth: "50px",
            }}
          >
            01
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              SUMMARY
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#444444",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {content.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Section 02 - Problem Statement */}
      <div style={{ marginBottom: "35px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#d4d4d4",
              lineHeight: "1",
              minWidth: "50px",
            }}
          >
            02
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              PROBLEM STATEMENT
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#444444",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {content.problemStatement}
            </p>
          </div>
        </div>
      </div>

      {/* Section 03 - Solution */}
      <div style={{ marginBottom: "35px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#d4d4d4",
              lineHeight: "1",
              minWidth: "50px",
            }}
          >
            03
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              SOLUTION
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#444444",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {content.solution}
            </p>
          </div>
        </div>
      </div>

      {/* Section 04 - Market Opportunity */}
      <div style={{ marginBottom: "35px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#d4d4d4",
              lineHeight: "1",
              minWidth: "50px",
            }}
          >
            04
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              MARKET OPPORTUNITY
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#444444",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {content.marketOpportunity}
            </p>
          </div>
        </div>
      </div>

      {/* Section 05 - Financial Summary */}
      <div style={{ marginBottom: "35px" }}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#d4d4d4",
              lineHeight: "1",
              minWidth: "50px",
            }}
          >
            05
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#000000",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              FINANCIAL SUMMARY
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#444444",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {content.financialSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const clientTemplatePages = 2
