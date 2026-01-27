import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - LightNote AI",
  description:
    "Learn how to use LightNote AI to create winning proposals. Find guides, tutorials, and answers to help you succeed.",
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
