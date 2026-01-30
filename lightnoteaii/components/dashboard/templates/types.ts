export interface TemplateProps {
  isFullPreview?: boolean
  safeInfo: {
    proposalType: string
    template: string
    clientName: string
    clientCompany: string
    clientEmail: string
    industry: string
    problem: string
    summary?: string
    solution?: string
    deliverables: string
    timeline: string
    budget: string
    tone: string
    uniqueValue: string
    logo: string
    images: string[]
    preparedBy?: string
    preparedByEmail?: string
    proposalPages?: number
  }
  safeBranding: {
    companyName: string
    primaryColor: string
    fontFamily: string
  }
  sections: { [key: string]: string } | null
  currentDate: string
}
