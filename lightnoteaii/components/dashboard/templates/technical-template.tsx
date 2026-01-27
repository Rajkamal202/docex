"use client"

import type { TemplateProps } from "./types"

export function TechnicalTemplate({
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
        backgroundColor: "#0f172a",
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
        fontSize: `${13 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        color: "#e2e8f0",
      }}
    >
      {/* Header */}
      <div style={{ padding: `${32 * fs}px ${40 * fs}px`, borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px` }}>
            <div
              style={{
                width: `${32 * fs}px`,
                height: `${32 * fs}px`,
                borderRadius: `${4 * fs}px`,
                backgroundColor: "#22d3ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#0f172a", fontWeight: "700", fontSize: `${14 * fs}px` }}>&lt;/&gt;</span>
            </div>
            <span style={{ color: "#f1f5f9", fontSize: `${14 * fs}px`, fontWeight: "600" }}>
              {safeBranding.companyName}
            </span>
          </div>
          <span style={{ color: "#64748b", fontSize: `${11 * fs}px` }}>{currentDate}</span>
        </div>
      </div>

      {/* Title Section */}
      <div style={{ padding: `${40 * fs}px ${40 * fs}px ${32 * fs}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px`, marginBottom: `${16 * fs}px` }}>
          <span style={{ color: "#22d3ee", fontSize: `${12 * fs}px` }}>$</span>
          <span style={{ color: "#94a3b8", fontSize: `${12 * fs}px` }}>cat proposal.md</span>
        </div>
        <h1
          style={{
            fontSize: `${32 * fs}px`,
            fontWeight: "700",
            color: "#f1f5f9",
            margin: 0,
            marginBottom: `${8 * fs}px`,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Technical Development Proposal
        </h1>
        <p style={{ color: "#64748b", fontSize: `${13 * fs}px`, margin: 0 }}>
          // {safeInfo.proposalType || "Full-Stack Development"} for {safeInfo.clientCompany}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `0 ${40 * fs}px ${40 * fs}px` }}>
        {/* Overview */}
        <div style={{ marginBottom: `${28 * fs}px` }}>
          <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px`, marginBottom: `${12 * fs}px` }}>
            <span style={{ color: "#22d3ee" }}>##</span>
            <span style={{ color: "#f1f5f9", fontWeight: "600" }}>Overview</span>
          </div>
          <div
            style={{
              backgroundColor: "#1e293b",
              borderRadius: `${6 * fs}px`,
              padding: `${16 * fs}px`,
              borderLeft: `3px solid #22d3ee`,
            }}
          >
            <p style={{ color: "#cbd5e1", lineHeight: 1.7, margin: 0, fontSize: `${12 * fs}px` }}>
              {sections?.SUMMARY ||
                "This proposal outlines the technical architecture, implementation timeline, and deliverables for building a scalable, maintainable solution using modern development practices and industry-standard technologies."}
            </p>
          </div>
        </div>

        {/* Two Columns */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${24 * fs}px`, marginBottom: `${28 * fs}px` }}
        >
          {/* Problem */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px`, marginBottom: `${12 * fs}px` }}>
              <span style={{ color: "#f87171" }}>##</span>
              <span style={{ color: "#f1f5f9", fontWeight: "600" }}>Problem</span>
            </div>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: `${12 * fs}px` }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Legacy systems, technical debt, and scalability limitations are hindering business growth and development velocity."}
            </p>
          </div>

          {/* Solution */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px`, marginBottom: `${12 * fs}px` }}>
              <span style={{ color: "#4ade80" }}>##</span>
              <span style={{ color: "#f1f5f9", fontWeight: "600" }}>Solution</span>
            </div>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: `${12 * fs}px` }}>
              {sections?.SOLUTION ||
                "Modern architecture with microservices, CI/CD pipelines, automated testing, and cloud-native infrastructure for optimal performance and scalability."}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: `${28 * fs}px` }}>
          <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px`, marginBottom: `${12 * fs}px` }}>
            <span style={{ color: "#a78bfa" }}>##</span>
            <span style={{ color: "#f1f5f9", fontWeight: "600" }}>Tech Stack</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: `${8 * fs}px` }}>
            {["Next.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "AWS", "GraphQL", "Tailwind"].map((tech, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: "#1e293b",
                  color: "#22d3ee",
                  padding: `${6 * fs}px ${12 * fs}px`,
                  borderRadius: `${4 * fs}px`,
                  fontSize: `${11 * fs}px`,
                  border: "1px solid #334155",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline & Budget */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${24 * fs}px` }}>
          <div
            style={{
              backgroundColor: "#1e293b",
              borderRadius: `${6 * fs}px`,
              padding: `${20 * fs}px`,
            }}
          >
            <p
              style={{
                color: "#64748b",
                fontSize: `${10 * fs}px`,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${8 * fs}px`,
              }}
            >
              Timeline
            </p>
            <p
              style={{
                color: "#22d3ee",
                fontSize: `${24 * fs}px`,
                fontWeight: "700",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {safeInfo.timeline || "12 weeks"}
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#1e293b",
              borderRadius: `${6 * fs}px`,
              padding: `${20 * fs}px`,
            }}
          >
            <p
              style={{
                color: "#64748b",
                fontSize: `${10 * fs}px`,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${8 * fs}px`,
              }}
            >
              Investment
            </p>
            <p
              style={{
                color: "#4ade80",
                fontSize: `${24 * fs}px`,
                fontWeight: "700",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {safeInfo.budget || "$75,000"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: `${16 * fs}px ${40 * fs}px`,
          borderTop: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#475569", fontSize: `${10 * fs}px` }}>{safeBranding.companyName} // Confidential</span>
        <span style={{ color: "#475569", fontSize: `${10 * fs}px` }}>v1.0.0</span>
      </div>
    </div>
  )
}
