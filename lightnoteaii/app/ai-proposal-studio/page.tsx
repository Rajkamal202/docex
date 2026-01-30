"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplatesPage } from "@/components/templates-generator"
import { AIProposalStudio } from "@/components/ai-proposal-studio"
import { SuperDocEditor } from "@/components/superdoc-editor"

export default function AIProposalStudioPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">AI Proposal Studio</h1>
              <p className="text-sm text-slate-500">Templates, DOCX editing, and proposal improvement in one place.</p>
            </div>
          </div>

          <Tabs defaultValue="templates" className="flex flex-col">
            <TabsList className="w-fit">
              <TabsTrigger value="templates">Templates &amp; Generator</TabsTrigger>
              <TabsTrigger value="docx">DOCX Editor</TabsTrigger>
              <TabsTrigger value="improve">Improve Proposal</TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="mt-6">
              <TemplatesPage />
            </TabsContent>

            <TabsContent value="docx" className="mt-6">
              <SuperDocEditor />
            </TabsContent>

            <TabsContent value="improve" className="mt-6">
              <AIProposalStudio />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
