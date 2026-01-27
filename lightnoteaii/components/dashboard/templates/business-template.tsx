"use client"

import type { TemplateProps } from "./types"

export function BusinessTemplate({ isFullPreview = false, safeInfo, safeBranding, sections }: TemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const brownDark = "#5c4a3d"
  const brownMedium = "#7a6555"
  const beige = "#e8dfd4"
  const cream = "#f5f0e8"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: cream,
        fontFamily: "'Arial', sans-serif",
        fontSize: `${14 * fs}px`,
        lineHeight: 1.5,
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brown Header */}
      <div
        style={{
          backgroundColor: brownDark,
          padding: `${36 * fs}px ${44 * fs}px`,
          color: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1
              style={{
                fontSize: `${36 * fs}px`,
                fontWeight: "bold",
                margin: 0,
                color: beige,
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              OUR BUSINESS
            </h1>
            <h1
              style={{
                fontSize: `${36 * fs}px`,
                fontWeight: "bold",
                margin: 0,
                color: beige,
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              PROPOSAL
            </h1>
          </div>
          {/* Logo */}
          <div
            style={{
              color: beige,
              fontSize: `${16 * fs}px`,
              fontWeight: "bold",
              letterSpacing: "4px",
            }}
          >
            {safeInfo.logo ? (
              <img
                src={safeInfo.logo || "/placeholder.svg"}
                alt="Logo"
                style={{ height: `${48 * fs}px`, width: "auto" }}
              />
            ) : (
              "LOGO"
            )}
          </div>
        </div>
        <p
          style={{
            marginTop: `${20 * fs}px`,
            fontSize: `${13 * fs}px`,
            color: "#d4c4b0",
            maxWidth: "85%",
            lineHeight: 1.6,
          }}
        >
          {sections?.SUMMARY ||
            "This proposal outlines a streamlined solution designed to address key business challenges and drive growth. Our approach leverages industry expertise."}
        </p>
      </div>

      {/* Main Content - Two Columns */}
      <div style={{ flex: 1, padding: `${28 * fs}px ${44 * fs}px`, display: "flex", gap: `${28 * fs}px` }}>
        {/* Left Column */}
        <div style={{ flex: 1 }}>
          {/* About Us Box */}
          <div
            style={{
              backgroundColor: beige,
              padding: `${18 * fs}px`,
              marginBottom: `${18 * fs}px`,
            }}
          >
            <h3
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "bold",
                color: brownDark,
                marginBottom: `${10 * fs}px`,
                borderBottom: `3px solid ${brownDark}`,
                paddingBottom: `${6 * fs}px`,
                display: "inline-block",
              }}
            >
              About us
            </h3>
            <p style={{ fontSize: `${12 * fs}px`, color: "#555", margin: 0, lineHeight: 1.7 }}>
              {safeBranding.companyName} is a renowned company with a track record of delivering high-quality solutions
              for various clients across different industries. With a team of experienced professionals, we specialize
              in creating engaging solutions.
            </p>
          </div>

          {/* Our Progress Box */}
          <div
            style={{
              backgroundColor: beige,
              padding: `${18 * fs}px`,
              marginBottom: `${18 * fs}px`,
            }}
          >
            <h3
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "bold",
                fontStyle: "italic",
                color: brownDark,
                marginBottom: `${10 * fs}px`,
                borderBottom: `3px solid ${brownDark}`,
                paddingBottom: `${6 * fs}px`,
                display: "inline-block",
              }}
            >
              Our Progress
            </h3>
            <p style={{ fontSize: `${12 * fs}px`, color: "#555", margin: 0, lineHeight: 1.7 }}>
              {sections?.SOLUTION ||
                "Our solution is designed to enhance operations, increase efficiency, and improve overall performance. By implementing best practices we help optimize workflows."}
            </p>
          </div>

          {/* Values and Mission Box */}
          <div
            style={{
              backgroundColor: beige,
              padding: `${18 * fs}px`,
              marginBottom: `${24 * fs}px`,
            }}
          >
            <h3
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "bold",
                color: brownDark,
                marginBottom: `${10 * fs}px`,
                borderBottom: `3px solid ${brownDark}`,
                paddingBottom: `${6 * fs}px`,
                display: "inline-block",
              }}
            >
              Values and Mission
            </h3>
            <p style={{ fontSize: `${12 * fs}px`, color: "#555", margin: 0, lineHeight: 1.7 }}>
              {safeInfo.uniqueValue ||
                "We are committed to delivering excellence, innovation, and measurable results for every client we serve. Our mission drives everything we do."}
            </p>
          </div>

          {/* Numbered Steps */}
          <div style={{ marginTop: `${20 * fs}px` }}>
            {[
              { num: "01", text: "Strategic planning and comprehensive analysis of requirements" },
              { num: "02", text: "Implementation, execution, and quality assurance" },
              { num: "03", text: "Review, optimization, and continuous improvement" },
            ].map((item) => (
              <div key={item.num} style={{ display: "flex", alignItems: "flex-start", marginBottom: `${16 * fs}px` }}>
                <span
                  style={{
                    fontSize: `${28 * fs}px`,
                    fontWeight: "bold",
                    color: brownMedium,
                    marginRight: `${14 * fs}px`,
                    lineHeight: 1,
                    minWidth: `${40 * fs}px`,
                  }}
                >
                  {item.num}
                </span>
                <div
                  style={{
                    borderLeft: `3px solid ${brownDark}`,
                    paddingLeft: `${14 * fs}px`,
                    paddingTop: `${4 * fs}px`,
                  }}
                >
                  <p style={{ fontSize: `${11 * fs}px`, color: "#555", margin: 0, lineHeight: 1.6 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }}>
          {/* Quote Box */}
          <div
            style={{
              backgroundColor: brownDark,
              padding: `${24 * fs}px`,
              marginBottom: `${20 * fs}px`,
              color: "white",
            }}
          >
            <span style={{ fontSize: `${40 * fs}px`, color: beige, lineHeight: 0.5, display: "block" }}>"</span>
            <p
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "500",
                margin: `${12 * fs}px 0 0 0`,
                lineHeight: 1.7,
                color: "#f5f0e8",
              }}
            >
              {sections?.["PROBLEM STATEMENT"]?.slice(0, 180) ||
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore."}
            </p>
          </div>

          {/* Metrics Section */}
          <div
            style={{
              backgroundColor: beige,
              padding: `${20 * fs}px`,
            }}
          >
            <h3
              style={{
                fontSize: `${20 * fs}px`,
                fontWeight: "bold",
                color: brownDark,
                marginBottom: `${8 * fs}px`,
              }}
            >
              Mobile
            </h3>
            <p style={{ fontSize: `${11 * fs}px`, color: "#555", marginBottom: `${20 * fs}px`, lineHeight: 1.6 }}>
              {sections?.["FINANCIAL SUMMARY"]?.slice(0, 120) ||
                "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."}
            </p>

            {/* Progress Bars */}
            {[
              { label: "50", value: 50 },
              { label: "70", value: 70 },
              { label: "60", value: 60 },
            ].map((metric, idx) => (
              <div key={idx} style={{ marginBottom: `${16 * fs}px` }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: `${6 * fs}px` }}>
                  <span style={{ fontSize: `${18 * fs}px`, fontStyle: "italic", color: brownDark, fontWeight: "500" }}>
                    {metric.label} %
                  </span>
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    height: `${10 * fs}px`,
                    border: `1px solid ${brownDark}`,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: brownDark,
                      height: "100%",
                      width: `${metric.value}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brown Footer */}
      <div
        style={{
          backgroundColor: brownDark,
          padding: `${20 * fs}px ${44 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        <p style={{ fontSize: `${16 * fs}px`, fontWeight: "bold", margin: 0, color: beige }}>
          Lorem ipsum dolor
          <br />
          sit amet.
        </p>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: `${14 * fs}px`, margin: 0, fontWeight: "500" }}>+123 123 123</p>
          <p style={{ fontSize: `${14 * fs}px`, margin: 0, fontWeight: "500" }}>www.website.com</p>
        </div>
      </div>
    </div>
  )
}
