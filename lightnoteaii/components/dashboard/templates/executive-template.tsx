"use client"

import type { TemplateProps } from "./types"

export function ExecutiveTemplate({
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
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          width: `${220 * fs}px`,
          backgroundColor: "#111827",
          padding: `${40 * fs}px ${28 * fs}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: `${48 * fs}px` }}>
          {safeInfo.logo ? (
            <img src={safeInfo.logo || "/placeholder.svg"} alt="Logo" style={{ height: `${32 * fs}px` }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
              <div
                style={{
                  width: `${32 * fs}px`,
                  height: `${32 * fs}px`,
                  borderRadius: `${6 * fs}px`,
                  border: "2px solid #3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: "#3b82f6", fontWeight: "700", fontSize: `${14 * fs}px` }}>
                  {safeBranding.companyName.charAt(0)}
                </span>
              </div>
            </div>
          )}
          <p style={{ color: "#9ca3af", fontSize: `${12 * fs}px`, marginTop: `${12 * fs}px` }}>
            {safeBranding.companyName}
          </p>
        </div>

        {/* Contact Info */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <h4
            style={{
              color: "#6b7280",
              fontSize: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: `${12 * fs}px`,
            }}
          >
            Prepared For
          </h4>
          <p style={{ color: "#ffffff", fontSize: `${13 * fs}px`, fontWeight: "500", marginBottom: `${4 * fs}px` }}>
            {safeInfo.clientName}
          </p>
          <p style={{ color: "#9ca3af", fontSize: `${11 * fs}px`, lineHeight: 1.6 }}>
            {safeInfo.clientCompany}
            <br />
            {safeInfo.clientEmail}
          </p>
        </div>

        <div>
          <h4
            style={{
              color: "#6b7280",
              fontSize: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: `${12 * fs}px`,
            }}
          >
            Date
          </h4>
          <p style={{ color: "#ffffff", fontSize: `${12 * fs}px` }}>{currentDate}</p>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Quick Stats */}
        <div style={{ borderTop: "1px solid #1f2937", paddingTop: `${24 * fs}px` }}>
          <div style={{ marginBottom: `${16 * fs}px` }}>
            <p
              style={{
                color: "#6b7280",
                fontSize: `${10 * fs}px`,
                textTransform: "uppercase",
                marginBottom: `${4 * fs}px`,
              }}
            >
              Timeline
            </p>
            <p style={{ color: "#3b82f6", fontSize: `${16 * fs}px`, fontWeight: "600" }}>
              {safeInfo.timeline || "8 weeks"}
            </p>
          </div>
          <div>
            <p
              style={{
                color: "#6b7280",
                fontSize: `${10 * fs}px`,
                textTransform: "uppercase",
                marginBottom: `${4 * fs}px`,
              }}
            >
              Investment
            </p>
            <p style={{ color: "#3b82f6", fontSize: `${16 * fs}px`, fontWeight: "600" }}>
              {safeInfo.budget || "$40,000"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${48 * fs}px` }}>
        {/* Title */}
        <div style={{ marginBottom: `${40 * fs}px` }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#eff6ff",
              color: "#3b82f6",
              fontSize: `${10 * fs}px`,
              fontWeight: "600",
              padding: `${4 * fs}px ${10 * fs}px`,
              borderRadius: `${4 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: `${16 * fs}px`,
            }}
          >
            {safeInfo.proposalType || "Executive Proposal"}
          </span>
          <h1
            style={{
              fontSize: `${36 * fs}px`,
              fontWeight: "700",
              color: "#111827",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Partnership
            <br />
            Proposal
          </h1>
        </div>

        {/* Executive Summary */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <h2
            style={{
              fontSize: `${12 * fs}px`,
              fontWeight: "600",
              color: "#3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: `${12 * fs}px`,
            }}
          >
            Executive Summary
          </h2>
          <p style={{ fontSize: `${13 * fs}px`, color: "#4b5563", lineHeight: 1.8 }}>
            {sections?.SUMMARY ||
              "This proposal presents a strategic partnership opportunity designed to accelerate your business objectives through innovative solutions and proven expertise. Our approach combines deep industry knowledge with cutting-edge methodologies to deliver measurable results."}
          </p>
        </div>

        {/* Two Column Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${32 * fs}px`, marginBottom: `${32 * fs}px` }}
        >
          <div>
            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "600",
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Challenge
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.8 }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Organizations face increasing pressure to innovate while maintaining operational efficiency and competitive positioning in rapidly evolving markets."}
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "600",
                color: "#3b82f6",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Solution
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.8 }}>
              {sections?.SOLUTION ||
                "A comprehensive engagement combining strategic advisory, implementation support, and ongoing optimization to drive sustainable transformation and growth."}
            </p>
          </div>
        </div>

        {/* Key Deliverables */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: `${8 * fs}px`,
            padding: `${24 * fs}px`,
          }}
        >
          <h2 style={{ fontSize: `${12 * fs}px`, fontWeight: "600", color: "#111827", marginBottom: `${16 * fs}px` }}>
            Key Deliverables
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${12 * fs}px` }}>
            {[
              "Strategic Assessment Report",
              "Implementation Roadmap",
              "Executive Dashboards",
              "Training & Enablement",
              "Performance Metrics",
              "Quarterly Reviews",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
                <div
                  style={{
                    width: `${6 * fs}px`,
                    height: `${6 * fs}px`,
                    borderRadius: "50%",
                    backgroundColor: "#3b82f6",
                  }}
                />
                <span style={{ fontSize: `${12 * fs}px`, color: "#4b5563" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
