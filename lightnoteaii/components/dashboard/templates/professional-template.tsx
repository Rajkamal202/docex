"use client"

import type { TemplateProps } from "./types"

const cleanBracketPlaceholders = (text: string): string => {
  if (!text) return text
  return text
    .replace(/\[(\d+)\]/g, "$1")
    .replace(/\[X\]/gi, "3-4")
    .replace(/\[\s*\]/g, "")
    .replace(/\[specific outcome\]/gi, "measurable growth")
    .replace(/\[timeframe\]/gi, "90 days")
    .replace(/\[opportunity cost\]/gi, "significant revenue")
}

export function ProfessionalTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
  aiProposal,
}: TemplateProps & { aiProposal?: any }) {
  const fs = isFullPreview ? 0.85 : 0.75

  const companyLogo = safeInfo?.logo
  const hasCompanyName =
    safeBranding?.companyName &&
    safeBranding.companyName.trim() !== "" &&
    safeBranding.companyName.toLowerCase() !== "your company"
  const hasPreparedBy =
    safeInfo?.preparedBy && safeInfo.preparedBy.trim() !== "" && safeInfo.preparedBy.toLowerCase() !== "your name"
  const hasClientName =
    (safeInfo?.clientName && safeInfo.clientName.trim() !== "" && safeInfo.clientName.toLowerCase() !== "client") ||
    (safeInfo?.clientCompany && safeInfo.clientCompany.trim() !== "")

  const companyInitial = hasCompanyName
    ? safeBranding.companyName.charAt(0).toUpperCase()
    : hasPreparedBy
      ? safeInfo.preparedBy.charAt(0).toUpperCase()
      : ""
  const companyDisplayName = hasCompanyName ? safeBranding.companyName : ""
  const preparedByName = hasPreparedBy ? safeInfo.preparedBy : safeBranding?.preparedBy || ""
  const preparedByEmail = safeInfo?.preparedByEmail || safeBranding?.email || ""
  const preparedByWebsite = safeBranding?.website || ""
  const preparedByPhone = safeBranding?.phone || ""

  const clientDisplayName = hasClientName ? safeInfo.clientName : safeInfo.clientCompany || ""
  const clientCompanyName = safeInfo.clientCompany || ""
  const clientEmail = safeInfo?.clientEmail || ""

  const summaryText =
    aiProposal?.summary ||
    sections?.summary ||
    sections?.SUMMARY ||
    sections?.executive_summary ||
    safeInfo?.summary ||
    ""

  const problemText =
    aiProposal?.problemStatement ||
    sections?.problem ||
    sections?.["PROBLEM STATEMENT"] ||
    sections?.problemStatement ||
    safeInfo?.problem ||
    ""

  const solutionText =
    aiProposal?.solution ||
    sections?.solution ||
    sections?.SOLUTION ||
    sections?.["PROPOSED SOLUTION"] ||
    safeInfo?.solution ||
    ""

  const investmentText =
    aiProposal?.investment ||
    sections?.investment ||
    sections?.INVESTMENT ||
    safeInfo?.investment ||
    safeInfo?.budget ||
    ""

  const deliverablesData =
    aiProposal?.deliverables || sections?.deliverables || sections?.DELIVERABLES || safeInfo?.deliverables || []

  const timelineText = aiProposal?.timeline || sections?.timeline || sections?.TIMELINE || safeInfo?.timeline || ""

  const whyUsText = aiProposal?.whyUs || sections?.whyUs || sections?.["WHY CHOOSE US"] || safeInfo?.whyUs || ""

  const nextStepsData =
    aiProposal?.nextSteps || sections?.nextSteps || sections?.["NEXT STEPS"] || safeInfo?.nextSteps || []

  const renderParagraphs = (text: string) => {
    if (!text) return null

    const cleanedText = cleanBracketPlaceholders(text)

    // Split by double newlines first, then single newlines
    const paragraphs = cleanedText.split(/\n\n+/).filter((p) => p.trim())

    return paragraphs.map((p, i) => {
      // Check if this paragraph has a header (starts with **)
      const headerMatch = p.match(/^\*\*(.+?)\*\*(.*)$/s)

      if (headerMatch) {
        const [, header, content] = headerMatch
        return (
          <div key={i} style={{ marginBottom: `${14 * fs}px` }}>
            <h3
              style={{
                fontSize: `${13 * fs}px`,
                fontWeight: "600",
                color: "#1a1a1a",
                margin: 0,
                marginBottom: `${6 * fs}px`,
              }}
            >
              {header}
            </h3>
            {content.trim() && (
              <p
                style={{
                  fontSize: `${11 * fs}px`,
                  color: "#444",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {content.trim()}
              </p>
            )}
          </div>
        )
      }

      // Check for bullet points within paragraph
      if (p.includes("\n- ") || p.startsWith("- ")) {
        const lines = p.split("\n").filter((l) => l.trim())
        const bullets = lines.filter((l) => l.trim().startsWith("-"))
        const nonBullets = lines.filter((l) => !l.trim().startsWith("-"))

        return (
          <div key={i} style={{ marginBottom: `${12 * fs}px` }}>
            {nonBullets.length > 0 && (
              <p
                style={{
                  fontSize: `${11 * fs}px`,
                  color: "#444",
                  lineHeight: 1.6,
                  margin: 0,
                  marginBottom: `${6 * fs}px`,
                }}
              >
                {nonBullets.join(" ")}
              </p>
            )}
            {bullets.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: `${16 * fs}px` }}>
                {bullets.map((bullet, bi) => (
                  <li
                    key={bi}
                    style={{
                      fontSize: `${11 * fs}px`,
                      color: "#444",
                      lineHeight: 1.6,
                      marginBottom: `${4 * fs}px`,
                    }}
                  >
                    {bullet.replace(/^-\s*/, "")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      }

      return (
        <p
          key={i}
          style={{
            fontSize: `${11 * fs}px`,
            color: "#444",
            lineHeight: 1.6,
            margin: 0,
            marginBottom: `${12 * fs}px`,
          }}
        >
          {p.trim()}
        </p>
      )
    })
  }

  const renderBulletList = (items: string[] | string) => {
    const itemArray = Array.isArray(items)
      ? items
      : typeof items === "string"
        ? items.split("\n").filter((i) => i.trim())
        : []

    if (itemArray.length === 0) return null

    return (
      <ul
        style={{
          margin: 0,
          paddingLeft: `${18 * fs}px`,
          marginTop: `${8 * fs}px`,
        }}
      >
        {itemArray.map((item, i) => (
          <li
            key={i}
            style={{
              fontSize: `${11 * fs}px`,
              color: "#444",
              lineHeight: 1.6,
              marginBottom: `${6 * fs}px`,
              paddingLeft: `${3 * fs}px`,
            }}
          >
            {typeof item === "string"
              ? item
                  .replace(/^[-•*]\s*/, "")
                  .replace(/^"\s*/, "")
                  .replace(/\s*"$/, "")
              : item}
          </li>
        ))}
      </ul>
    )
  }

  const renderTable = (text: string) => {
    if (!text.includes("|")) return renderParagraphs(text)

    const lines = text.split("\n").filter((l) => l.trim())
    const tableStart = lines.findIndex((l) => l.includes("|"))

    if (tableStart === -1) return renderParagraphs(text)

    const preTableText = lines.slice(0, tableStart).join("\n")
    const tableLines = lines.slice(tableStart).filter((l) => l.includes("|") && !l.match(/^\|[-:\s|]+\|$/))
    const postTableText = lines.slice(tableStart + tableLines.length + 1).join("\n")

    // Parse table
    const rows = tableLines.map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell),
    )

    const headerRow = rows[0]
    const dataRows = rows.slice(1)

    return (
      <div>
        {preTableText && renderParagraphs(preTableText)}
        {headerRow && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: `${12 * fs}px`,
              marginBottom: `${16 * fs}px`,
              fontSize: `${13 * fs}px`,
            }}
          >
            <thead>
              <tr>
                {headerRow.map((cell, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: `${10 * fs}px ${12 * fs}px`,
                      backgroundColor: "#f8f8f8",
                      borderBottom: "2px solid #e0e0e0",
                      fontWeight: "600",
                      color: "#1a1a1a",
                    }}
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        padding: `${10 * fs}px ${12 * fs}px`,
                        borderBottom: "1px solid #e8e8e8",
                        color: "#444",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {postTableText && renderParagraphs(postTableText)}
      </div>
    )
  }

  return (
    <div
      style={{
        width: isFullPreview ? "850px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "white",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Black Header Bar */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: `${28 * fs}px ${48 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px` }}>
          {companyLogo ? (
            <img src={companyLogo || "/placeholder.svg"} alt="Logo" style={{ height: `${40 * fs}px`, width: "auto" }} />
          ) : (
            <>
              {companyInitial && (
                <div
                  style={{
                    width: `${36 * fs}px`,
                    height: `${36 * fs}px`,
                    borderRadius: "50%",
                    border: "2px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontSize: `${18 * fs}px`, fontWeight: "bold" }}>{companyInitial}</span>
                </div>
              )}
              {companyDisplayName && (
                <span
                  style={{
                    color: "white",
                    fontSize: `${18 * fs}px`,
                    fontWeight: "600",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  {companyDisplayName.toUpperCase()}
                </span>
              )}
            </>
          )}
        </div>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: `${14 * fs}px` }}>{currentDate}</span>
      </div>

      {/* Main Content - Generous padding and spacing */}
      <div style={{ flex: 1, padding: `${56 * fs}px ${52 * fs}px` }}>
        {/* Title Section */}
        <div style={{ marginBottom: `${48 * fs}px` }}>
          <h1
            style={{
              fontSize: `${44 * fs}px`,
              fontWeight: "800",
              color: "#1a1a1a",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            {safeInfo.proposalType || "Business Proposal"}
          </h1>
          {clientDisplayName && (
            <p
              style={{
                fontSize: `${17 * fs}px`,
                color: "#666",
                marginTop: `${14 * fs}px`,
                marginBottom: 0,
              }}
            >
              Prepared for {clientDisplayName}
              {clientCompanyName && clientCompanyName !== clientDisplayName && ` at ${clientCompanyName}`}
            </p>
          )}
        </div>

        {/* Two Column Layout for Contact Info */}
        <div
          style={{
            display: "flex",
            gap: `${40 * fs}px`,
            marginBottom: `${40 * fs}px`,
            paddingBottom: `${32 * fs}px`,
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          {/* Prepared For */}
          {clientDisplayName && (
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#888",
                  marginBottom: `${10 * fs}px`,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: "500",
                }}
              >
                Prepared for
              </p>
              <p style={{ fontSize: `${17 * fs}px`, fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                {clientDisplayName}
              </p>
              {clientCompanyName && clientCompanyName !== clientDisplayName && (
                <p style={{ fontSize: `${15 * fs}px`, color: "#555", margin: 0, marginTop: `${6 * fs}px` }}>
                  {clientCompanyName}
                </p>
              )}
              {clientEmail && (
                <p style={{ fontSize: `${14 * fs}px`, color: "#666", margin: 0, marginTop: `${10 * fs}px` }}>
                  {clientEmail}
                </p>
              )}
            </div>
          )}

          {/* Prepared By */}
          {preparedByName && (
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#888",
                  marginBottom: `${10 * fs}px`,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  fontWeight: "500",
                }}
              >
                Prepared by
              </p>
              <p style={{ fontSize: `${17 * fs}px`, fontWeight: "600", color: "#1a1a1a", margin: 0 }}>
                {preparedByName}
              </p>
              {companyDisplayName && (
                <p style={{ fontSize: `${15 * fs}px`, color: "#555", margin: 0, marginTop: `${6 * fs}px` }}>
                  {companyDisplayName}
                </p>
              )}
              {preparedByEmail && (
                <p style={{ fontSize: `${14 * fs}px`, color: "#666", margin: 0, marginTop: `${10 * fs}px` }}>
                  {preparedByEmail}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Content Sections - Generous spacing between sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: `${44 * fs}px` }}>
          {/* EXECUTIVE SUMMARY */}
          {summaryText && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Executive Summary
              </h2>
              {renderParagraphs(summaryText)}
            </section>
          )}

          {/* THE CHALLENGE */}
          {problemText && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                The Challenge
              </h2>
              {renderParagraphs(problemText)}
            </section>
          )}

          {/* OUR SOLUTION */}
          {solutionText && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Our Solution
              </h2>
              {renderParagraphs(solutionText)}
            </section>
          )}

          {/* DELIVERABLES */}
          {(Array.isArray(deliverablesData) ? deliverablesData.length > 0 : deliverablesData) && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                What You'll Receive
              </h2>
              {renderBulletList(deliverablesData)}
            </section>
          )}

          {/* TIMELINE */}
          {timelineText && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Project Timeline
              </h2>
              {renderTable(timelineText)}
            </section>
          )}

          {/* INVESTMENT */}
          {investmentText && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Investment
              </h2>
              {renderParagraphs(investmentText)}
            </section>
          )}

          {/* WHY US */}
          {whyUsText && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Why Work With Us
              </h2>
              {renderParagraphs(whyUsText)}
            </section>
          )}

          {/* NEXT STEPS */}
          {(Array.isArray(nextStepsData) ? nextStepsData.length > 0 : nextStepsData) && (
            <section>
              <h2
                style={{
                  fontSize: `${19 * fs}px`,
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: `${18 * fs}px`,
                  paddingBottom: `${10 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Next Steps
              </h2>
              {renderBulletList(nextStepsData)}
            </section>
          )}
        </div>
      </div>

      {/* Black Footer Bar */}
      <div style={{ backgroundColor: "#1a1a1a", height: `${32 * fs}px`, marginTop: "auto" }} />
    </div>
  )
}
