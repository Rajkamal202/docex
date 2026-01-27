"use client"

import { EditableText } from "./editable-text"

interface EditableBusinessTemplateProps {
  isFullPreview?: boolean
  content: Record<string, string>
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  enhancingField?: string | null
  currentDate: string
}

export function EditableBusinessTemplate({
  isFullPreview = false,
  content,
  onChange,
  onEnhance,
  enhancingField,
  currentDate,
}: EditableBusinessTemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const brownDark = "#5c4a3d"
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
            <EditableText
              id="titleLine1"
              value={content.titleLine1 || "OUR BUSINESS"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "titleLine1"}
              as="h1"
              style={{
                fontSize: `${36 * fs}px`,
                fontWeight: "bold",
                margin: 0,
                color: beige,
                textTransform: "uppercase",
                letterSpacing: "3px",
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
                fontSize: `${36 * fs}px`,
                fontWeight: "bold",
                margin: 0,
                color: beige,
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            />
          </div>
          <EditableText
            id="companyName"
            value={content.companyName || "LOGO"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "companyName"}
            style={{
              color: beige,
              fontSize: `${16 * fs}px`,
              fontWeight: "bold",
              letterSpacing: "4px",
            }}
          />
        </div>
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
            marginTop: `${20 * fs}px`,
            fontSize: `${13 * fs}px`,
            color: "#d4c4b0",
            maxWidth: "85%",
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Main Content - Two Columns */}
      <div style={{ flex: 1, padding: `${28 * fs}px ${44 * fs}px`, display: "flex", gap: `${28 * fs}px` }}>
        {/* Left Column */}
        <div style={{ flex: 1 }}>
          {/* About Us Box */}
          <div style={{ backgroundColor: beige, padding: `${18 * fs}px`, marginBottom: `${18 * fs}px` }}>
            <EditableText
              id="aboutTitle"
              value={content.aboutTitle || "About us"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "aboutTitle"}
              as="h3"
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "bold",
                color: brownDark,
                marginBottom: `${10 * fs}px`,
                borderBottom: `3px solid ${brownDark}`,
                paddingBottom: `${6 * fs}px`,
                display: "inline-block",
              }}
            />
            <EditableText
              id="about"
              value={
                content.about ||
                "We are a renowned company with a track record of delivering high-quality solutions for various clients across different industries."
              }
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "about"}
              multiline
              style={{ fontSize: `${12 * fs}px`, color: "#555", margin: 0, lineHeight: 1.7 }}
            />
          </div>

          {/* Our Progress Box */}
          <div style={{ backgroundColor: beige, padding: `${18 * fs}px`, marginBottom: `${18 * fs}px` }}>
            <EditableText
              id="progressTitle"
              value={content.progressTitle || "Our Progress"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "progressTitle"}
              as="h3"
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
            />
            <EditableText
              id="progress"
              value={
                content.progress ||
                "Our solution is designed to enhance operations, increase efficiency, and improve overall performance through strategic initiatives."
              }
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "progress"}
              multiline
              style={{ fontSize: `${12 * fs}px`, color: "#555", margin: 0, lineHeight: 1.7 }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }}>
          {/* Problem Box */}
          <div style={{ backgroundColor: beige, padding: `${18 * fs}px`, marginBottom: `${18 * fs}px` }}>
            <EditableText
              id="problemTitle"
              value={content.problemTitle || "The Challenge"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "problemTitle"}
              as="h3"
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "bold",
                color: brownDark,
                marginBottom: `${10 * fs}px`,
                borderBottom: `3px solid ${brownDark}`,
                paddingBottom: `${6 * fs}px`,
                display: "inline-block",
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
              style={{ fontSize: `${12 * fs}px`, color: "#555", margin: 0, lineHeight: 1.7 }}
            />
          </div>

          {/* Investment Box */}
          <div style={{ backgroundColor: brownDark, padding: `${18 * fs}px`, color: "white" }}>
            <EditableText
              id="investmentTitle"
              value={content.investmentTitle || "Investment"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "investmentTitle"}
              as="h3"
              style={{
                fontSize: `${15 * fs}px`,
                fontWeight: "bold",
                color: beige,
                marginBottom: `${10 * fs}px`,
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
                color: "white",
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
                color: "#d4c4b0",
                marginTop: `${8 * fs}px`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: brownDark,
          padding: `${16 * fs}px ${44 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <EditableText
          id="footerCompany"
          value={content.footerCompany || "Your Company Name"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "footerCompany"}
          style={{ fontSize: `${12 * fs}px`, color: beige }}
        />
        <EditableText
          id="footerContact"
          value={content.footerContact || "contact@company.com"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "footerContact"}
          style={{ fontSize: `${12 * fs}px`, color: "#d4c4b0" }}
        />
      </div>
    </div>
  )
}
