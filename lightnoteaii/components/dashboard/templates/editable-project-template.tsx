"use client"

import { EditableText } from "./editable-text"

interface EditableProjectTemplateProps {
  isFullPreview?: boolean
  content: Record<string, string>
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  enhancingField?: string | null
  currentDate: string
}

export function EditableProjectTemplate({
  isFullPreview = false,
  content,
  onChange,
  onEnhance,
  enhancingField,
  currentDate,
}: EditableProjectTemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const sageGreen = "#c8d5c8"
  const darkGreen = "#2d4a3e"

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        display: "flex",
        fontFamily: "'Georgia', serif",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Left Panel - Sage Green */}
      <div
        style={{
          width: "45%",
          backgroundColor: sageGreen,
          padding: `${48 * fs}px ${36 * fs}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand Name */}
        <div style={{ display: "flex", alignItems: "center", gap: `${10 * fs}px`, marginBottom: `${80 * fs}px` }}>
          <span style={{ color: darkGreen, fontSize: `${20 * fs}px` }}>◆</span>
          <EditableText
            id="brandName"
            value={content.brandName || "Brandname"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "brandName"}
            style={{
              fontSize: `${18 * fs}px`,
              fontWeight: "600",
              color: darkGreen,
              letterSpacing: "1px",
            }}
          />
        </div>

        {/* Title - Cursive Style */}
        <div style={{ flex: 1 }}>
          <EditableText
            id="titleLine1"
            value={content.titleLine1 || "Project"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "titleLine1"}
            as="h1"
            style={{
              fontSize: `${64 * fs}px`,
              fontWeight: "400",
              color: darkGreen,
              margin: 0,
              lineHeight: 1,
              fontStyle: "italic",
              fontFamily: "'Georgia', serif",
            }}
          />
          <EditableText
            id="titleLine2"
            value={content.titleLine2 || "Proposal"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "titleLine2"}
            as="h1"
            style={{
              fontSize: `${64 * fs}px`,
              fontWeight: "400",
              color: darkGreen,
              margin: 0,
              lineHeight: 1,
              fontStyle: "italic",
              fontFamily: "'Georgia', serif",
            }}
          />
          <EditableText
            id="projectType"
            value={content.projectType || "Environment Video Production"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "projectType"}
            style={{
              fontSize: `${14 * fs}px`,
              color: darkGreen,
              marginTop: `${20 * fs}px`,
              opacity: 0.8,
            }}
          />
        </div>

        {/* Footer - Presented To/By */}
        <div style={{ display: "flex", gap: `${40 * fs}px`, marginTop: "auto" }}>
          <div>
            <p
              style={{
                fontSize: `${10 * fs}px`,
                color: darkGreen,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: `${6 * fs}px`,
                opacity: 0.7,
              }}
            >
              PRESENTED TO:
            </p>
            <EditableText
              id="clientName"
              value={content.clientName || "Client Name"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "clientName"}
              style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: darkGreen, margin: 0 }}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: `${10 * fs}px`,
                color: darkGreen,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: `${6 * fs}px`,
                opacity: 0.7,
              }}
            >
              PRESENTED BY:
            </p>
            <EditableText
              id="companyName"
              value={content.companyName || "Your Company"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "companyName"}
              style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: darkGreen, margin: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - White with Content */}
      <div style={{ flex: 1, backgroundColor: "white", padding: `${48 * fs}px ${36 * fs}px` }}>
        {/* Introduction */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <EditableText
            id="introTitle"
            value={content.introTitle || "Introduction"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "introTitle"}
            as="h2"
            style={{
              fontSize: `${20 * fs}px`,
              fontWeight: "600",
              color: darkGreen,
              marginBottom: `${12 * fs}px`,
            }}
          />
          <EditableText
            id="intro"
            value={
              content.intro ||
              "We are pleased to present this comprehensive project proposal. Our team brings extensive experience and innovative solutions to deliver exceptional results."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "intro"}
            multiline
            style={{ fontSize: `${13 * fs}px`, color: "#555", lineHeight: 1.7 }}
          />
        </div>

        {/* Project Scope */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <EditableText
            id="scopeTitle"
            value={content.scopeTitle || "Project Scope"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "scopeTitle"}
            as="h2"
            style={{
              fontSize: `${20 * fs}px`,
              fontWeight: "600",
              color: darkGreen,
              marginBottom: `${12 * fs}px`,
            }}
          />
          <EditableText
            id="scope"
            value={
              content.scope ||
              "The project encompasses comprehensive planning, execution, and delivery of high-quality deliverables aligned with your objectives."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "scope"}
            multiline
            style={{ fontSize: `${13 * fs}px`, color: "#555", lineHeight: 1.7 }}
          />
        </div>

        {/* Timeline & Budget */}
        <div
          style={{
            backgroundColor: sageGreen,
            padding: `${24 * fs}px`,
            borderRadius: `${8 * fs}px`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: `${16 * fs}px` }}>
            <div>
              <p style={{ fontSize: `${11 * fs}px`, color: darkGreen, opacity: 0.7, marginBottom: `${4 * fs}px` }}>
                TIMELINE
              </p>
              <EditableText
                id="timeline"
                value={content.timeline || "3-6 months"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "timeline"}
                style={{ fontSize: `${18 * fs}px`, fontWeight: "600", color: darkGreen }}
              />
            </div>
            <div>
              <p style={{ fontSize: `${11 * fs}px`, color: darkGreen, opacity: 0.7, marginBottom: `${4 * fs}px` }}>
                INVESTMENT
              </p>
              <EditableText
                id="budget"
                value={content.budget || "$10,000 - $25,000"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "budget"}
                style={{ fontSize: `${18 * fs}px`, fontWeight: "600", color: darkGreen }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
