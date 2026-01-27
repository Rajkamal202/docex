"use client"

import type { TemplateProps } from "./types"

export function ModernTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const darkTeal = "#2d4a47"
  const lightTeal = "#e8edeb"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "white",
        fontFamily: "'Arial', sans-serif",
        fontSize: `${14 * fs}px`,
        borderLeft: `${8 * fs}px solid ${darkTeal}`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Header Section */}
      <div style={{ padding: `${40 * fs}px ${40 * fs}px ${32 * fs}px` }}>
        <p style={{ fontSize: `${13 * fs}px`, color: "#666", marginBottom: `${16 * fs}px` }}>{currentDate}</p>
        <h1
          style={{
            fontSize: `${56 * fs}px`,
            fontWeight: "900",
            color: darkTeal,
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-2px",
          }}
        >
          BUSINESS
        </h1>
        <h1
          style={{
            fontSize: `${56 * fs}px`,
            fontWeight: "900",
            color: darkTeal,
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-2px",
          }}
        >
          PROPOSAL
        </h1>
        <p
          style={{
            fontSize: `${12 * fs}px`,
            color: "#555",
            marginTop: `${20 * fs}px`,
            lineHeight: 1.7,
            maxWidth: "90%",
          }}
        >
          {sections?.SUMMARY ||
            "This proposal outlines a streamlined solution designed to address key business challenges and drive growth. Our approach leverages industry expertise, innovative strategies, and data-driven insights to create a tailored plan that delivers measurable results."}
        </p>
      </div>

      {/* 2x2 Content Grid */}
      <div
        style={{
          flex: 1,
          padding: `0 ${40 * fs}px`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: `${32 * fs}px`,
        }}
      >
        {/* Problem Statement */}
        <div>
          <h3
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            PROBLEM STATEMENT
          </h3>
          <p style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}>
            {sections?.["PROBLEM STATEMENT"] ||
              safeInfo.problem ||
              "Businesses today face challenges such as inefficiencies, rising costs, and evolving market demands. Addressing these issues requires a well-structured, strategic approach that ensures long-term success."}
          </p>
        </div>

        {/* Solution */}
        <div>
          <h3
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            SOLUTION
          </h3>
          <p style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}>
            {sections?.SOLUTION ||
              "Our solution is designed to enhance operations, increase efficiency, and improve overall performance. By implementing best practices and modern technology, we help businesses optimize workflows, reduce costs, and drive innovation."}
          </p>
        </div>

        {/* Market Opportunity */}
        <div>
          <h3
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            MARKET OPPORTUNITY
          </h3>
          <p style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}>
            {sections?.["MARKET OPPORTUNITY"] ||
              "With industry trends shifting rapidly, adopting a flexible and forward-thinking model is essential. Our approach provides businesses with scalable, adaptable solutions that align with market demands and ensure long-term sustainability."}
          </p>
        </div>

        {/* Financial Summary */}
        <div>
          <h3
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            FINANCIAL SUMMARY
          </h3>
          <p style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}>
            {sections?.["FINANCIAL SUMMARY"] ||
              "Based on market analysis, businesses that implement our strategies see an average 20% reduction in operational costs and a 35% improvement in workflow efficiency within the first year. Clients can expect a strong return on investment."}
          </p>
        </div>
      </div>

      {/* Footer with Contact Info */}
      <div
        style={{
          backgroundColor: lightTeal,
          padding: `${28 * fs}px ${40 * fs}px`,
          display: "flex",
          gap: `${60 * fs}px`,
          marginTop: `${32 * fs}px`,
        }}
      >
        {/* Prepared For */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: `${12 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            PREPARED FOR:
          </h4>
          <div style={{ fontSize: `${11 * fs}px`, color: "#555", lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>
              {safeInfo.clientName}, {safeInfo.clientCompany}
            </p>
            <p style={{ margin: 0 }}>{safeInfo.clientEmail}</p>
            <p style={{ margin: 0 }}>573-555-0172</p>
            <p style={{ margin: 0 }}>www.fabrikam.com</p>
            <p style={{ margin: 0 }}>333 3rd Avenue, Seattle, WA 89101</p>
          </div>
        </div>

        {/* Prepared By */}
        <div style={{ flex: 1 }}>
          <h4
            style={{
              fontSize: `${12 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            PREPARED BY:
          </h4>
          <div style={{ fontSize: `${11 * fs}px`, color: "#555", lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>Avery Howard, {safeBranding.companyName}</p>
            <p style={{ margin: 0 }}>avery@contoso.com</p>
            <p style={{ margin: 0 }}>898-555-0111</p>
            <p style={{ margin: 0 }}>www.contoso.com</p>
            <p style={{ margin: 0 }}>987 6th Ave, Santa Fe, NM 11121</p>
          </div>
        </div>
      </div>
    </div>
  )
}
