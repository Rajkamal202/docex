"use client"

import { EditableText } from "./editable-text"

interface EditableModernTemplateProps {
  isFullPreview?: boolean
  content: Record<string, string>
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  enhancingField?: string | null
  currentDate: string
}

export function EditableModernTemplate({
  isFullPreview = false,
  content,
  onChange,
  onEnhance,
  enhancingField,
  currentDate,
}: EditableModernTemplateProps) {
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

        <EditableText
          id="titleLine1"
          value={content.titleLine1 || "BUSINESS"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "titleLine1"}
          as="h1"
          style={{
            fontSize: `${56 * fs}px`,
            fontWeight: "900",
            color: darkTeal,
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-2px",
          }}
        />
        <EditableText
          id="titleLine2"
          value={content.titleLine2 || "PROPOSAL"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "titleLine2"}
          as="h1"
          style={{
            fontSize: `${56 * fs}px`,
            fontWeight: "900",
            color: darkTeal,
            margin: 0,
            lineHeight: 0.95,
            letterSpacing: "-2px",
          }}
        />

        <EditableText
          id="summary"
          value={
            content.summary ||
            "This proposal outlines a streamlined solution designed to address key business challenges and drive growth."
          }
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "summary"}
          multiline
          style={{
            fontSize: `${12 * fs}px`,
            color: "#555",
            marginTop: `${20 * fs}px`,
            lineHeight: 1.7,
            maxWidth: "90%",
          }}
        />
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
          <EditableText
            id="problemTitle"
            value={content.problemTitle || "PROBLEM STATEMENT"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "problemTitle"}
            as="h3"
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          />
          <EditableText
            id="problem"
            value={
              content.problem ||
              "Businesses today face challenges such as inefficiencies, rising costs, and evolving market demands."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "problem"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}
          />
        </div>

        {/* Solution */}
        <div>
          <EditableText
            id="solutionTitle"
            value={content.solutionTitle || "SOLUTION"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "solutionTitle"}
            as="h3"
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          />
          <EditableText
            id="solution"
            value={
              content.solution ||
              "Our solution is designed to enhance operations, increase efficiency, and improve overall performance."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "solution"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}
          />
        </div>

        {/* Market Opportunity */}
        <div>
          <EditableText
            id="marketTitle"
            value={content.marketTitle || "MARKET OPPORTUNITY"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "marketTitle"}
            as="h3"
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          />
          <EditableText
            id="market"
            value={
              content.market ||
              "With industry trends shifting rapidly, adopting a flexible and forward-thinking model is essential."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "market"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}
          />
        </div>

        {/* Financial Summary */}
        <div>
          <EditableText
            id="financialTitle"
            value={content.financialTitle || "FINANCIAL SUMMARY"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "financialTitle"}
            as="h3"
            style={{
              fontSize: `${15 * fs}px`,
              fontWeight: "bold",
              color: darkTeal,
              marginBottom: `${12 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          />
          <EditableText
            id="financial"
            value={
              content.financial ||
              "Our pricing model is transparent and scalable. Investment starts at competitive rates."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "financial"}
            multiline
            style={{ fontSize: `${12 * fs}px`, color: "#555", lineHeight: 1.7, margin: 0 }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: darkTeal,
          padding: `${24 * fs}px ${40 * fs}px`,
          marginTop: `${32 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <EditableText
          id="companyName"
          value={content.companyName || "Your Company"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "companyName"}
          style={{ fontSize: `${14 * fs}px`, fontWeight: "bold", color: "white", letterSpacing: "1px" }}
        />
        <EditableText
          id="contactInfo"
          value={content.contactInfo || "contact@company.com | www.company.com"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "contactInfo"}
          style={{ fontSize: `${11 * fs}px`, color: "rgba(255,255,255,0.8)" }}
        />
      </div>
    </div>
  )
}
