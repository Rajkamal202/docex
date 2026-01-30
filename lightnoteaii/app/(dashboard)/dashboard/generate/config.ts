import {
  AlertCircle,
  Building2,
  Clock,
  DollarSign,
  FileText,
  LayoutTemplate,
  Palette,
  Sparkles,
  Target,
  User,
} from "lucide-react"
import type { CollectedInfo, ConversationStep } from "./types"

export const proposalTypes = [
  "Sales Proposal",
  "Service Proposal",
  "Freelance Proposal",
  "Consulting Proposal",
  "Software Development Proposal",
  "Marketing Proposal",
  "Partnership Proposal",
  "RFP Response",
  "Website Design Proposal",
  "Mobile App Proposal",
]

export const industryOptions = [
  { id: "saas", label: "SaaS / Software", icon: "💻" },
  { id: "ecommerce", label: "E-commerce / Retail", icon: "🛒" },
  { id: "healthcare", label: "Healthcare / Medical", icon: "🏥" },
  { id: "finance", label: "Finance / Fintech", icon: "💰" },
  { id: "education", label: "Education / EdTech", icon: "🎓" },
  { id: "realestate", label: "Real Estate", icon: "🏠" },
  { id: "hospitality", label: "Restaurant / Hospitality", icon: "🍽️" },
  { id: "agency", label: "Agency / Creative", icon: "🎨" },
  { id: "consulting", label: "Consulting / Professional Services", icon: "💼" },
  { id: "manufacturing", label: "Manufacturing / Industrial", icon: "🏭" },
  { id: "nonprofit", label: "Non-profit / NGO", icon: "🤝" },
  { id: "other", label: "Other", icon: "📦" },
]

export const businessGoalOptions = [
  { id: "increase_revenue", label: "Increase Revenue", description: "Grow sales and profit" },
  { id: "reduce_costs", label: "Reduce Costs", description: "Lower expenses and increase margins" },
  { id: "save_time", label: "Save Time", description: "Automate and streamline workflow" },
  { id: "acquire_customers", label: "Acquire Customers", description: "Generate more leads and conversions" },
  { id: "retain_customers", label: "Retain Customers", description: "Improve loyalty and retention" },
  { id: "improve_brand", label: "Improve Brand", description: "Strengthen credibility and awareness" },
  { id: "launch_product", label: "Launch Product/Service", description: "Go to market effectively" },
  { id: "scale_operations", label: "Scale Operations", description: "Grow without operational chaos" },
  { id: "compliance", label: "Compliance / Security", description: "Meet regulations and standards" },
]

export const toneOptions = ["Professional", "Friendly", "Formal", "Persuasive", "Technical"]

export const budgetRanges = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
  "To be discussed",
]

export const timelineOptions = ["1-2 weeks", "2-4 weeks", "1-2 months", "2-3 months", "3-6 months", "6+ months", "Flexible"]

export const proposalPageOptions = [
  { label: "1 page", description: "Concise, high-level overview" },
  { label: "2 pages", description: "Balanced detail with clear structure" },
  { label: "3 pages", description: "Expanded scope and explanations" },
  { label: "4 pages", description: "Deep dive with full detail" },
]

export const websitePageOptions = [
  { label: "1-3 pages", description: "Simple brochure-style site" },
  { label: "4-5 pages", description: "Standard business website" },
  { label: "6-8 pages", description: "Expanded services and content" },
  { label: "10+ pages", description: "Large site with multiple sections" },
]

export const websiteFeatureOptions = [
  { label: "Contact form", description: "Lead capture and inquiries" },
  { label: "Online booking / reservations", description: "Schedule or book online" },
  { label: "Menu/Price list display", description: "Show offerings clearly" },
  { label: "Photo gallery", description: "Showcase visuals" },
  { label: "Google Maps integration", description: "Directions and location" },
  { label: "Click-to-call button", description: "One-tap phone calls" },
  { label: "Social media integration", description: "Connect socials" },
  { label: "Reviews / testimonials", description: "Build trust" },
]

