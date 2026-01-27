"use client"

import type { TemplateProps } from "./types"

export function StartupTemplate({
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
        backgroundColor: "#fafafa",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      {/* Gradient Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          padding: `${48 * fs}px ${48 * fs}px ${56 * fs}px`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: `-${60 * fs}px`,
            right: `-${40 * fs}px`,
            width: `${200 * fs}px`,
            height: `${200 * fs}px`,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: `-${80 * fs}px`,
            left: `${20 * fs}px`,
            width: `${160 * fs}px`,
            height: `${160 * fs}px`,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: `${32 * fs}px`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: `${10 * fs}px` }}>
              {safeInfo.logo ? (
                <img
                  src={safeInfo.logo || "/placeholder.svg"}
                  alt="Logo"
                  style={{ height: `${28 * fs}px`, width: "auto" }}
                />
              ) : (
                <div
                  style={{
                    width: `${32 * fs}px`,
                    height: `${32 * fs}px`,
                    borderRadius: `${8 * fs}px`,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ color: "white", fontSize: `${16 * fs}px`, fontWeight: "700" }}>
                    {safeBranding.companyName.charAt(0)}
                  </span>
                </div>
              )}
              <span style={{ color: "white", fontSize: `${15 * fs}px`, fontWeight: "600" }}>
                {safeBranding.companyName}
              </span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: `${12 * fs}px` }}>{currentDate}</span>
          </div>

          <span
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "white",
              fontSize: `${11 * fs}px`,
              fontWeight: "500",
              padding: `${6 * fs}px ${14 * fs}px`,
              borderRadius: `${20 * fs}px`,
              marginBottom: `${16 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {safeInfo.proposalType || "SaaS Proposal"}
          </span>

          <h1
            style={{
              fontSize: `${36 * fs}px`,
              fontWeight: "700",
              color: "white",
              margin: 0,
              lineHeight: 1.2,
              marginBottom: `${12 * fs}px`,
            }}
          >
            Partnership Proposal
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: `${14 * fs}px`, margin: 0, maxWidth: "600px" }}>
            Prepared for {safeInfo.clientName} at {safeInfo.clientCompany}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${40 * fs}px ${48 * fs}px` }}>
        {/* Executive Summary Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: `${12 * fs}px`,
            padding: `${28 * fs}px`,
            marginBottom: `${24 * fs}px`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              fontSize: `${13 * fs}px`,
              fontWeight: "600",
              color: "#6366f1",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: `${12 * fs}px`,
            }}
          >
            Executive Summary
          </h2>
          <p style={{ fontSize: `${13 * fs}px`, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>
            {sections?.SUMMARY ||
              "We're excited to present this partnership opportunity. Our solution combines cutting-edge technology with user-centric design to deliver measurable results. This proposal outlines how we can help accelerate your growth and achieve your strategic objectives."}
          </p>
        </div>

        {/* Two Column Grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${24 * fs}px`, marginBottom: `${24 * fs}px` }}
        >
          {/* The Challenge */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: `${12 * fs}px`,
              padding: `${24 * fs}px`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: `${36 * fs}px`,
                height: `${36 * fs}px`,
                borderRadius: `${8 * fs}px`,
                backgroundColor: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: `${14 * fs}px`,
              }}
            >
              <span style={{ fontSize: `${18 * fs}px` }}>⚡</span>
            </div>
            <h3 style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: "#111827", marginBottom: `${10 * fs}px` }}>
              The Challenge
            </h3>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
              {sections?.["PROBLEM STATEMENT"] ||
                safeInfo.problem ||
                "Modern businesses face increasing pressure to scale efficiently while maintaining quality and customer satisfaction."}
            </p>
          </div>

          {/* Our Solution */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: `${12 * fs}px`,
              padding: `${24 * fs}px`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: `${36 * fs}px`,
                height: `${36 * fs}px`,
                borderRadius: `${8 * fs}px`,
                backgroundColor: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: `${14 * fs}px`,
              }}
            >
              <span style={{ fontSize: `${18 * fs}px` }}>🚀</span>
            </div>
            <h3 style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: "#111827", marginBottom: `${10 * fs}px` }}>
              Our Solution
            </h3>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
              {sections?.SOLUTION ||
                "A comprehensive platform that automates workflows, enhances collaboration, and provides actionable insights for data-driven decisions."}
            </p>
          </div>
        </div>

        {/* Timeline & Investment */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${24 * fs}px` }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: `${12 * fs}px`,
              padding: `${24 * fs}px`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                fontSize: `${13 * fs}px`,
                fontWeight: "600",
                color: "#6366f1",
                marginBottom: `${16 * fs}px`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Timeline
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: `${12 * fs}px` }}>
              {["Discovery & Planning", "Development Phase", "Testing & Launch"].map((phase, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px` }}>
                  <div
                    style={{
                      width: `${24 * fs}px`,
                      height: `${24 * fs}px`,
                      borderRadius: "50%",
                      backgroundColor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: `${11 * fs}px`,
                      fontWeight: "600",
                      color: "#6366f1",
                    }}
                  >
                    {i + 1}
                  </div>
                  <span style={{ fontSize: `${12 * fs}px`, color: "#374151" }}>{phase}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: `${12 * fs}px`, color: "#6b7280", marginTop: `${16 * fs}px` }}>
              Total: {safeInfo.timeline || "8-12 weeks"}
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#6366f1",
              borderRadius: `${12 * fs}px`,
              padding: `${24 * fs}px`,
              color: "white",
            }}
          >
            <h3
              style={{
                fontSize: `${13 * fs}px`,
                fontWeight: "600",
                marginBottom: `${16 * fs}px`,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                opacity: 0.9,
              }}
            >
              Investment
            </h3>
            <p style={{ fontSize: `${28 * fs}px`, fontWeight: "700", marginBottom: `${8 * fs}px` }}>
              {safeInfo.budget || "$25,000"}
            </p>
            <p style={{ fontSize: `${12 * fs}px`, opacity: 0.85, lineHeight: 1.6 }}>
              Includes all deliverables, support, and 30-day post-launch optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: `${20 * fs}px ${48 * fs}px`,
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: `${11 * fs}px`, color: "#9ca3af" }}>{safeBranding.companyName} • Confidential</span>
        <span style={{ fontSize: `${11 * fs}px`, color: "#9ca3af" }}>Page 1 of 1</span>
      </div>
    </div>
  )
}
