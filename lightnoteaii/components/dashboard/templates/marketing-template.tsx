"use client"

import type { TemplateProps } from "./types"

export function MarketingTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const coral = "#ff6b6b"
  const navy = "#2d3748"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "white",
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Header */}
      <div style={{ padding: `${40 * fs}px ${48 * fs}px ${32 * fs}px` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px`, marginBottom: `${24 * fs}px` }}>
              {safeInfo.logo ? (
                <img src={safeInfo.logo || "/placeholder.svg"} alt="Logo" style={{ height: `${24 * fs}px` }} />
              ) : (
                <div
                  style={{
                    width: `${28 * fs}px`,
                    height: `${28 * fs}px`,
                    borderRadius: `${6 * fs}px`,
                    backgroundColor: coral,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontWeight: "700", fontSize: `${14 * fs}px` }}>
                    {safeBranding.companyName.charAt(0)}
                  </span>
                </div>
              )}
              <span style={{ fontWeight: "600", color: navy, fontSize: `${14 * fs}px` }}>
                {safeBranding.companyName}
              </span>
            </div>
            <h1
              style={{
                fontSize: `${44 * fs}px`,
                fontWeight: "800",
                color: navy,
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Marketing &<br />
              Growth Strategy
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: `${11 * fs}px`, color: "#718096", marginBottom: `${4 * fs}px` }}>{currentDate}</p>
            <p style={{ fontSize: `${12 * fs}px`, color: navy, fontWeight: "500" }}>
              Prepared for {safeInfo.clientCompany}
            </p>
          </div>
        </div>
      </div>

      {/* Coral Accent Bar */}
      <div style={{ height: `${4 * fs}px`, background: `linear-gradient(90deg, ${coral} 0%, #f687b3 100%)` }} />

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${36 * fs}px ${48 * fs}px` }}>
        {/* Summary */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <p style={{ fontSize: `${15 * fs}px`, color: "#4a5568", lineHeight: 1.8, maxWidth: "90%" }}>
            {sections?.SUMMARY ||
              "This comprehensive marketing strategy is designed to elevate your brand presence, drive qualified leads, and accelerate revenue growth through data-driven campaigns and creative excellence."}
          </p>
        </div>

        {/* Metrics Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: `${16 * fs}px`,
            marginBottom: `${36 * fs}px`,
          }}
        >
          {[
            { label: "Target Growth", value: "3x" },
            { label: "Timeline", value: safeInfo.timeline || "6 mo" },
            { label: "Channels", value: "8+" },
            { label: "Investment", value: safeInfo.budget || "$50k" },
          ].map((metric, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#f7fafc",
                borderRadius: `${8 * fs}px`,
                padding: `${16 * fs}px`,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: `${22 * fs}px`, fontWeight: "700", color: coral, marginBottom: `${4 * fs}px` }}>
                {metric.value}
              </p>
              <p
                style={{
                  fontSize: `${10 * fs}px`,
                  color: "#718096",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${32 * fs}px` }}>
          {/* Left Column */}
          <div>
            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "700",
                color: coral,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${14 * fs}px`,
              }}
            >
              Current Challenges
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#4a5568", lineHeight: 1.8, marginBottom: `${24 * fs}px` }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Limited brand awareness, inconsistent messaging across channels, and difficulty tracking marketing ROI are preventing optimal growth."}
            </p>

            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "700",
                color: coral,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${14 * fs}px`,
              }}
            >
              Strategic Approach
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#4a5568", lineHeight: 1.8 }}>
              {sections?.SOLUTION ||
                "We'll implement a multi-channel marketing strategy combining content marketing, paid acquisition, email nurturing, and conversion rate optimization to drive sustainable growth."}
            </p>
          </div>

          {/* Right Column - Deliverables */}
          <div>
            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "700",
                color: coral,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${14 * fs}px`,
              }}
            >
              Key Deliverables
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: `${10 * fs}px` }}>
              {[
                "Brand Strategy & Positioning",
                "Content Marketing Plan",
                "Paid Media Campaigns",
                "Email Marketing Automation",
                "Analytics Dashboard",
                "Monthly Performance Reports",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: `${10 * fs}px` }}>
                  <div
                    style={{
                      width: `${18 * fs}px`,
                      height: `${18 * fs}px`,
                      borderRadius: "50%",
                      backgroundColor: coral,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: "white", fontSize: `${10 * fs}px` }}>✓</span>
                  </div>
                  <span style={{ fontSize: `${12 * fs}px`, color: "#4a5568" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: navy,
          padding: `${24 * fs}px ${48 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ color: "white", fontSize: `${13 * fs}px`, fontWeight: "600", marginBottom: `${4 * fs}px` }}>
            Ready to grow?
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: `${11 * fs}px` }}>
            Contact us at {safeInfo.clientEmail || "hello@agency.com"}
          </p>
        </div>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: `${11 * fs}px` }}>
          {safeBranding.companyName} © {new Date().getFullYear()}
        </span>
      </div>
    </div>
  )
}