export const primaryGoalOptions = [
  { id: "more_online_inquiries", label: "More online inquiries", description: "Drive form submissions" },
  { id: "more_phone_calls", label: "More phone calls", description: "Increase inbound calls" },
  { id: "more_bookings", label: "More bookings / reservations", description: "Improve scheduling" },
  { id: "more_visits", label: "More website visits", description: "Boost traffic" },
]

export const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and modern business proposal",
    preview: "professional",
    color: "#6366f1",
    recommended: ["Service Proposal", "Consulting Proposal", "Sales Proposal"],
    bestFor: "Professional services, agencies, and consultants",
    whenToUse: "When you need a polished and credible proposal",
    whyChoose: "Balanced layout with clear sections and a strong executive summary.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Sleek and contemporary design",
    preview: "modern",
    color: "#0ea5e9",
    recommended: ["Freelance Proposal", "Marketing Proposal"],
    bestFor: "Creative services, startups, and freelancers",
    whenToUse: "When you want a fresh, modern look",
    whyChoose: "Visual emphasis and modern typography.",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and formal layout",
    preview: "classic",
    color: "#0f172a",
    recommended: ["RFP Response", "Partnership Proposal"],
    bestFor: "Enterprise, legal, and corporate proposals",
    whenToUse: "When the audience expects formal documentation",
    whyChoose: "Traditional layout that feels familiar to decision makers.",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and expressive design",
    preview: "creative",
    color: "#f97316",
    recommended: ["Marketing Proposal", "Freelance Proposal"],
    bestFor: "Creative agencies and designers",
    whenToUse: "When you want to stand out visually",
    whyChoose: "High-impact visuals and expressive layout.",
  },
  {
    id: "business",
    name: "Business",
    description: "Structured, data-first layout",
    preview: "business",
    color: "#14b8a6",
    recommended: ["Sales Proposal", "Service Proposal"],
    bestFor: "Business development and sales",
    whenToUse: "When clarity and structure matter most",
    whyChoose: "Great for detailed scope and timelines.",
  },
  {
    id: "project",
    name: "Project",
    description: "Project-driven proposal format",
    preview: "project",
    color: "#a855f7",
    recommended: ["Software Development Proposal", "Consulting Proposal"],
    bestFor: "Software, implementation, and delivery projects",
    whenToUse: "When the client expects phases and deliverables",
    whyChoose: "Clearly outlines phases and milestones.",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Growth and campaign focused",
    preview: "marketing",
    color: "#ec4899",
    recommended: ["Marketing Proposal", "Sales Proposal"],
    bestFor: "Marketing agencies and growth teams",
    whenToUse: "When selling growth and marketing outcomes",
    whyChoose: "Highlights KPIs and outcomes.",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Developer-focused proposal",
    preview: "technical",
    color: "#0f172a",
    recommended: ["Software Development Proposal", "RFP Response"],
    bestFor: "Engineering and technical delivery",
    whenToUse: "When technical depth is required",
    whyChoose: "More technical language and structure.",
  },
  {
    id: "executive",
    name: "Executive",
    description: "C-suite presentation style",
    preview: "executive",
    color: "#111827",
    recommended: ["Partnership Proposal", "Sales Proposal"],
    bestFor: "High-stakes, executive audiences",
    whenToUse: "When you need an executive-friendly layout",
    whyChoose: "Concise and strategic tone.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Enterprise-focused layout",
    preview: "enterprise",
    color: "#1e293b",
    recommended: ["RFP Response", "Partnership Proposal"],
    bestFor: "Large organizations and enterprise sales",
    whenToUse: "When compliance or formality matters",
    whyChoose: "Enterprise-ready sections and structure.",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Startup / SaaS friendly",
    preview: "startup",
    color: "#06b6d4",
    recommended: ["Software Development Proposal", "Freelance Proposal"],
    bestFor: "Startups and SaaS teams",
    whenToUse: "When speed and clarity matter",
    whyChoose: "Startup-style layout with concise messaging.",
  },
  {
    id: "agency",
    name: "Agency",
    description: "Agency portfolio style",
    preview: "agency",
    color: "#8b5cf6",
    recommended: ["Marketing Proposal", "Freelance Proposal"],
    bestFor: "Agencies and studios",
    whenToUse: "When visuals and brand matter",
    whyChoose: "Strong visual hierarchy with bold sections.",
  },
  {
    id: "financial",
    name: "Financial",
    description: "Finance and investment focus",
    preview: "financial",
    color: "#0f766e",
    recommended: ["Sales Proposal", "Partnership Proposal"],
    bestFor: "Finance and fintech",
    whenToUse: "When financial clarity is essential",
    whyChoose: "Financial charts and projections focus.",
  },
  {
    id: "partnership",
    name: "Partnership",
    description: "Partnership-oriented layout",
    preview: "partnership",
    color: "#334155",
    recommended: ["Partnership Proposal", "RFP Response"],
    bestFor: "Strategic partnerships",
    whenToUse: "When proposing a partnership",
    whyChoose: "Emphasizes mutual outcomes.",
  },
  {
    id: "website",
    name: "Website",
    description: "Website-focused proposal",
    preview: "website",
    color: "#4f46e5",
    recommended: ["Website Design Proposal", "Marketing Proposal"],
    bestFor: "Web design agencies, freelancers, and businesses offering web development services",
    whenToUse: "When pitching website design, redesign, or development projects.",
    whyChoose: "Highlights key website elements like pages, features, and primary calls to action.",
  },
]

