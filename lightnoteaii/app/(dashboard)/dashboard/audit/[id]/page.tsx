import { AuditResultsClient } from "./AuditResultsClient"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Audit Results - LightNote AI",
  description: "View your proposal audit results",
}

export default function AuditResultsPage() {
  return <AuditResultsClient />
}
