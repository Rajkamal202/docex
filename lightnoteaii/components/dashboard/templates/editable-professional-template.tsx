"use client"

import { EditableText } from "./editable-text"

interface EditableTemplateProps {
  isFullPreview?: boolean
  content: Record<string, string>
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  enhancingField?: string | null
  currentDate: string
}

export function EditableProfessionalTemplate({
  isFullPreview = false,
  content,
  onChange,
  onEnhance,
  enhancingField,
  currentDate,
}: EditableTemplateProps) {
  const fs = isFullPreview ? 1 : 0.85

  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "auto",
        backgroundColor: "white",
        fontFamily: "'Arial', sans-serif",
        fontSize: `${14 * fs}px`,
        display: "flex",
        flexDirection: "column",
        boxShadow: isFullPreview ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* Black Header Bar */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: `${20 * fs}px ${40 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px` }}>
          <div
            style={{
              width: `${28 * fs}px`,
              height: `${28 * fs}px`,
              borderRadius: "50%",
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditableText
              id="logoLetter"
              value={content.logoLetter || "C"}
              onChange={onChange}
              style={{ color: "white", fontSize: `${14 * fs}px`, fontWeight: "bold", margin: 0 }}
              as="span"
            />
          </div>
          <EditableText
            id="companyName"
            value={content.companyName || "CONTOSO"}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "companyName"}
            style={{
              color: "white",
              fontSize: `${16 * fs}px`,
              fontWeight: "bold",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
            }}
            as="span"
          />
        </div>
        <span style={{ color: "white", fontSize: `${13 * fs}px` }}>{currentDate}</span>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: `${40 * fs}px` }}>
        {/* Large Title */}
        <EditableText
          id="titleLine1"
          value={content.titleLine1 || "B2B BUSINESS"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "titleLine1"}
          style={{
            fontSize: `${48 * fs}px`,
            fontWeight: "900",
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1.05,
            letterSpacing: "-2px",
          }}
          as="h1"
        />
        <EditableText
          id="titleLine2"
          value={content.titleLine2 || "PROPOSAL"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "titleLine2"}
          style={{
            fontSize: `${48 * fs}px`,
            fontWeight: "900",
            color: "#1a1a1a",
            margin: 0,
            marginBottom: `${40 * fs}px`,
            lineHeight: 1.05,
            letterSpacing: "-2px",
          }}
          as="h1"
        />

        {/* Two Column Layout */}
        <div style={{ display: "flex", gap: `${40 * fs}px` }}>
          {/* Left Column - Contact Info */}
          <div style={{ width: "28%" }}>
            {/* Prepared For */}
            <div style={{ marginBottom: `${32 * fs}px` }}>
              <p style={{ fontSize: `${11 * fs}px`, color: "#888", marginBottom: `${8 * fs}px` }}>Prepared for:</p>
              <EditableText
                id="clientName"
                value={content.clientName || "Client Name"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "clientName"}
                style={{
                  fontSize: `${14 * fs}px`,
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  margin: 0,
                }}
                as="p"
              />
              <EditableText
                id="clientCompany"
                value={content.clientCompany || "Company Name"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "clientCompany"}
                style={{
                  fontSize: `${13 * fs}px`,
                  fontWeight: "600",
                  color: "#333",
                  margin: 0,
                  marginBottom: `${12 * fs}px`,
                }}
                as="p"
              />
              <div style={{ fontSize: `${11 * fs}px`, color: "#666", lineHeight: 1.8 }}>
                <EditableText
                  id="clientEmail"
                  value={content.clientEmail || "client@company.com"}
                  onChange={onChange}
                  style={{ margin: 0 }}
                  as="p"
                />
                <EditableText
                  id="clientWebsite"
                  value={content.clientWebsite || "www.company.com"}
                  onChange={onChange}
                  style={{ margin: 0 }}
                  as="p"
                />
                <EditableText
                  id="clientPhone"
                  value={content.clientPhone || "698-555-0133"}
                  onChange={onChange}
                  style={{ margin: 0 }}
                  as="p"
                />
                <EditableText
                  id="clientAddress1"
                  value={content.clientAddress1 || "123 Business Ave,"}
                  onChange={onChange}
                  style={{ margin: 0 }}
                  as="p"
                />
                <EditableText
                  id="clientAddress2"
                  value={content.clientAddress2 || "City, ST 12345"}
                  onChange={onChange}
                  style={{ margin: 0 }}
                  as="p"
                />
              </div>
            </div>

            {/* Vertical Connector Line */}
            <div
              style={{
                borderLeft: "1px solid #ddd",
                height: `${80 * fs}px`,
                marginLeft: `${4 * fs}px`,
                marginBottom: `${32 * fs}px`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  left: "-4px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#ddd",
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-4px",
                  left: "-4px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#ddd",
                  borderRadius: "50%",
                }}
              />
            </div>

            {/* Prepared By */}
            <div>
              <p style={{ fontSize: `${11 * fs}px`, color: "#888", marginBottom: `${8 * fs}px` }}>Prepared by:</p>
              <EditableText
                id="yourName"
                value={content.yourName || "Your Name"}
                onChange={onChange}
                style={{
                  fontSize: `${14 * fs}px`,
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  margin: 0,
                }}
                as="p"
              />
              <EditableText
                id="yourTitle"
                value={content.yourTitle || "Your Title"}
                onChange={onChange}
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#666",
                  margin: 0,
                }}
                as="p"
              />
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div style={{ flex: 1 }}>
            {/* Executive Summary */}
            <div style={{ marginBottom: `${32 * fs}px` }}>
              <EditableText
                id="summaryTitle"
                value={content.summaryTitle || "Executive Summary"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "summaryTitle"}
                style={{
                  fontSize: `${18 * fs}px`,
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  marginBottom: `${12 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: `${8 * fs}px`,
                }}
                as="h2"
              />
              <EditableText
                id="summary"
                value={
                  content.summary ||
                  "We are pleased to present this comprehensive proposal for [Company Name]. Our approach focuses on delivering measurable results through strategic planning and innovative solutions tailored to your specific needs."
                }
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "summary"}
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#444",
                  lineHeight: 1.7,
                  margin: 0,
                }}
                as="p"
                multiline
              />
            </div>

            {/* Problem Statement */}
            <div style={{ marginBottom: `${32 * fs}px` }}>
              <EditableText
                id="problemTitle"
                value={content.problemTitle || "The Challenge"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "problemTitle"}
                style={{
                  fontSize: `${18 * fs}px`,
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  marginBottom: `${12 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: `${8 * fs}px`,
                }}
                as="h2"
              />
              <EditableText
                id="problem"
                value={
                  content.problem ||
                  "Your organization faces significant challenges in the current market landscape. We understand the complexities involved and have developed a tailored approach to address these specific pain points effectively."
                }
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "problem"}
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#444",
                  lineHeight: 1.7,
                  margin: 0,
                }}
                as="p"
                multiline
              />
            </div>

            {/* Solution */}
            <div style={{ marginBottom: `${32 * fs}px` }}>
              <EditableText
                id="solutionTitle"
                value={content.solutionTitle || "Our Solution"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "solutionTitle"}
                style={{
                  fontSize: `${18 * fs}px`,
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  marginBottom: `${12 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: `${8 * fs}px`,
                }}
                as="h2"
              />
              <EditableText
                id="solution"
                value={
                  content.solution ||
                  "Our comprehensive solution addresses your core business needs through a multi-phase approach. We leverage industry best practices and innovative strategies to deliver exceptional results."
                }
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "solution"}
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#444",
                  lineHeight: 1.7,
                  margin: 0,
                }}
                as="p"
                multiline
              />
            </div>

            {/* Deliverables */}
            <div style={{ marginBottom: `${32 * fs}px` }}>
              <EditableText
                id="deliverablesTitle"
                value={content.deliverablesTitle || "Key Deliverables"}
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "deliverablesTitle"}
                style={{
                  fontSize: `${18 * fs}px`,
                  fontWeight: "bold",
                  color: "#1a1a1a",
                  marginBottom: `${12 * fs}px`,
                  borderBottom: "2px solid #1a1a1a",
                  paddingBottom: `${8 * fs}px`,
                }}
                as="h2"
              />
              <EditableText
                id="deliverables"
                value={
                  content.deliverables ||
                  "• Comprehensive strategy document\n• Implementation roadmap\n• Training and support materials\n• Quarterly progress reports\n• Ongoing consultation sessions"
                }
                onChange={onChange}
                onEnhance={onEnhance}
                isEnhancing={enhancingField === "deliverables"}
                style={{
                  fontSize: `${12 * fs}px`,
                  color: "#444",
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-line",
                }}
                as="p"
                multiline
              />
            </div>

            {/* Timeline & Budget */}
            <div style={{ display: "flex", gap: `${24 * fs}px` }}>
              <div style={{ flex: 1 }}>
                <EditableText
                  id="timelineTitle"
                  value={content.timelineTitle || "Timeline"}
                  onChange={onChange}
                  style={{
                    fontSize: `${14 * fs}px`,
                    fontWeight: "bold",
                    color: "#1a1a1a",
                    marginBottom: `${8 * fs}px`,
                  }}
                  as="h3"
                />
                <EditableText
                  id="timeline"
                  value={content.timeline || "3-6 months"}
                  onChange={onChange}
                  style={{
                    fontSize: `${12 * fs}px`,
                    color: "#444",
                    margin: 0,
                  }}
                  as="p"
                />
              </div>
              <div style={{ flex: 1 }}>
                <EditableText
                  id="budgetTitle"
                  value={content.budgetTitle || "Investment"}
                  onChange={onChange}
                  style={{
                    fontSize: `${14 * fs}px`,
                    fontWeight: "bold",
                    color: "#1a1a1a",
                    marginBottom: `${8 * fs}px`,
                  }}
                  as="h3"
                />
                <EditableText
                  id="budget"
                  value={content.budget || "$10,000 - $25,000"}
                  onChange={onChange}
                  style={{
                    fontSize: `${12 * fs}px`,
                    color: "#444",
                    margin: 0,
                  }}
                  as="p"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#1a1a1a",
          padding: `${16 * fs}px ${40 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <EditableText
          id="footerText"
          value={content.footerText || "Thank you for considering our proposal"}
          onChange={onChange}
          style={{ color: "white", fontSize: `${11 * fs}px`, margin: 0 }}
          as="span"
        />
        <span style={{ color: "#888", fontSize: `${10 * fs}px` }}>Page 1</span>
      </div>
    </div>
  )
}
