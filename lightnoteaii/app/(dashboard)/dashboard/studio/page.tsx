"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplatesPage } from "@/components/templates-generator"
import { AIProposalStudio } from "@/components/ai-proposal-studio"

export default function StudioPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">AI Proposal Studio</h1>
      </div>

      <Tabs defaultValue="templates" className="flex-1 flex flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="templates">Templates & Generator</TabsTrigger>
          <TabsTrigger value="improve">Improve Proposal</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="flex-1 mt-6">
          <TemplatesPage />
        </TabsContent>

        <TabsContent value="improve" className="flex-1 mt-6">
          <AIProposalStudio />
        </TabsContent>
      </Tabs>
    </div>
  )
}
