"use client"

import type { TemplateProps } from "./types"

export function MinimalTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.06)" : "none",
        padding: `${64 * fs}px`,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: `${64 * fs}px` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: `${48 * fs}px`,
          }}
        >
          <span style={{ fontSize: `${13 * fs}px`, color: "#9ca3af", fontWeight: "500" }}>
            {safeBranding.companyName}
          </span>
          <span style={{ fontSize: `${13 * fs}px`, color: "#9ca3af" }}>{currentDate}</span>
        </div>
        <h1
          style={{
            fontSize: `${48 * fs}px`,
            fontWeight: "300",
            color: "#171717",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "-1px",
          }}
        >
          Proposal
        </h1>
        <p style={{ fontSize: `${16 * fs}px`, color: "#737373", marginTop: `${16 * fs}px`, fontWeight: "400" }}>
          For {safeInfo.clientCompany}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {/* Summary */}
        <div style={{ marginBottom: `${48 * fs}px` }}>
          <p style={{ fontSize: `${15 * fs}px`, color: "#404040", lineHeight: 1.9, maxWidth: "85%" }}>
            {sections?.SUMMARY ||
              "A thoughtfully crafted proposal outlining our approach to solving your challenges with precision and care. We believe in simplicity, clarity, and delivering exceptional results."}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{ width: `${48 * fs}px`, height: "1px", backgroundColor: "#e5e5e5", marginBottom: `${48 * fs}px` }}
        />

        {/* Sections */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: `${32 * fs}px`,
            marginBottom: `${40 * fs}px`,
          }}
        >
          <span style={{ fontSize: `${12 * fs}px`, color: "#9ca3af", fontWeight: "500" }}>Challenge</span>
          <p style={{ fontSize: `${14 * fs}px`, color: "#525252", lineHeight: 1.8, margin: 0 }}>
            {sections?.["PROBLEM STATEMENT"] ||
              safeInfo.problem ||
              "Understanding the core challenge is the first step toward a meaningful solution."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: `${32 * fs}px`,
            marginBottom: `${40 * fs}px`,
          }}
        >
          <span style={{ fontSize: `${12 * fs}px`, color: "#9ca3af", fontWeight: "500" }}>Approach</span>
          <p style={{ fontSize: `${14 * fs}px`, color: "#525252", lineHeight: 1.8, margin: 0 }}>
            {sections?.SOLUTION ||
              "Our methodology focuses on clarity, efficiency, and sustainable outcomes that align with your goals."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: `${32 * fs}px`,
            marginBottom: `${40 * fs}px`,
          }}
        >
          <span style={{ fontSize: `${12 * fs}px`, color: "#9ca3af", fontWeight: "500" }}>Timeline</span>
          <p style={{ fontSize: `${14 * fs}px`, color: "#525252", lineHeight: 1.8, margin: 0 }}>
            {safeInfo.timeline || "6-8 weeks"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: `${32 * fs}px` }}>
          <span style={{ fontSize: `${12 * fs}px`, color: "#9ca3af", fontWeight: "500" }}>Investment</span>
          <p style={{ fontSize: `${14 * fs}px`, color: "#171717", lineHeight: 1.8, margin: 0, fontWeight: "500" }}>
            {safeInfo.budget || "$25,000"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ paddingTop: `${48 * fs}px`, borderTop: "1px solid #f5f5f5" }}>
        <p style={{ fontSize: `${12 * fs}px`, color: "#a3a3a3" }}>{safeInfo.clientEmail}</p>
      </div>
    </div>
  )
}
