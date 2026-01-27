export type Profile = {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

export type Credit = {
  id: string
  user_id: string
  balance: number
  created_at: string
  updated_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  amount: number
  feature: string
  description: string | null
  created_at: string
}

export type Client = {
  id: string
  user_id: string
  name: string
  email: string | null
  company: string | null
  industry: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export type Proposal = {
  id: string
  user_id: string
  client_id: string | null
  name: string
  client_name: string | null
  status: string
  score: number | null
  value: number | null
  industry: string | null
  deadline: string | null
  content: string | null
  original_content: string | null
  improved_content: string | null
  score_breakdown: {
    structure: number
    credibility: number
    persuasion: number
    clarity: number
    cta: number
  } | null
  issues: Array<{
    id: string
    severity: string
    title: string
    description: string
  }> | null
  improvements: Array<{
    id: string
    title: string
    description: string
    before: string
    after: string
  }> | null
  created_at: string
  updated_at: string
}

// Studio Types

export interface Template {
  id: string
  user_id?: string | null
  name: string
  description: string | null
  category: string
  thumbnail_url: string | null
  content: TemplateContent
  is_public: boolean
  is_premium: boolean
  usage_count: number
  rating: number
  created_at: string
  updated_at: string
}

export interface TemplateContent {
  sections: Section[]
  settings?: {
    font?: string
    primaryColor?: string
    layout?: "standard" | "minimal" | "modern"
  }
}

export interface Section {
  id: string
  type: "hero" | "text" | "image" | "pricing" | "quote" | "table" | "header" | "footer" | "team" | "dashboard" | "comparison" | "roadmap" | "testimonial" | "investment" | "custom"
  title?: string
  content: Record<string, unknown>
  order: number
  style?: Record<string, unknown>
}

export interface StudioProposal {
  id: string
  user_id?: string | null
  template_id: string | null
  name: string
  client_name: string | null
  status: "draft" | "review" | "sent" | "accepted" | "rejected"
  content: TemplateContent
  source_type: "template" | "upload" | "blank"
  original_file_path: string | null
  is_favorite: boolean
  created_at: string
  last_edited_at: string
}

export interface MediaAsset {
  id: string
  user_id?: string | null
  proposal_id: string | null
  storage_path: string
  file_name: string
  file_type: string
  file_size: number
  metadata: Record<string, unknown>
  created_at: string
}

export const TEMPLATE_CATEGORIES = [
  "Sales",
  "Marketing",
  "Consulting",
  "Engineering",
  "Design",
  "Finance",
  "Product",
  "HR",
  "Legal",
  "Other",
] as const

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]
