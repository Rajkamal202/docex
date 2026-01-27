"use client"

import type { TemplateProps } from "./types"

export function ConsultingTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const gold = "#b8860b"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "#fffdf7",
        fontFamily: "'Playfair Display', 'Georgia', serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Header */}
      <div style={{ padding: `${48 * fs}px ${56 * fs}px ${40 * fs}px`, borderBottom: `1px solid #e8e4d9` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px`, marginBottom: `${32 * fs}px` }}>
              {safeInfo.logo ? (
                <img src={safeInfo.logo || "/placeholder.svg"} alt="Logo" style={{ height: `${28 * fs}px` }} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
                  <div
                    style={{
                      width: `${36 * fs}px`,
                      height: `${2 * fs}px`,
                      backgroundColor: gold,
                    }}
                  />
                  <span style={{ color: "#2d2d2d", fontSize: `${16 * fs}px`, fontWeight: "500", letterSpacing: "2px" }}>
                    {safeBranding.companyName.toUpperCase()}
                  </span>
                  <div
                    style={{
                      width: `${36 * fs}px`,
                      height: `${2 * fs}px`,
                      backgroundColor: gold,
                    }}
                  />
                </div>
              )}
            </div>
            <h1
              style={{
                fontSize: `${42 * fs}px`,
                fontWeight: "400",
                color: "#2d2d2d",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "-0.5px",
              }}
            >
              Strategic Consulting
              <br />
              Engagement
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: `${11 * fs}px`,
                color: "#888",
                fontFamily: "'Inter', sans-serif",
                marginBottom: `${8 * fs}px`,
              }}
            >
              {currentDate}
            </p>
            <p style={{ fontSize: `${13 * fs}px`, color: "#2d2d2d", fontFamily: "'Inter', sans-serif" }}>
              Prepared for
            </p>
            <p style={{ fontSize: `${15 * fs}px`, color: gold, fontWeight: "500" }}>{safeInfo.clientCompany}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${40 * fs}px ${56 * fs}px` }}>
        {/* Executive Summary */}
        <div style={{ marginBottom: `${36 * fs}px` }}>
          <h2
            style={{
              fontSize: `${11 * fs}px`,
              fontWeight: "600",
              color: gold,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: `${16 * fs}px`,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Executive Summary
          </h2>
          <p style={{ fontSize: `${14 * fs}px`, color: "#4a4a4a", lineHeight: 1.9, maxWidth: "90%" }}>
            {sections?.SUMMARY ||
              "This engagement proposal outlines a comprehensive strategic advisory partnership designed to address your organization's most pressing challenges and unlock sustainable growth opportunities through proven methodologies and executive-level expertise."}
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: `${16 * fs}px`, marginBottom: `${36 * fs}px` }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e8e4d9" }} />
          <div
            style={{ width: `${8 * fs}px`, height: `${8 * fs}px`, backgroundColor: gold, transform: "rotate(45deg)" }}
          />
          <div style={{ flex: 1, height: "1px", backgroundColor: "#e8e4d9" }} />
        </div>

        {/* Two Column */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${48 * fs}px`, marginBottom: `${36 * fs}px` }}
        >
          <div>
            <h3
              style={{
                fontSize: `${11 * fs}px`,
                fontWeight: "600",
                color: gold,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: `${14 * fs}px`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Current State Assessment
            </h3>
            <p style={{ fontSize: `${13 * fs}px`, color: "#4a4a4a", lineHeight: 1.8 }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Organizations facing transformational challenges require strategic clarity, operational excellence, and change management expertise to navigate complexity and achieve sustainable competitive advantage."}
            </p>
          </div>
          <div>
            <h3
              style={{
                fontSize: `${11 * fs}px`,
                fontWeight: "600",
                color: gold,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: `${14 * fs}px`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Proposed Approach
            </h3>
            <p style={{ fontSize: `${13 * fs}px`, color: "#4a4a4a", lineHeight: 1.8 }}>
              {sections?.SOLUTION ||
                "Our engagement will deliver actionable insights, strategic frameworks, and implementation roadmaps tailored to your unique organizational context and growth objectives."}
            </p>
          </div>
        </div>

        {/* Engagement Terms */}
        <div
          style={{
            backgroundColor: "#f8f6f0",
            borderRadius: `${4 * fs}px`,
            padding: `${28 * fs}px`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: `${24 * fs}px`,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: `${10 * fs}px`,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${8 * fs}px`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Duration
            </p>
            <p style={{ fontSize: `${20 * fs}px`, color: "#2d2d2d", fontWeight: "500" }}>
              {safeInfo.timeline || "12 Weeks"}
            </p>
          </div>
          <div style={{ textAlign: "center", borderLeft: `1px solid #e8e4d9`, borderRight: `1px solid #e8e4d9` }}>
            <p
              style={{
                fontSize: `${10 * fs}px`,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${8 * fs}px`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Investment
            </p>
            <p style={{ fontSize: `${20 * fs}px`, color: gold, fontWeight: "500" }}>{safeInfo.budget || "$150,000"}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: `${10 * fs}px`,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: `${8 * fs}px`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Team
            </p>
            <p style={{ fontSize: `${20 * fs}px`, color: "#2d2d2d", fontWeight: "500" }}>3 Partners</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: `${24 * fs}px ${56 * fs}px`,
          borderTop: `1px solid #e8e4d9`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{ fontSize: `${10 * fs}px`, color: "#888", fontFamily: "'Inter', sans-serif", letterSpacing: "1px" }}
        >
          CONFIDENTIAL
        </span>
        <span style={{ fontSize: `${10 * fs}px`, color: "#888", fontFamily: "'Inter', sans-serif" }}>
          {safeBranding.companyName}
        </span>
      </div>
    </div>
  )
}