export const questionConfig = {
  whyAsking: {
    type: "Different proposal types have unique structures and language. This helps us tailor the content and sections appropriately.",
    template:
      "The right template sets the visual tone and organization of your proposal, making it more impactful for your audience.",
    client:
      "Understanding your client helps us personalize the proposal and use industry-appropriate language and examples.",
    problem:
      "A clear problem statement shows you understand the client's pain points - this is the foundation of a compelling proposal.",
    solution:
      "Your solution directly addresses the problem and showcases your expertise. This is where you demonstrate value.",
    budget:
      "Being upfront about investment builds trust and helps qualify the opportunity. It also helps scope the solution appropriately.",
    timeline:
      "Realistic timelines demonstrate professionalism and help clients plan resources. It sets clear expectations.",
    tone: "The right tone makes your proposal resonate with the reader - too formal can feel cold, too casual can seem unprofessional.",
    industry:
      "Understanding the industry helps us use relevant terminology and tailor examples to your client's specific context.",
    goal: "Knowing the primary goal ensures the proposal directly addresses the client's desired outcome and demonstrates measurable impact.",
    yourInfo: "This information will be used to populate your contact details and company branding on the proposal.",
    websitePages:
      "The number of pages determines the overall scope and complexity of the website, impacting the price and delivery time.",
    websiteFeatures:
      "Key features are crucial for functionality and user experience. Selecting them helps define the project's requirements and cost.",
    primaryAction:
      "Defining the primary action ensures the website is optimized to convert visitors into leads or customers.",
    proposalPages:
      "Page count sets the proposal length. This helps us right-size the detail so the final document matches your expectations.",
  },

  templateRecommendations: {
    "Sales Proposal": ["professional", "executive", "financial", "business"],
    "Service Proposal": ["professional", "consulting", "minimal", "project"],
    "Freelance Proposal": ["modern", "creative", "startup", "minimal", "agency"],
    "Consulting Proposal": ["consulting", "business", "classic", "enterprise"],
    "Software Development Proposal": ["technical", "startup", "project", "professional"],
    "Marketing Proposal": ["marketing", "creative", "agency", "modern"],
    "Partnership Proposal": ["partnership", "business", "executive", "financial", "classic"],
    "RFP Response": ["enterprise", "professional", "executive", "technical", "business"],
    "Website Design Proposal": ["website", "modern", "creative", "agency"],
    "Mobile App Proposal": ["website", "startup", "technical", "modern"],
  } as Record<string, string[]>,

  templateRecommendationsByIndustry: {
    "SaaS / Software": ["technical", "startup", "project", "professional"],
    "E-commerce / Retail": ["marketing", "business", "professional", "website"],
    "Healthcare / Medical": ["professional", "classic", "executive"],
    "Finance / Fintech": ["financial", "business", "executive"],
    "Education / EdTech": ["professional", "classic", "business"],
    "Real Estate": ["business", "professional", "marketing"],
    "Restaurant / Hospitality": ["website", "marketing", "creative"],
    "Agency / Creative": ["creative", "agency", "modern"],
    "Consulting / Professional Services": ["consulting", "business", "classic"],
    "Manufacturing / Industrial": ["business", "enterprise", "professional"],
    "Non-profit / NGO": ["classic", "professional", "business"],
    Other: ["professional", "minimal", "business"],
  } as Record<string, string[]>,

  templateRecommendationsByGoal: {
    "Increase Revenue": ["sales", "marketing", "business", "professional"],
    "Reduce Costs": ["business", "project", "enterprise"],
    "Save Time": ["project", "technical", "business"],
    "Acquire Customers": ["marketing", "sales", "professional"],
    "Retain Customers": ["professional", "classic", "business"],
    "Improve Brand": ["creative", "marketing", "agency"],
    "Launch Product/Service": ["startup", "project", "technical"],
    "Scale Operations": ["enterprise", "business", "project"],
    "Compliance / Security": ["enterprise", "classic", "professional"],
  } as Record<string, string[]>,

  toneRecommendations: {
    "Sales Proposal": ["Persuasive", "Professional"],
    "Service Proposal": ["Professional", "Friendly"],
    "Freelance Proposal": ["Friendly", "Professional"],
    "Consulting Proposal": ["Professional", "Formal"],
    "Software Development Proposal": ["Technical", "Professional"],
    "Marketing Proposal": ["Persuasive", "Friendly"],
    "Partnership Proposal": ["Professional", "Formal"],
    "RFP Response": ["Formal", "Professional"],
  } as Record<string, string[]>,

  budgetRecommendations: {
    "Sales Proposal": ["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000"],
    "Service Proposal": ["$1,000 - $5,000", "$5,000 - $10,000", "$10,000 - $25,000"],
    "Freelance Proposal": ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000"],
    "Consulting Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"],
    "Software Development Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"],
    "Marketing Proposal": ["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000"],
    "Partnership Proposal": ["To be discussed", "$25,000 - $50,000", "$50,000+"],
    "RFP Response": ["$25,000 - $50,000", "$50,000+", "To be discussed"],
    "Website Design Proposal": ["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000"],
    "Mobile App Proposal": ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"],
  } as Record<string, string[]>,

  timelineRecommendations: {
    "Sales Proposal": ["2-4 weeks", "1-2 months"],
    "Service Proposal": ["1-2 months", "2-3 months"],
    "Freelance Proposal": ["1-2 weeks", "2-4 weeks"],
    "Consulting Proposal": ["2-3 months", "3-6 months"],
    "Software Development Proposal": ["2-3 months", "3-6 months", "6+ months"],
    "Marketing Proposal": ["1-2 months", "2-3 months", "3-6 months"],
    "Partnership Proposal": ["3-6 months", "6+ months"],
    "RFP Response": ["2-4 weeks", "1-2 months"],
    "Website Design Proposal": ["1-2 months", "2-3 months"],
    "Mobile App Proposal": ["2-3 months", "3-6 months"],
  } as Record<string, string[]>,

  problemSuggestions: {
    "Sales Proposal": ["Low conversion rates", "Unqualified leads", "Long sales cycle"],
    "Service Proposal": ["Inefficient processes", "Manual workflows", "Inconsistent delivery"],
    "Freelance Proposal": ["Need project support", "Lack of internal resources", "Tight deadlines"],
    "Consulting Proposal": ["Strategy gaps", "Stalled growth", "Operational inefficiencies"],
    "Software Development Proposal": ["Legacy system limitations", "Scalability issues", "Slow release cycles"],
    "Marketing Proposal": ["Low brand awareness", "Declining engagement", "High CAC"],
    "Partnership Proposal": ["New market entry", "Shared resources", "Strategic alignment"],
    "RFP Response": ["Formal evaluation process", "Compliance needs", "Complex requirements"],
  } as Record<string, string[]>,

  solutionSuggestions: {
    "Sales Proposal": ["Revise sales funnel", "Improve lead qualification", "Optimize conversion"],
    "Service Proposal": ["Automate workflows", "Standardize delivery", "Improve reporting"],
    "Freelance Proposal": ["Dedicated execution", "Flexible delivery", "Rapid turnaround"],
    "Consulting Proposal": ["Strategic roadmap", "Operational plan", "Performance tracking"],
    "Software Development Proposal": ["Refactor architecture", "Implement CI/CD", "Improve performance"],
    "Marketing Proposal": ["Campaign strategy", "Content optimization", "Lifecycle automation"],
    "Partnership Proposal": ["Joint initiative plan", "Shared objectives", "Go-to-market execution"],
    "RFP Response": ["Requirements alignment", "Compliance coverage", "Implementation plan"],
  } as Record<string, string[]>,
}

