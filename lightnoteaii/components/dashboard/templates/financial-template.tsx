"use client"

import type { TemplateProps } from "./types"

export function FinancialTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const green = "#059669"

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
      }}
    >
      {/* Header */}
      <div style={{ padding: `${40 * fs}px ${48 * fs}px ${32 * fs}px`, borderBottom: `1px solid #e5e7eb` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: `${10 * fs}px`, marginBottom: `${20 * fs}px` }}>
              {safeInfo.logo ? (
                <img src={safeInfo.logo || "/placeholder.svg"} alt="Logo" style={{ height: `${24 * fs}px` }} />
              ) : (
                <div
                  style={{
                    width: `${28 * fs}px`,
                    height: `${28 * fs}px`,
                    borderRadius: "50%",
                    backgroundColor: green,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "#ffffff", fontWeight: "700", fontSize: `${12 * fs}px` }}>
                    {safeBranding.companyName.charAt(0)}
                  </span>
                </div>
              )}
              <span style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: "#111827" }}>
                {safeBranding.companyName}
              </span>
            </div>
            <h1
              style={{
                fontSize: `${28 * fs}px`,
                fontWeight: "700",
                color: "#111827",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Investment Proposal
            </h1>
            <p style={{ fontSize: `${13 * fs}px`, color: "#6b7280", marginTop: `${8 * fs}px` }}>
              {safeInfo.proposalType || "Financial Services"} for {safeInfo.clientCompany}
            </p>
          </div>
          <div
            style={{
              backgroundColor: "#f0fdf4",
              borderRadius: `${6 * fs}px`,
              padding: `${12 * fs}px ${16 * fs}px`,
              textAlign: "right",
            }}
          >
            <p style={{ fontSize: `${10 * fs}px`, color: "#6b7280", marginBottom: `${4 * fs}px` }}>Date</p>
            <p style={{ fontSize: `${13 * fs}px`, color: green, fontWeight: "600" }}>{currentDate}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${36 * fs}px ${48 * fs}px` }}>
        {/* Summary */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <h2
            style={{
              fontSize: `${11 * fs}px`,
              fontWeight: "600",
              color: green,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: `${12 * fs}px`,
            }}
          >
            Investment Overview
          </h2>
          <p style={{ fontSize: `${13 * fs}px`, color: "#4b5563", lineHeight: 1.8 }}>
            {sections?.SUMMARY ||
              "This investment proposal outlines a strategic opportunity with strong growth potential and attractive risk-adjusted returns. Our analysis indicates significant upside based on market fundamentals and execution capabilities."}
          </p>
        </div>

        {/* Key Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: `${16 * fs}px`,
            marginBottom: `${32 * fs}px`,
          }}
        >
          {[
            { label: "Investment", value: safeInfo.budget || "$500K", change: "" },
            { label: "Target ROI", value: "25%", change: "+5% vs. benchmark" },
            { label: "Timeline", value: safeInfo.timeline || "24 mo", change: "" },
            { label: "Risk Level", value: "Moderate", change: "" },
          ].map((metric, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: `${6 * fs}px`,
                padding: `${16 * fs}px`,
                borderLeft: `3px solid ${green}`,
              }}
            >
              <p
                style={{
                  fontSize: `${10 * fs}px`,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: `${6 * fs}px`,
                }}
              >
                {metric.label}
              </p>
              <p style={{ fontSize: `${18 * fs}px`, color: "#111827", fontWeight: "600", marginBottom: `${2 * fs}px` }}>
                {metric.value}
              </p>
              {metric.change && <p style={{ fontSize: `${10 * fs}px`, color: green }}>{metric.change}</p>}
            </div>
          ))}
        </div>

        {/* Two Column Content */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${32 * fs}px`, marginBottom: `${32 * fs}px` }}
        >
          <div>
            <h2
              style={{
                fontSize: `${11 * fs}px`,
                fontWeight: "600",
                color: green,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Market Opportunity
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.8 }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "The current market presents a compelling entry point with favorable valuations and strong tailwinds from regulatory changes and technological innovation."}
            </p>
          </div>
          <div>
            <h2
              style={{
                fontSize: `${11 * fs}px`,
                fontWeight: "600",
                color: green,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: `${12 * fs}px`,
              }}
            >
              Investment Strategy
            </h2>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.8 }}>
              {sections?.SOLUTION ||
                "Our strategy focuses on capital preservation while capturing asymmetric upside through diversified exposure and active portfolio management."}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            backgroundColor: "#fefce8",
            borderRadius: `${4 * fs}px`,
            padding: `${16 * fs}px`,
            border: "1px solid #fef08a",
          }}
        >
          <p style={{ fontSize: `${10 * fs}px`, color: "#854d0e", lineHeight: 1.6 }}>
            <strong>Important:</strong> Past performance is not indicative of future results. This proposal is for
            informational purposes only and does not constitute investment advice.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: `${20 * fs}px ${48 * fs}px`,
          borderTop: `1px solid #e5e7eb`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: `${10 * fs}px`, color: "#9ca3af" }}>{safeBranding.companyName} • SEC Registered</span>
        <span style={{ fontSize: `${10 * fs}px`, color: "#9ca3af" }}>Confidential</span>
      </div>
    </div>
  )
}
