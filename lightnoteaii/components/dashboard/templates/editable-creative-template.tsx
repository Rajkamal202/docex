"use client"

import { Phone, Mail, MapPin, Globe } from "lucide-react"
import { EditableText } from "./editable-text"

interface EditableTemplateProps {
  isFullPreview?: boolean
  content: Record<string, string>
  onChange: (id: string, value: string) => void
  onEnhance?: (id: string, enhanceType: string) => void
  enhancingField?: string | null
  currentDate: string
}

export function EditableCreativeTemplate({
  isFullPreview = false,
  content,
  onChange,
  onEnhance,
  enhancingField,
  currentDate,
}: EditableTemplateProps) {
  return (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "800px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        position: "relative",
      }}
    >
      {/* Main Content - Left Side */}
      <div style={{ flex: 1, padding: "32px", paddingRight: "200px" }}>
        {/* Header with Logo and Company Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6V12C4 16 8 20 12 22C16 20 20 16 20 12V6L12 2Z" fill="#E87A2D" />
              <path d="M12 6L8 8V12C8 14 10 16 12 17C14 16 16 14 16 12V8L12 6Z" fill="#F5A623" />
            </svg>
            <EditableText
              id="companyName"
              value={content.companyName || "Your Company"}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "companyName"}
              style={{ fontSize: "14px", fontWeight: 600, color: "#E87A2D", margin: 0 }}
              as="span"
            />
          </div>
        </div>

        {/* Main Title */}
        <EditableText
          id="titleLine1"
          value={content.titleLine1 || "BUSINESS"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "titleLine1"}
          style={{
            fontSize: "42px",
            fontWeight: 900,
            color: "#1a1a1a",
            lineHeight: 1,
            margin: 0,
            letterSpacing: "-1px",
          }}
          as="h1"
        />
        <EditableText
          id="titleLine2"
          value={content.titleLine2 || "IDEAS"}
          onChange={onChange}
          onEnhance={onEnhance}
          isEnhancing={enhancingField === "titleLine2"}
          style={{
            fontSize: "42px",
            fontWeight: 900,
            color: "#1a1a1a",
            lineHeight: 1,
            marginBottom: "24px",
            letterSpacing: "-1px",
          }}
          as="h1"
        />

        {/* First Content Block - Orange Label with Black Box */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
            <div
              style={{
                backgroundColor: "#1a1a1a",
                padding: "8px 16px",
                display: "inline-block",
              }}
            >
              <EditableText
                id="proposalLabel1"
                value={content.proposalLabel1 || "Proposal"}
                onChange={onChange}
                style={{ color: "#E87A2D", fontSize: "18px", fontWeight: 700, margin: 0 }}
                as="span"
              />
              <br />
              <EditableText
                id="proposalLabel2"
                value={content.proposalLabel2 || "ipsum"}
                onChange={onChange}
                style={{ color: "#E87A2D", fontSize: "18px", fontWeight: 700, margin: 0 }}
                as="span"
              />
            </div>
            <EditableText
              id="summary"
              value={
                content.summary ||
                "This proposal outlines our approach to solving your business challenges. Our team is dedicated to delivering exceptional results that exceed expectations."
              }
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "summary"}
              style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, flex: 1, margin: 0 }}
              as="p"
              multiline
            />
          </div>
          <EditableText
            id="tagline"
            value={content.tagline || "Delivering excellence through innovation and dedication."}
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "tagline"}
            style={{ fontSize: "11px", color: "#666", fontStyle: "italic", marginLeft: "4px", margin: 0 }}
            as="p"
          />
        </div>

        {/* Second Content Block - Orange Border Left */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ borderLeft: "4px solid #E87A2D", paddingLeft: "12px" }}>
            <EditableText
              id="sectionHeading"
              value={content.sectionHeading || "Magna\naliquam\nerat\nvolutpat"}
              onChange={onChange}
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.2,
                marginBottom: "4px",
                whiteSpace: "pre-line",
              }}
              as="h3"
              multiline
            />
          </div>
          <EditableText
            id="problem"
            value={
              content.problem ||
              "Our comprehensive solution addresses the core challenges you face. We leverage industry expertise and innovative strategies to create measurable impact for your business."
            }
            onChange={onChange}
            onEnhance={onEnhance}
            isEnhancing={enhancingField === "problem"}
            style={{ fontSize: "11px", color: "#666", lineHeight: 1.6, flex: 1, margin: 0 }}
            as="p"
            multiline
          />
        </div>

        {/* Numbered List Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#E87A2D" }}>1</span>
            <EditableText
              id="point1"
              value={
                content.point1 ||
                "Strategic planning and analysis to identify key opportunities for growth and improvement."
              }
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "point1"}
              style={{ fontSize: "10px", color: "#666", lineHeight: 1.5, margin: 0 }}
              as="p"
              multiline
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#E87A2D" }}>2</span>
            <EditableText
              id="point2"
              value={content.point2 || "Implementation and execution with continuous monitoring and optimization."}
              onChange={onChange}
              onEnhance={onEnhance}
              isEnhancing={enhancingField === "point2"}
              style={{ fontSize: "10px", color: "#666", lineHeight: 1.5, margin: 0 }}
              as="p"
              multiline
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            padding: "10px 16px",
            marginTop: "auto",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: "180px",
          }}
        >
          <EditableText
            id="websiteUrl"
            value={content.websiteUrl || "yourcompany.com"}
            onChange={onChange}
            style={{ color: "#E87A2D", fontSize: "11px", margin: 0 }}
            as="span"
          />
        </div>
      </div>

      {/* Orange Contact Sidebar - Right Side */}
      <div
        style={{
          width: "180px",
          backgroundColor: "#E87A2D",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Phone */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}
          >
            <Phone size={18} color="white" />
          </div>
          <EditableText
            id="phone"
            value={content.phone || "+1 234 567 890"}
            onChange={onChange}
            style={{ fontSize: "10px", color: "white", lineHeight: 1.4, margin: 0 }}
            as="p"
          />
        </div>

        {/* Email */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}
          >
            <Mail size={18} color="white" />
          </div>
          <EditableText
            id="email"
            value={content.email || "contact@company.com"}
            onChange={onChange}
            style={{ fontSize: "10px", color: "white", lineHeight: 1.4, margin: 0 }}
            as="p"
          />
        </div>

        {/* Location */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}
          >
            <MapPin size={18} color="white" />
          </div>
          <EditableText
            id="address"
            value={content.address || "123 Business St\nCity, State 12345"}
            onChange={onChange}
            style={{ fontSize: "10px", color: "white", lineHeight: 1.4, margin: 0, whiteSpace: "pre-line" }}
            as="p"
            multiline
          />
        </div>

        {/* Website */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 8px",
            }}
          >
            <Globe size={18} color="white" />
          </div>
          <EditableText
            id="website"
            value={content.website || "www.company.com"}
            onChange={onChange}
            style={{ fontSize: "10px", color: "white", lineHeight: 1.4, margin: 0 }}
            as="p"
          />
        </div>
      </div>
    </div>
  )
}