export const conversationSteps: ConversationStep[] = [
  { id: "type", label: "Type", icon: FileText, question: "What type of proposal would you like to create?" },
  { id: "industry", label: "Industry", icon: Building2, question: "What industry is your client in?" },
  { id: "goal", label: "Goal", icon: Target, question: "What's the primary business goal for this project?" },
  {
    id: "websitePages",
    label: "Pages",
    icon: LayoutTemplate,
    question: "How many pages should the website include?",
    condition: (info: CollectedInfo) =>
      info.proposalType?.toLowerCase().includes("website") ||
      info.industry?.toLowerCase().includes("restaurant") ||
      info.industry?.toLowerCase().includes("hospitality") ||
      info.clientIndustry?.toLowerCase().includes("restaurant") ||
      info.clientIndustry?.toLowerCase().includes("hospitality"),
  },
  {
    id: "websiteFeatures",
    label: "Features",
    icon: Sparkles,
    question: "Which features does the client need? (Select all that apply)",
    multiSelect: true,
    condition: (info: CollectedInfo) =>
      info.proposalType?.toLowerCase().includes("website") ||
      info.industry?.toLowerCase().includes("restaurant") ||
      info.industry?.toLowerCase().includes("hospitality") ||
      info.clientIndustry?.toLowerCase().includes("restaurant") ||
      info.clientIndustry?.toLowerCase().includes("hospitality"),
  },
  {
    id: "primaryAction",
    label: "Action",
    icon: Target,
    question: "What's the #1 action visitors should take on this website?",
    condition: (info: CollectedInfo) =>
      info.proposalType?.toLowerCase().includes("website") ||
      info.industry?.toLowerCase().includes("restaurant") ||
      info.industry?.toLowerCase().includes("hospitality") ||
      info.clientIndustry?.toLowerCase().includes("restaurant") ||
      info.clientIndustry?.toLowerCase().includes("hospitality"),
  },
  { id: "template", label: "Template", icon: LayoutTemplate, question: "Choose a template style for your proposal." },
  { id: "client", label: "Client", icon: Building2, question: "Who is this proposal for? Tell me about the client." },
  {
    id: "yourInfo",
    label: "Your Info",
    icon: User,
    question: "What's your name and company name? (This will appear on the proposal)",
  },
  {
    id: "problem",
    label: "Problem",
    icon: AlertCircle,
    question: "Describe the specific challenge or pain point the client is facing.",
  },
  {
    id: "solution",
    label: "Solution",
    icon: Sparkles,
    question: "What's your proposed solution? Be specific about your approach.",
  },
  { id: "budget", label: "Budget", icon: DollarSign, question: "What's the budget range for this project?" },
  { id: "timeline", label: "Timeline", icon: Clock, question: "What's the expected timeline?" },
  { id: "tone", label: "Tone", icon: Palette, question: "What tone should the proposal have?" },
  { id: "proposalPages", label: "Pages", icon: FileText, question: "How many pages should the proposal be?" },
  { id: "generate", label: "Generate", icon: Sparkles, question: "Ready to generate your proposal!" },
]
