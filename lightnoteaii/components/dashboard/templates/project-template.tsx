"use client"

import { Play } from "lucide-react"
import type { TemplateProps } from "./types"

interface ProjectTemplateProps extends TemplateProps {
  currentPage: number
}

export function ProjectTemplate({
  isFullPreview = false,
  safeInfo,
  safeBranding,
  sections,
  currentDate,
  currentPage,
}: ProjectTemplateProps) {
  const fs = isFullPreview ? 1 : 0.85
  const sageGreen = "#c8d5c8"
  const darkGreen = "#2d4a3e"

  // Page 1 - Cover
  const Page1 = () => (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "700px",
        display: "flex",
        fontFamily: "'Georgia', serif",
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
          {safeInfo.logo ? (
            <img
              src={safeInfo.logo || "/placeholder.svg"}
              alt="Logo"
              style={{ height: `${36 * fs}px`, width: "auto" }}
            />
          ) : (
            <>
              <span style={{ color: darkGreen, fontSize: `${20 * fs}px` }}>◆</span>
              <span
                style={{
                  fontSize: `${18 * fs}px`,
                  fontWeight: "600",
                  color: darkGreen,
                  letterSpacing: "1px",
                }}
              >
                Brandname
              </span>
            </>
          )}
        </div>

        {/* Title - Cursive Style */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: `${64 * fs}px`,
              fontWeight: "400",
              color: darkGreen,
              margin: 0,
              lineHeight: 1,
              fontStyle: "italic",
              fontFamily: "'Georgia', serif",
            }}
          >
            Project
          </h1>
          <h1
            style={{
              fontSize: `${64 * fs}px`,
              fontWeight: "400",
              color: darkGreen,
              margin: 0,
              lineHeight: 1,
              fontStyle: "italic",
              fontFamily: "'Georgia', serif",
            }}
          >
            Proposal
          </h1>
          <p
            style={{
              fontSize: `${14 * fs}px`,
              color: darkGreen,
              marginTop: `${20 * fs}px`,
              opacity: 0.8,
            }}
          >
            {safeInfo.proposalType || "Environment Video Production"}
          </p>
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
            <p style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: darkGreen, margin: 0 }}>
              {safeInfo.clientName}
            </p>
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
            <p style={{ fontSize: `${14 * fs}px`, fontWeight: "600", color: darkGreen, margin: 0 }}>
              {safeBranding.companyName}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - White with Content */}
      <div style={{ flex: 1, backgroundColor: "white", padding: `${48 * fs}px ${36 * fs}px` }}>
        {/* Introduction */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <h2
            style={{
              fontSize: `${20 * fs}px`,
              fontStyle: "italic",
              color: "#333",
              marginBottom: `${12 * fs}px`,
              fontWeight: "400",
            }}
          >
            Introduction
          </h2>
          <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7 }}>
            {sections?.SUMMARY ||
              "We are excited to present this proposal for the production of a video to launch your new product. Our goal with this video is to effectively communicate the features and benefits of your product to your target audience while capturing their attention and generating interest."}
          </p>
        </div>

        {/* About Us */}
        <div style={{ marginBottom: `${32 * fs}px` }}>
          <h2
            style={{
              fontSize: `${20 * fs}px`,
              fontStyle: "italic",
              color: "#333",
              marginBottom: `${12 * fs}px`,
              fontWeight: "400",
            }}
          >
            About Us
          </h2>
          <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7 }}>
            {safeBranding.companyName} is a renowned video production company with a track record of delivering
            high-quality videos for various clients across different industries. With a team of experienced
            professionals, we specialize in creating engaging and compelling content that resonates with audiences.
          </p>
        </div>

        {/* Mission & Vision with Images */}
        <div style={{ borderTop: `1px solid #ddd`, paddingTop: `${20 * fs}px` }}>
          {/* Mission */}
          <div style={{ display: "flex", gap: `${16 * fs}px`, marginBottom: `${20 * fs}px` }}>
            <div
              style={{
                width: `${100 * fs}px`,
                height: `${70 * fs}px`,
                backgroundColor: "#ddd",
                backgroundImage: safeInfo.images?.[0] ? `url(${safeInfo.images[0]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: `${14 * fs}px`, fontStyle: "italic", color: "#333", margin: `0 0 ${8 * fs}px 0` }}>
                Mission
              </h3>
              <p style={{ fontSize: `${11 * fs}px`, color: "#666", lineHeight: 1.6, margin: 0 }}>
                Our expertise in video production, coupled with our creative approach, ensures that we can bring your
                vision to life effectively.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div
            style={{ display: "flex", gap: `${16 * fs}px`, borderTop: `1px solid #ddd`, paddingTop: `${20 * fs}px` }}
          >
            <div
              style={{
                width: `${100 * fs}px`,
                height: `${70 * fs}px`,
                backgroundColor: "#ddd",
                backgroundImage: safeInfo.images?.[1] ? `url(${safeInfo.images[1]})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: `${14 * fs}px`, fontStyle: "italic", color: "#333", margin: `0 0 ${8 * fs}px 0` }}>
                Vision
              </h3>
              <p style={{ fontSize: `${11 * fs}px`, color: "#666", lineHeight: 1.6, margin: 0 }}>
                Our expertise in video production, coupled with our creative approach, ensures that we can bring your
                vision to life effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Page 2 - Proposal for Production
  const Page2 = () => (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "700px",
        backgroundColor: "white",
        fontFamily: "'Georgia', serif",
        padding: `${48 * fs}px ${40 * fs}px`,
      }}
    >
      <h2
        style={{
          fontSize: `${24 * fs}px`,
          fontStyle: "italic",
          color: "#333",
          marginBottom: `${16 * fs}px`,
          fontWeight: "400",
        }}
      >
        Proposal for Production
      </h2>
      <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, marginBottom: `${32 * fs}px` }}>
        During the pre-production phase, our team will work closely with you to conceptualize the video and develop a
        script that effectively communicates your message. We will brainstorm ideas, outline the storyline.
      </p>

      {/* Phase 01 */}
      <div style={{ marginBottom: `${32 * fs}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px`, marginBottom: `${12 * fs}px` }}>
          <span style={{ fontSize: `${12 * fs}px`, color: darkGreen, fontWeight: "600" }}>Phase 01</span>
          <h3 style={{ fontSize: `${16 * fs}px`, color: darkGreen, fontStyle: "italic", margin: 0, fontWeight: "400" }}>
            Pre-Production: Conceptualization and Script
          </h3>
        </div>
        <div style={{ display: "flex", gap: `${16 * fs}px`, paddingLeft: `${60 * fs}px` }}>
          <div
            style={{
              width: `${48 * fs}px`,
              height: `${48 * fs}px`,
              backgroundColor: sageGreen,
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={20 * fs} color={darkGreen} />
          </div>
          <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, flex: 1, margin: 0 }}>
            Our team will work closely with you to conceptualize the video and develop a script that effectively
            communicates your message. We will brainstorm ideas, outline the storyline, and create a compelling script
            that highlights the key features.
          </p>
        </div>
      </div>

      {/* Phase 02 */}
      <div style={{ marginBottom: `${32 * fs}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: `${12 * fs}px`, marginBottom: `${12 * fs}px` }}>
          <span style={{ fontSize: `${12 * fs}px`, color: darkGreen, fontWeight: "600" }}>Phase 02</span>
          <h3 style={{ fontSize: `${16 * fs}px`, color: darkGreen, fontStyle: "italic", margin: 0, fontWeight: "400" }}>
            Production: Filming
          </h3>
        </div>
        <div style={{ paddingLeft: `${60 * fs}px` }}>
          <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, margin: 0 }}>
            Once the script is finalized, we will proceed to the production phase where we will bring the script to life
            through filming. Our experienced videographers will capture high-quality footage of your product, ensuring
            that every aspect is showcased in the best possible light.
          </p>
        </div>
      </div>

      {/* Additional Content */}
      <div style={{ display: "flex", gap: `${20 * fs}px`, marginTop: `${40 * fs}px` }}>
        <div
          style={{
            width: `${60 * fs}px`,
            height: `${60 * fs}px`,
            backgroundColor: sageGreen,
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Play size={24 * fs} color={darkGreen} />
        </div>
        <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, flex: 1, margin: 0 }}>
          We will work closely with you to conceptualize the video and develop a script that effectively communicates
          your message. We will brainstorm ideas, outline the storyline, and create a compelling script that highlights
          the key features.
        </p>
      </div>

      <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, marginTop: `${24 * fs}px` }}>
        {sections?.SOLUTION ||
          "During the pre-production phase, our team will work closely with you to conceptualize the video and develop a script that effectively communicates your message. We will brainstorm ideas, outline the storyline, and create a compelling script that highlights the key features and benefits of your product."}
      </p>
    </div>
  )

  // Page 3 - Detailed Budget
  const Page3 = () => (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "700px",
        backgroundColor: "white",
        fontFamily: "'Georgia', serif",
        padding: `${48 * fs}px ${40 * fs}px`,
      }}
    >
      <h2
        style={{
          fontSize: `${24 * fs}px`,
          fontStyle: "italic",
          color: "#333",
          marginBottom: `${16 * fs}px`,
          fontWeight: "400",
        }}
      >
        Detailed Budget
      </h2>
      <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, marginBottom: `${24 * fs}px` }}>
        During the pre-production phase, our team will work closely with you to conceptualize the video and develop a
        script that effectively communicates your message.
      </p>

      {/* Budget Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: `${32 * fs}px` }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${darkGreen}` }}>
            <th style={{ padding: `${12 * fs}px`, textAlign: "left", fontSize: `${12 * fs}px`, color: "#333" }}>
              US $
            </th>
            <th style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#333" }}>
              FY'30
            </th>
            <th style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#333" }}>
              YOY Change
            </th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: `${12 * fs}px`, fontSize: `${12 * fs}px`, color: "#666" }}>Expenses</td>
            <td style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#666" }}>
              300.00
            </td>
            <td style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#666" }}>
              18%
            </td>
          </tr>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ padding: `${12 * fs}px`, fontSize: `${12 * fs}px`, color: "#666" }}>Profit</td>
            <td style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#666" }}>
              156.00
            </td>
            <td style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#666" }}>
              248%
            </td>
          </tr>
          <tr>
            <td style={{ padding: `${12 * fs}px`, fontSize: `${12 * fs}px`, color: "#666" }}>Dividend per share</td>
            <td style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#666" }}>
              $70.00/share
            </td>
            <td style={{ padding: `${12 * fs}px`, textAlign: "center", fontSize: `${12 * fs}px`, color: "#666" }}>
              100
            </td>
          </tr>
        </tbody>
      </table>

      {/* Financial Targets */}
      <h3
        style={{
          fontSize: `${18 * fs}px`,
          fontStyle: "italic",
          color: "#333",
          marginBottom: `${16 * fs}px`,
          fontWeight: "400",
        }}
      >
        Financial Targets
      </h3>
      <div style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 2, marginBottom: `${24 * fs}px` }}>
        <p style={{ margin: 0 }}>Pre-production - $ 2,000,000</p>
        <p style={{ margin: 0 }}>Production - $ 2,000,000</p>
        <p style={{ margin: 0 }}>Post-production - $ 2,000,000</p>
        <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>Total Budget - $ {safeInfo.budget || "2,000,000"}</p>
      </div>

      <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7 }}>
        {sections?.["FINANCIAL SUMMARY"] ||
          "Upon approval of this proposal, we will begin the pre-production phase by scheduling a kickoff meeting to discuss the project timeline, gather any necessary assets, and finalize the script. From there, we will proceed with filming and post-production, keeping you informed and involved every step of the way."}
      </p>
    </div>
  )

  // Page 4 - Contact
  const Page4 = () => (
    <div
      style={{
        width: isFullPreview ? "800px" : "100%",
        minHeight: isFullPreview ? "1100px" : "700px",
        backgroundColor: "white",
        fontFamily: "'Georgia', serif",
        padding: `${48 * fs}px ${40 * fs}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          fontSize: `${24 * fs}px`,
          fontStyle: "italic",
          color: "#333",
          marginBottom: `${24 * fs}px`,
          fontWeight: "400",
        }}
      >
        Next Steps
      </h2>
      <p style={{ fontSize: `${12 * fs}px`, color: "#666", lineHeight: 1.7, marginBottom: `${32 * fs}px` }}>
        Thank you for considering {safeBranding.companyName} for your product launch video production needs. We are
        confident that our expertise and creativity will help you achieve your goals and make a lasting impression on
        your audience. We look forward to the opportunity to work with you.
      </p>

      <div style={{ flex: 1 }} />

      {/* Dark Green Footer */}
      <div
        style={{
          backgroundColor: darkGreen,
          margin: `0 -${40 * fs}px -${48 * fs}px`,
          padding: `${24 * fs}px ${40 * fs}px`,
          display: "flex",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <div>
          <p
            style={{
              fontSize: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: `${6 * fs}px`,
              opacity: 0.7,
            }}
          >
            PHONE
          </p>
          <p style={{ fontSize: `${14 * fs}px`, margin: 0, color: sageGreen }}>+01 123 456 789</p>
        </div>
        <div>
          <p
            style={{
              fontSize: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: `${6 * fs}px`,
              opacity: 0.7,
            }}
          >
            ADDRESS
          </p>
          <p style={{ fontSize: `${14 * fs}px`, margin: 0, color: sageGreen }}>N° Street Name, City XXXX</p>
        </div>
        <div>
          <p
            style={{
              fontSize: `${10 * fs}px`,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: `${6 * fs}px`,
              opacity: 0.7,
            }}
          >
            EMAIL
          </p>
          <p style={{ fontSize: `${14 * fs}px`, margin: 0, color: sageGreen }}>info@email.com</p>
        </div>
      </div>
    </div>
  )

  const pages = [Page1, Page2, Page3, Page4]
  const CurrentPageComponent = pages[currentPage - 1] || Page1

  return <CurrentPageComponent />
}
