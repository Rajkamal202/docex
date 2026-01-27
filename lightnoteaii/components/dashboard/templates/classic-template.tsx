"use client"

import type { TemplateProps } from "./types"

export function ClassicTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
}: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const sageGreen = "#d4ddd9"
  const darkGreen = "#2d4a47"
  const goldAccent = "#c9a227"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "white",
        fontFamily: "'Arial', sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Left Sidebar - Sage Green */}
      <div
        style={{
          width: "38%",
          backgroundColor: sageGreen,
          padding: `${40 * fs}px ${28 * fs}px`,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Red/Orange accent bar on left edge */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${100 * fs}px`,
            width: `${8 * fs}px`,
            height: `${120 * fs}px`,
            backgroundColor: "#c45c3e",
          }}
        />

        {/* Company Name & Date - Centered */}
        <div style={{ textAlign: "center", marginBottom: `${32 * fs}px` }}>
          {safeInfo.logo ? (
            <img
              src={safeInfo.logo || "/placeholder.svg"}
              alt="Logo"
              style={{ height: `${50 * fs}px`, width: "auto", marginBottom: `${12 * fs}px` }}
            />
          ) : (
            <h2
              style={{
                fontSize: `${18 * fs}px`,
                fontWeight: "bold",
                color: darkGreen,
                margin: 0,
                letterSpacing: "1px",
              }}
            >
              {safeBranding.companyName}
            </h2>
          )}
          <p style={{ fontSize: `${12 * fs}px`, color: "#5a7a6f", marginTop: `${8 * fs}px` }}>{currentDate}</p>
        </div>

        {/* Title Block with accent bar */}
        <div style={{ marginBottom: `${40 * fs}px`, paddingLeft: `${16 * fs}px` }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div
              style={{
                width: `${8 * fs}px`,
                backgroundColor: goldAccent,
                marginRight: `${16 * fs}px`,
                borderRadius: "2px",
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: `${32 * fs}px`,
                  fontWeight: "800",
                  color: darkGreen,
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                ONE PAGE
              </h1>
              <h1
                style={{
                  fontSize: `${32 * fs}px`,
                  fontWeight: "800",
                  color: darkGreen,
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                BUSINESS
              </h1>
              <h1
                style={{
                  fontSize: `${32 * fs}px`,
                  fontWeight: "800",
                  color: darkGreen,
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              >
                PROPOSAL
              </h1>
            </div>
          </div>
        </div>

        {/* Prepared For Section */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <p
            style={{
              fontSize: `${11 * fs}px`,
              color: "#5a7a6f",
              marginBottom: `${6 * fs}px`,
              textTransform: "none",
            }}
          >
            Prepared for:
          </p>
          <p
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              margin: 0,
              marginBottom: `${2 * fs}px`,
            }}
          >
            {safeInfo.clientName}
          </p>
          <p
            style={{
              fontSize: `${13 * fs}px`,
              fontWeight: "600",
              color: "#444",
              margin: 0,
              marginBottom: `${12 * fs}px`,
            }}
          >
            {safeInfo.clientCompany}
          </p>
          <div style={{ fontSize: `${11 * fs}px`, color: "#666", lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>{safeInfo.clientEmail}</p>
            <p style={{ margin: 0 }}>www.clientcompany.com</p>
            <p style={{ margin: 0 }}>898-555-0111</p>
            <p style={{ margin: 0 }}>987 6th Ave,</p>
            <p style={{ margin: 0 }}>Santa Fe, NM 11121</p>
          </div>
        </div>

        {/* Prepared By Section - Pushed to bottom */}
        <div style={{ marginTop: "auto" }}>
          <p
            style={{
              fontSize: `${11 * fs}px`,
              color: "#5a7a6f",
              marginBottom: `${6 * fs}px`,
              textTransform: "none",
            }}
          >
            Prepared by:
          </p>
          <p
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              margin: 0,
              marginBottom: `${2 * fs}px`,
            }}
          >
            Casey Jensen
          </p>
          <p
            style={{
              fontSize: `${13 * fs}px`,
              fontWeight: "600",
              color: "#444",
              margin: 0,
              marginBottom: `${12 * fs}px`,
            }}
          >
            {safeBranding.companyName}
          </p>
          <div style={{ fontSize: `${11 * fs}px`, color: "#666", lineHeight: 1.8 }}>
            <p style={{ margin: 0 }}>casey@fabrikam.com</p>
            <p style={{ margin: 0 }}>www.fabrikam.com</p>
            <p style={{ margin: 0 }}>573-555-0172</p>
            <p style={{ margin: 0 }}>333 3rd Avenue,</p>
            <p style={{ margin: 0 }}>Seattle, WA 89101</p>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div style={{ flex: 1, padding: `${40 * fs}px ${32 * fs}px`, backgroundColor: "white" }}>
        {/* SUMMARY */}
        <div style={{ marginBottom: `${24 * fs}px` }}>
          <h3
            style={{
              fontSize: `${14 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              marginBottom: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            SUMMARY
          </h3>
          <p
            style={{
              fontSize: `${12 * fs}px`,
              color: "#555",
              lineHeight: 1.7,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {sections?.SUMMARY ||
              "This proposal outlines a streamlined solution designed to address key business challenges and drive growth. Our approach leverages industry expertise, innovative strategies, and data-driven insights to create a tailored plan that delivers measurable results."}
          </p>
        </div>

        {/* PROBLEM STATEMENT */}
        <div style={{ marginBottom: `${24 * fs}px` }}>
          <h3
            style={{
              fontSize: `${14 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              marginBottom: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            PROBLEM STATEMENT
          </h3>
          <p
            style={{
              fontSize: `${12 * fs}px`,
              color: "#555",
              lineHeight: 1.7,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {sections?.["PROBLEM STATEMENT"] ||
              safeInfo.problem ||
              "Businesses today face challenges such as inefficiencies, rising costs, and evolving market demands. Addressing these issues requires a well-structured, strategic approach that ensures long-term success."}
          </p>
        </div>

        {/* SOLUTION */}
        <div style={{ marginBottom: `${24 * fs}px` }}>
          <h3
            style={{
              fontSize: `${14 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              marginBottom: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            SOLUTION
          </h3>
          <p
            style={{
              fontSize: `${12 * fs}px`,
              color: "#555",
              lineHeight: 1.7,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {sections?.SOLUTION ||
              "Our solution is designed to enhance operations, increase efficiency, and improve overall performance. By implementing best practices and modern technology, we help businesses optimize workflows, reduce costs, and drive innovation."}
          </p>
        </div>

        {/* MARKET OPPORTUNITY */}
        <div style={{ marginBottom: `${24 * fs}px` }}>
          <h3
            style={{
              fontSize: `${14 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              marginBottom: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            MARKET OPPORTUNITY
          </h3>
          <p
            style={{
              fontSize: `${12 * fs}px`,
              color: "#555",
              lineHeight: 1.7,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {sections?.["MARKET OPPORTUNITY"] ||
              "With industry trends shifting rapidly, adopting a flexible and forward-thinking model is essential. Our approach provides businesses with scalable, adaptable solutions that align with market demands and ensure long-term sustainability."}
          </p>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div>
          <h3
            style={{
              fontSize: `${14 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              marginBottom: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            FINANCIAL SUMMARY
          </h3>
          <p
            style={{
              fontSize: `${12 * fs}px`,
              color: "#555",
              lineHeight: 1.7,
              textAlign: "justify",
              margin: 0,
            }}
          >
            {sections?.["FINANCIAL SUMMARY"] ||
              "Based on market analysis, businesses that implement our strategies see an average 20% reduction in operational costs and a 35% improvement in workflow efficiency within the first year. Clients can expect a strong return on investment through improved productivity and streamlined operations."}
          </p>
        </div>
      </div>
    </div>
  )
}
