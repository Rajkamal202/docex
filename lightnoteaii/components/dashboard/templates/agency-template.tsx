"use client"

import type { TemplateProps } from "./types"

export function AgencyTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const accent = "#ec4899"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "#fafafa",
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Hero Header */}
      <div
        style={{
          backgroundColor: "#18181b",
          padding: `${56 * fs}px ${48 * fs}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: `${40 * fs}px`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
            <div
              style={{
                width: `${8 * fs}px`,
                height: `${8 * fs}px`,
                borderRadius: "50%",
                backgroundColor: accent,
              }}
            />
            <span style={{ color: "#ffffff", fontSize: `${13 * fs}px`, fontWeight: "500" }}>
              {safeBranding.companyName}
            </span>
          </div>
          <span style={{ color: "#71717a", fontSize: `${12 * fs}px` }}>{currentDate}</span>
        </div>

        <h1
          style={{
            fontSize: `${52 * fs}px`,
            fontWeight: "700",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: "-2px",
          }}
        >
          Creative
          <br />
          <span style={{ color: accent }}>Partnership</span>
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: `${14 * fs}px`, marginTop: `${20 * fs}px` }}>
          A proposal for {safeInfo.clientCompany}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${40 * fs}px ${48 * fs}px` }}>
        {/* Summary */}
        <div style={{ marginBottom: `${36 * fs}px` }}>
          <p style={{ fontSize: `${15 * fs}px`, color: "#3f3f46", lineHeight: 1.8, maxWidth: "90%" }}>
            {sections?.SUMMARY ||
              "We create bold, memorable brand experiences that connect with your audience and drive real business results. This proposal outlines our vision for elevating your brand to new heights."}
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: `${20 * fs}px`,
            marginBottom: `${36 * fs}px`,
          }}
        >
          {[
            { title: "Brand Strategy", desc: "Positioning & identity" },
            { title: "Visual Design", desc: "Logo, UI/UX, collateral" },
            { title: "Content Creation", desc: "Copy, photo, video" },
          ].map((service, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: `${8 * fs}px`,
                padding: `${20 * fs}px`,
                border: "1px solid #e4e4e7",
              }}
            >
              <h3
                style={{ fontSize: `${13 * fs}px`, fontWeight: "600", color: "#18181b", marginBottom: `${6 * fs}px` }}
              >
                {service.title}
              </h3>
              <p style={{ fontSize: `${11 * fs}px`, color: "#71717a", margin: 0 }}>{service.desc}</p>
            </div>
          ))}
        </div>

        {/* Two Columns */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${32 * fs}px`, marginBottom: `${36 * fs}px` }}
        >
          <div>
            <h2
              style={{
                fontSize: `${11 * fs}px`,
                fontWeight: "600",
                color: accent,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              The Opportunity
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#52525b", lineHeight: 1.8 }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Your brand has tremendous potential. With the right creative direction, we can transform how your audience perceives and engages with your business."}
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: `${11 * fs}px`,
                fontWeight: "600",
                color: accent,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Our Approach
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#52525b", lineHeight: 1.8 }}>
              {sections?.SOLUTION ||
                "We combine strategic thinking with creative excellence to deliver work that stands out, resonates with your audience, and achieves your business objectives."}
            </p>
          </div>
        </div>

        {/* Investment Bar */}
        <div
          style={{
            backgroundColor: "#18181b",
            borderRadius: `${8 * fs}px`,
            padding: `${24 * fs}px ${28 * fs}px`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                color: "#71717a",
                fontSize: `${10 * fs}px`,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${4 * fs}px`,
              }}
            >
              Project Investment
            </p>
            <p style={{ color: "#ffffff", fontSize: `${24 * fs}px`, fontWeight: "600" }}>
              {safeInfo.budget || "$35,000"}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: "#71717a",
                fontSize: `${10 * fs}px`,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${4 * fs}px`,
              }}
            >
              Timeline
            </p>
            <p style={{ color: accent, fontSize: `${18 * fs}px`, fontWeight: "600" }}>
              {safeInfo.timeline || "6-8 weeks"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: `${20 * fs}px ${48 * fs}px`,
          borderTop: "1px solid #e4e4e7",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: `${11 * fs}px`, color: "#a1a1aa" }}>{safeBranding.companyName} Studio</span>
        <span style={{ fontSize: `${11 * fs}px`, color: "#a1a1aa" }}>Let's create something amazing →</span>
      </div>
    </div>
  )
}
