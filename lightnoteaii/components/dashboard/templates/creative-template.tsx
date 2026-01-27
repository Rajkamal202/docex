import { Phone, Mail, MapPin, Globe } from "lucide-react"
import type { TemplateProps } from "./types"

function getDeliverableItem(deliverables: string | string[] | undefined, index: number): string | undefined {
  if (!deliverables) return undefined
  if (Array.isArray(deliverables)) {
    return deliverables[index]
  }
  if (typeof deliverables === "string") {
    return deliverables.split(",")[index]?.trim()
  }
  return undefined
}

export function CreativeTemplate({ safeInfo, safeBranding, sections, currentDate }: TemplateProps) {
  const proposalType = safeInfo.proposalType || "Business Proposal"
  const proposalWords = proposalType.split(" ")
  const companyName = safeBranding.companyName || safeInfo.companyName || "Company"
  const companyDomain = companyName.toLowerCase().replace(/\s+/g, "")

  return (
    <div
      style={{
        width: "100%",
        minHeight: "800px",
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
          {safeInfo.logo ? (
            <img
              src={safeInfo.logo || "/placeholder.svg"}
              alt="Logo"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6V12C4 16 8 20 12 22C16 20 20 16 20 12V6L12 2Z" fill="#E87A2D" />
                <path d="M12 6L8 8V12C8 14 10 16 12 17C14 16 16 14 16 12V8L12 6Z" fill="#F5A623" />
              </svg>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#E87A2D" }}>{companyName}</span>
            </div>
          )}
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 900,
            color: "#1a1a1a",
            lineHeight: 1,
            marginBottom: "24px",
            letterSpacing: "-1px",
          }}
        >
          BUSINESS
          <br />
          IDEAS
        </h1>

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
              <span style={{ color: "#E87A2D", fontSize: "18px", fontWeight: 700 }}>{proposalWords[0] || "Lorem"}</span>
              <br />
              <span style={{ color: "#E87A2D", fontSize: "18px", fontWeight: 700 }}>{proposalWords[1] || "ipsum"}</span>
            </div>
            <p style={{ fontSize: "11px", color: "#666", lineHeight: 1.5, flex: 1 }}>
              {sections?.summary ||
                `This proposal outlines our approach to ${safeInfo.problem || "solving your business challenges"}. Our team is dedicated to delivering exceptional results that exceed expectations.`}
            </p>
          </div>
          <p style={{ fontSize: "11px", color: "#666", fontStyle: "italic", marginLeft: "4px" }}>
            "{safeInfo.uniqueValue || "Delivering excellence through innovation and dedication."}"
          </p>
        </div>

        {/* Second Content Block - Orange Border Left */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <div style={{ borderLeft: "4px solid #E87A2D", paddingLeft: "12px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2, marginBottom: "4px" }}>
              {sections?.problemTitle || "Magna"}
              <br />
              {sections?.problemSubtitle || "aliquam"}
              <br />
              erat
              <br />
              volutpat
            </h3>
          </div>
          <p style={{ fontSize: "11px", color: "#666", lineHeight: 1.6, flex: 1 }}>
            {sections?.problem ||
              safeInfo.problem ||
              `Our comprehensive solution addresses the core challenges you face. We leverage industry expertise and innovative strategies to create measurable impact for your business.`}
          </p>
        </div>

        {/* Numbered List Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#E87A2D" }}>1</span>
            <p style={{ fontSize: "10px", color: "#666", lineHeight: 1.5 }}>
              {sections?.solution?.split(".")[0] ||
                getDeliverableItem(safeInfo.deliverables, 0) ||
                "Strategic planning and analysis to identify key opportunities for growth and improvement."}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "28px", fontWeight: 700, color: "#E87A2D" }}>2</span>
            <p style={{ fontSize: "10px", color: "#666", lineHeight: 1.5 }}>
              {sections?.solution?.split(".")[1] ||
                getDeliverableItem(safeInfo.deliverables, 1) ||
                "Implementation and execution with continuous monitoring and optimization."}
            </p>
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
          <span style={{ color: "#E87A2D", fontSize: "11px" }}>{companyDomain}.com</span>
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
          <p style={{ fontSize: "10px", color: "white", lineHeight: 1.4 }}>
            {safeInfo.clientEmail?.includes("@") ? "+1 234 567 890" : safeInfo.clientEmail || "+1 234 567 890"}
          </p>
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
          <p style={{ fontSize: "10px", color: "white", lineHeight: 1.4 }}>
            {safeInfo.clientEmail || "contact@company.com"}
          </p>
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
          <p style={{ fontSize: "10px", color: "white", lineHeight: 1.4 }}>
            {safeInfo.industry || "123 Business Ave"}
            <br />
            Suite 100
          </p>
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
          <p style={{ fontSize: "10px", color: "white", lineHeight: 1.4 }}>www.{companyDomain}.com</p>
        </div>
      </div>
    </div>
  )
}
