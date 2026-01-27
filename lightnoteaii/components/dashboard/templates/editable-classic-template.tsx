"use client"

import { EditableText } from "./editable-text"

interface EditableClassicTemplateProps {
  isFullPreview?: boolean
  content: Record<string, string>
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  enhancingField?: string | null
  currentDate: string
}

export function EditableClassicTemplate({
  isFullPreview = false,
  content,
  onChange,
  onEnhance,
  enhancingField,
  currentDate,
}: EditableClassicTemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const sageGreen = "#d4ddd9"
  const darkGreen = "#2d4a47"
  const goldAccent = "#c9a227"
  const orangeAccent = "#c45c3e"

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
        {/* Orange accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: `${100 * fs}px`,
            width: `${8 * fs}px`,
            height: `${120 * fs}px`,
            backgroundColor: orangeAccent,
          }}
        />

        {/* Company Name & Date */}
        <div style={{ textAlign: "center", marginBottom: `${32 * fs}px` }}>
          <EditableText
            id="companyName"
            value={content.companyName || "YOUR COMPANY"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "companyName"}
            as="h2"
            style={{
              fontSize: `${18 * fs}px`,
              fontWeight: "bold",
              color: darkGreen,
              margin: 0,
              letterSpacing: "1px",
            }}
          />
          <p style={{ fontSize: `${12 * fs}px`, color: "#5a7a6f", marginTop: `${8 * fs}px` }}>{currentDate}</p>
        </div>

        {/* Title Block with gold accent */}
        <div style={{ marginBottom: `${40 * fs}px`, paddingLeft: `${16 * fs}px` }}>
          <div style={{ display: "flex", alignItems: "stretch" }}>
            <div
              style={{
                width: `${8 * fs}px`,
                backgroundColor: goldAccent,
                marginRight: `${16 * fs}px`,
                borderRadius: "2px",
                minHeight: `${100 * fs}px`,
              }}
            />
            <div>
              <EditableText
                id="titleLine1"
                value={content.titleLine1 || "ONE PAGE"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "titleLine1"}
                as="h1"
                style={{
                  fontSize: `${32 * fs}px`,
                  fontWeight: "800",
                  color: darkGreen,
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              />
              <EditableText
                id="titleLine2"
                value={content.titleLine2 || "BUSINESS"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "titleLine2"}
                as="h1"
                style={{
                  fontSize: `${32 * fs}px`,
                  fontWeight: "800",
                  color: darkGreen,
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              />
              <EditableText
                id="titleLine3"
                value={content.titleLine3 || "PROPOSAL"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "titleLine3"}
                as="h1"
                style={{
                  fontSize: `${32 * fs}px`,
                  fontWeight: "800",
                  color: darkGreen,
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: "-1px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Prepared For Section */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <p style={{ fontSize: `${11 * fs}px`, color: "#5a7a6f", marginBottom: `${6 * fs}px` }}>Prepared for:</p>
          <EditableText
            id="clientName"
            value={content.clientName || "John Smith"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "clientName"}
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              margin: 0,
              marginBottom: `${2 * fs}px`,
            }}
          />
          <EditableText
            id="clientCompany"
            value={content.clientCompany || "Acme Corporation"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "clientCompany"}
            style={{ fontSize: `${13 * fs}px`, color: "#555" }}
          />
        </div>

        {/* Prepared By Section */}
        <div>
          <p style={{ fontSize: `${11 * fs}px`, color: "#5a7a6f", marginBottom: `${6 * fs}px` }}>Prepared by:</p>
          <EditableText
            id="yourName"
            value={content.yourName || "Jane Doe"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "yourName"}
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: "#333",
              margin: 0,
            }}
          />
          <EditableText
            id="yourTitle"
            value={content.yourTitle || "Senior Consultant"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "yourTitle"}
            style={{ fontSize: `${13 * fs}px`, color: "#555" }}
          />
        </div>
      </div>

      {/* Right Content Area */}
      <div style={{ flex: 1, padding: `${40 * fs}px ${32 * fs}px` }}>
        {/* Executive Summary */}
        <div style={{ marginBottom: `${28 * fs}px` }}>
          <EditableText
            id="summaryTitle"
            value={content.summaryTitle || "Executive Summary"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "summaryTitle"}
            as="h3"
            style={{
              fontSize: `${16 * fs}px`,
              fontWeight: "bold",
              color: darkGreen,
              marginBottom: `${12 * fs}px`,
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: `${6 * fs}px`,
              display: "inline-block",
            }}
          />
          <EditableText
            id="summary"
            value={
              content.summary ||
              "We are pleased to present this comprehensive proposal for your organization. Our approach focuses on delivering measurable results through strategic planning."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "summary"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7 }}
          />
        </div>

        {/* Problem Statement */}
        <div style={{ marginBottom: `${28 * fs}px` }}>
          <EditableText
            id="problemTitle"
            value={content.problemTitle || "The Challenge"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "problemTitle"}
            as="h3"
            style={{
              fontSize: `${16 * fs}px`,
              fontWeight: "bold",
              color: darkGreen,
              marginBottom: `${12 * fs}px`,
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: `${6 * fs}px`,
              display: "inline-block",
            }}
          />
          <EditableText
            id="problem"
            value={
              content.problem ||
              "Your organization faces significant challenges in the current market landscape. We understand the complexities involved."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "problem"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7 }}
          />
        </div>

        {/* Solution */}
        <div style={{ marginBottom: `${28 * fs}px` }}>
          <EditableText
            id="solutionTitle"
            value={content.solutionTitle || "Our Solution"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "solutionTitle"}
            as="h3"
            style={{
              fontSize: `${16 * fs}px`,
              fontWeight: "bold",
              color: darkGreen,
              marginBottom: `${12 * fs}px`,
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: `${6 * fs}px`,
              display: "inline-block",
            }}
          />
          <EditableText
            id="solution"
            value={
              content.solution ||
              "Our comprehensive solution addresses your core business needs through a multi-phase approach leveraging industry best practices."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "solution"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7 }}
          />
        </div>

        {/* Investment */}
        <div
          style={{
            backgroundColor: sageGreen,
            padding: `${20 * fs}px`,
            borderRadius: `${4 * fs}px`,
          }}
        >
          <EditableText
            id="investmentTitle"
            value={content.investmentTitle || "Investment"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "investmentTitle"}
            as="h3"
            style={{
              fontSize: `${14 * fs}px`,
              fontWeight: "bold",
              color: darkGreen,
              marginBottom: `${8 * fs}px`,
            }}
          />
          <EditableText
            id="budget"
            value={content.budget || "$10,000 - $25,000"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "budget"}
            style={{
              fontSize: `${24 * fs}px`,
              fontWeight: "bold",
              color: darkGreen,
            }}
          />
          <EditableText
            id="timeline"
            value={content.timeline || "Timeline: 3-6 months"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "timeline"}
            style={{
              fontSize: `${12 * fs}px`,
              color: "#555",
              marginTop: `${8 * fs}px`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
