"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProposalPreview } from "@/components/dashboard/proposal-preview"
import { TemplatePreviewCard } from "@/components/dashboard/template-preview-card"
import type { CollectedInfo } from "@/app/(dashboard)/dashboard/generate/types"

interface GenerateSidebarProps {
  activeTab: "preview" | "templates"
  onTabChange: (value: "preview" | "templates") => void
  isGenerating: boolean
  generationState: string
  generatedContent: string
  aiProposal: any
  collectedInfo: CollectedInfo
  isEditMode: boolean
  onEditModeChange: (value: boolean) => void
  onContentChange: (value: string) => void
  templates: Array<{ id: string; name: string; description: string; color: string }>
  getRecommendedTemplates: () => string[]
  onTemplateSelect: (templateId: string) => void
}

export function GenerateSidebar({
  activeTab,
  onTabChange,
  isGenerating,
  generationState,
  generatedContent,
  aiProposal,
  collectedInfo,
  isEditMode,
  onEditModeChange,
  onContentChange,
  templates,
  getRecommendedTemplates,
  onTemplateSelect,
}: GenerateSidebarProps) {
  return (
    <div className="w-[520px] flex-shrink-0 flex flex-col bg-gray-50/50 border-l border-gray-100 min-h-0">
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as "preview" | "templates")}
        className="flex flex-col h-full min-h-0"
      >
        <TabsList className="grid w-full grid-cols-2 m-3 mb-0 w-[calc(100%-24px)] flex-shrink-0">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 p-4 overflow-y-auto min-h-0">
          <div className="min-h-[500px] h-full">
            <ProposalPreview
              generatedContent={generatedContent}
              isGenerating={isGenerating || generationState === "generating" || generationState === "creating"}
              collectedInfo={{
                proposalType: collectedInfo.proposalType || "Proposal",
                template: collectedInfo.template?.toLowerCase() || "professional",
                clientName: collectedInfo.clientCompany || collectedInfo.clientName || "",
                clientCompany: collectedInfo.clientCompany || collectedInfo.clientName || "",
                industry: collectedInfo.clientIndustry || collectedInfo.industry || "",
                problem: aiProposal?.problemStatement || aiProposal?.problem || collectedInfo.problem || "",
                deliverables: aiProposal?.deliverables || collectedInfo.solution || "",
                timeline: aiProposal?.timeline || collectedInfo.timeline || "",
                budget: aiProposal?.investment || collectedInfo.budget || "",
                tone: collectedInfo.tone || "Professional",
                solution: aiProposal?.solution || collectedInfo.solution || "",
                summary: aiProposal?.summary || aiProposal?.executive_summary || "",
                preparedBy: collectedInfo.preparedBy || "",
                preparedByEmail: collectedInfo.preparedByEmail || "",
                proposalPages: collectedInfo.proposalPages,
                websitePages: collectedInfo.websitePages || "",
                websiteFeatures: collectedInfo.websiteFeatures || [],
                primaryAction: collectedInfo.primaryAction || "",
              }}
              branding={{
                companyName: collectedInfo.companyName || "",
                email: collectedInfo.yourEmail || "",
                website: collectedInfo.yourWebsite || "",
                phone: collectedInfo.yourPhone || "",
                preparedBy: collectedInfo.preparedBy || "",
              }}
              aiProposal={aiProposal}
              isEditMode={isEditMode}
              setIsEditMode={onEditModeChange}
              onContentChange={onContentChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="flex-1 p-4 overflow-y-auto min-h-0">
          <div className="text-center mb-4">
            <h3 className="text-sm font-medium text-gray-900">Choose a Template</h3>
            <p className="text-xs text-gray-500 mt-1">Select a style for your proposal</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...templates]
              .sort((a, b) => {
                const aRec = getRecommendedTemplates().includes(a.id) ? 0 : 1
                const bRec = getRecommendedTemplates().includes(b.id) ? 0 : 1
                return aRec - bRec
              })
              .map((template) => {
                const isRecommended = getRecommendedTemplates().includes(template.id)
                return (
                  <TemplatePreviewCard
                    key={template.id}
                    template={template}
                    isRecommended={isRecommended}
                    isSelected={collectedInfo.template === template.id}
                    onClick={() => onTemplateSelect(template.id)}
                  />
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
