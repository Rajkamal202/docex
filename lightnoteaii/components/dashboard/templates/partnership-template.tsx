"use client"

import type { TemplateProps } from "./types"

export function PartnershipTemplate({
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
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Header with dual logos */}
      <div style={{ padding: `${40 * fs}px ${48 * fs}px`, borderBottom: `1px solid #e5e7eb` }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: `${32 * fs}px`,
          }}
        >
          {/* Your Company */}
          <div style={{ display: "flex", alignItems: "center", gap: `${10 * fs}px` }}>
            <div
              style={{
                width: `${40 * fs}px`,
                height: `${40 * fs}px`,
                borderRadius: `${8 * fs}px`,
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#374151", fontWeight: "700", fontSize: `${16 * fs}px` }}>
                {safeBranding.companyName.charAt(0)}
              </span>
            </div>
            <span style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: "#111827" }}>
              {safeBranding.companyName}
            </span>
          </div>

          {/* Partnership Icon */}
          <div style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
            <div style={{ width: `${40 * fs}px`, height: "1px", backgroundColor: "#d1d5db" }} />
            <div
              style={{
                width: `${32 * fs}px`,
                height: `${32 * fs}px`,
                borderRadius: "50%",
                border: "2px solid #6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: `${14 * fs}px` }}>🤝</span>
            </div>
            <div style={{ width: `${40 * fs}px`, height: "1px", backgroundColor: "#d1d5db" }} />
          </div>

          {/* Partner Company */}
          <div style={{ display: "flex", alignItems: "center", gap: `${10 * fs}px` }}>
            <span style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: "#111827" }}>
              {safeInfo.clientCompany}
            </span>
            <div
              style={{
                width: `${40 * fs}px`,
                height: `${40 * fs}px`,
                borderRadius: `${8 * fs}px`,
                backgroundColor: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#ffffff", fontWeight: "700", fontSize: `${16 * fs}px` }}>
                {safeInfo.clientCompany.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#eef2ff",
              color: "#6366f1",
              fontSize: `${10 * fs}px`,
              fontWeight: "600",
              padding: `${4 * fs}px ${12 * fs}px`,
              borderRadius: `${20 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: `${16 * fs}px`,
            }}
          >
            Strategic Partnership
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
            Partnership Proposal
          </h1>
          <p style={{ fontSize: `${13 * fs}px`, color: "#6b7280", marginTop: `${8 * fs}px` }}>{currentDate}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${40 * fs}px ${48 * fs}px` }}>
        {/* Vision Statement */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: `${12 * fs}px`,
            padding: `${28 * fs}px`,
            marginBottom: `${32 * fs}px`,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: `${11 * fs}px`,
              fontWeight: "600",
              color: "#6366f1",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: `${12 * fs}px`,
            }}
          >
            Our Shared Vision
          </h2>
          <p style={{ fontSize: `${15 * fs}px`, color: "#374151", lineHeight: 1.8, maxWidth: "80%", margin: "0 auto" }}>
            {sections?.SUMMARY ||
              "Together, we can create exceptional value by combining our complementary strengths, expertise, and market presence to achieve outcomes neither organization could accomplish alone."}
          </p>
        </div>

        {/* Partnership Benefits - Two Sides */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${24 * fs}px`, marginBottom: `${32 * fs}px` }}
        >
          {/* Your Value */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: `${8 * fs}px`,
              padding: `${24 * fs}px`,
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ fontSize: `${12 * fs}px`, fontWeight: "600", color: "#111827", marginBottom: `${16 * fs}px` }}>
              What We Bring
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: `${10 * fs}px` }}>
              {["Industry Expertise", "Technical Capabilities", "Market Reach", "Dedicated Resources"].map(
                (item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
                    <div
                      style={{
                        width: `${16 * fs}px`,
                        height: `${16 * fs}px`,
                        borderRadius: "50%",
                        backgroundColor: "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ color: "#16a34a", fontSize: `${10 * fs}px` }}>✓</span>
                    </div>
                    <span style={{ fontSize: `${12 * fs}px`, color: "#4b5563" }}>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Mutual Benefits */}
          <div
            style={{
              backgroundColor: "#6366f1",
              borderRadius: `${8 * fs}px`,
              padding: `${24 * fs}px`,
              color: "#ffffff",
            }}
          >
            <h3 style={{ fontSize: `${12 * fs}px`, fontWeight: "600", marginBottom: `${16 * fs}px`, opacity: 0.9 }}>
              Mutual Benefits
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: `${10 * fs}px` }}>
              {["Revenue Growth", "Market Expansion", "Innovation Acceleration", "Competitive Advantage"].map(
                (item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: `${8 * fs}px` }}>
                    <div
                      style={{
                        width: `${16 * fs}px`,
                        height: `${16 * fs}px`,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: `${10 * fs}px` }}>→</span>
                    </div>
                    <span style={{ fontSize: `${12 * fs}px` }}>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: `${20 * fs}px` }}>
          {[
            { label: "Partnership Type", value: "Strategic Alliance" },
            { label: "Initial Term", value: safeInfo.timeline || "24 months" },
            { label: "Investment", value: safeInfo.budget || "Joint" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: `${6 * fs}px`,
                padding: `${16 * fs}px`,
                textAlign: "center",
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
                {item.label}
              </p>
              <p style={{ fontSize: `${15 * fs}px`, color: "#111827", fontWeight: "600" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: `${24 * fs}px ${48 * fs}px`,
          borderTop: `1px solid #e5e7eb`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: `${24 * fs}px`,
        }}
      >
        <span style={{ fontSize: `${11 * fs}px`, color: "#9ca3af" }}>{safeBranding.companyName}</span>
        <span style={{ color: "#d1d5db" }}>•</span>
        <span style={{ fontSize: `${11 * fs}px`, color: "#9ca3af" }}>{safeInfo.clientCompany}</span>
        <span style={{ color: "#d1d5db" }}>•</span>
        <span style={{ fontSize: `${11 * fs}px`, color: "#6366f1", fontWeight: "500" }}>Better Together</span>
      </div>
    </div>
  )
}
