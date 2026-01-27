import type { Metadata } from "next"
import { AuditProposalContent } from "@/components/dashboard/audit-proposal-content"

export const metadata: Metadata = {
  title: "Audit Proposal - LightNote AI",
  description: "Upload a proposal for AI-powered audit and analysis",
}

export default function UploadPage() {
  return <AuditProposalContent />
}
