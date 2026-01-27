"use client"

import type { TemplateProps } from "./types"

export function EnterpriseTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const navy = "#1e3a5f"

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
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
        border: `1px solid #e5e7eb`,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: navy,
          padding: `${32 * fs}px ${48 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px` }}>
          {safeInfo.logo ? (
            <img src={safeInfo.logo || "/placeholder.svg"} alt="Logo" style={{ height: `${28 * fs}px` }} />
          ) : (
            <div
              style={{
                width: `${36 * fs}px`,
                height: `${36 * fs}px`,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: `${4 * fs}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: "700", fontSize: `${16 * fs}px` }}>
                {safeBranding.companyName.charAt(0)}
              </span>
            </div>
          )}
          <span style={{ color: "#ffffff", fontSize: `${15 * fs}px`, fontWeight: "600" }}>
            {safeBranding.companyName}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: `${11 * fs}px`, marginBottom: `${2 * fs}px` }}>
            Document Date
          </p>
          <p style={{ color: "#ffffff", fontSize: `${12 * fs}px` }}>{currentDate}</p>
        </div>
      </div>

      {/* Title Section */}
      <div style={{ padding: `${40 * fs}px ${48 * fs}px`, borderBottom: `1px solid #e5e7eb` }}>
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#f1f5f9",
            color: navy,
            fontSize: `${10 * fs}px`,
            fontWeight: "600",
            padding: `${4 * fs}px ${10 * fs}px`,
            borderRadius: `${2 * fs}px`,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: `${16 * fs}px`,
          }}
        >
          {safeInfo.proposalType || "Enterprise Solution"}
        </span>
        <h1
          style={{
            fontSize: `${32 * fs}px`,
            fontWeight: "700",
            color: "#111827",
            margin: 0,
            marginBottom: `${12 * fs}px`,
          }}
        >
          Enterprise Partnership Proposal
        </h1>
        <p style={{ fontSize: `${14 * fs}px`, color: "#6b7280", margin: 0 }}>
          Prepared exclusively for {safeInfo.clientName} at {safeInfo.clientCompany}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${36 * fs}px ${48 * fs}px` }}>
        {/* Executive Summary */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <h2
            style={{
              fontSize: `${12 * fs}px`,
              fontWeight: "600",
              color: navy,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: `${12 * fs}px`,
              paddingBottom: `${8 * fs}px`,
              borderBottom: `2px solid ${navy}`,
              display: "inline-block",
            }}
          >
            Executive Summary
          </h2>
          <p style={{ fontSize: `${13 * fs}px`, color: "#4b5563", lineHeight: 1.8 }}>
            {sections?.SUMMARY ||
              "This enterprise proposal outlines a comprehensive solution designed to meet your organization's strategic objectives. Our enterprise-grade approach ensures scalability, security, and long-term value creation through proven methodologies and dedicated support."}
          </p>
        </div>

        {/* Two Column Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${40 * fs}px`, marginBottom: `${32 * fs}px` }}
        >
          <div>
            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "600",
                color: navy,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Business Challenge
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.8 }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Enterprise organizations require solutions that can scale across departments, integrate with existing systems, and meet stringent compliance requirements while delivering measurable ROI."}
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: `${12 * fs}px`,
                fontWeight: "600",
                color: navy,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Proposed Solution
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.8 }}>
              {sections?.SOLUTION ||
                "Our enterprise solution provides a secure, scalable platform with dedicated support, custom integrations, and comprehensive training to ensure successful adoption across your organization."}
            </p>
          </div>
        </div>

        {/* Terms Grid */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: `${4 * fs}px`,
            padding: `${24 * fs}px`,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: `${20 * fs}px`,
            border: `1px solid #e2e8f0`,
          }}
        >
          {[
            { label: "Contract Term", value: "36 months" },
            { label: "Implementation", value: safeInfo.timeline || "12 weeks" },
            { label: "Annual Value", value: safeInfo.budget || "$250,000" },
            { label: "Support Level", value: "Enterprise" },
          ].map((item, i) => (
            <div key={i}>
              <p
                style={{
                  fontSize: `${10 * fs}px`,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: `${6 * fs}px`,
                }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: `${15 * fs}px`, color: navy, fontWeight: "600" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: `${20 * fs}px ${48 * fs}px`,
          borderTop: `1px solid #e5e7eb`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{ fontSize: `${10 * fs}px`, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}
        >
          Confidential — {safeBranding.companyName}
        </span>
        <span style={{ fontSize: `${10 * fs}px`, color: "#94a3b8" }}>Page 1 of 1</span>
      </div>
    </div>
  )
}
