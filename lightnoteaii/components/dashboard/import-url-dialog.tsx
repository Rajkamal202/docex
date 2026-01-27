"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Loader2, CheckCircle2, AlertCircle, Sparkles, FileText } from "lucide-react"

interface ImportUrlDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: ExtractedData) => void
}

interface ExtractedData {
  clientName?: string
  projectTitle?: string
  projectDescription?: string
  requirements?: string[]
  budget?: string
  timeline?: string
  industry?: string
  skills?: string[]
}

export function ImportUrlDialog({ open, onOpenChange, onImport }: ImportUrlDialogProps) {
  const [url, setUrl] = useState("")
  const [pastedContent, setPastedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"url" | "paste">("url")

  const handleExtract = async () => {
    const content = activeTab === "url" ? url.trim() : pastedContent.trim()
    if (!content) return

    setIsLoading(true)
    setError(null)
    setExtractedData(null)

    try {
      const response = await fetch("/api/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: activeTab === "url" ? content : undefined,
          content: activeTab === "paste" ? content : `Extract job posting information from this URL: ${content}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to extract data")
      }

      const { extractedData: data } = await response.json()
      setExtractedData(data)
    } catch {
      setError("Failed to extract data. Please try pasting the job description directly.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = () => {
    if (extractedData) {
      onImport(extractedData)
      setUrl("")
      setPastedContent("")
      setExtractedData(null)
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    setUrl("")
    setPastedContent("")
    setExtractedData(null)
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Import Job Details
          </DialogTitle>
          <DialogDescription>Paste a URL or job description and AI will extract the requirements</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "url" | "paste")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">
              <Link2 className="h-4 w-4 mr-2" />
              From URL
            </TabsTrigger>
            <TabsTrigger value="paste">
              <FileText className="h-4 w-4 mr-2" />
              Paste Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="url">Job Posting URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  placeholder="https://upwork.com/jobs/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button onClick={handleExtract} disabled={!url.trim() || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Works with Upwork, Fiverr, LinkedIn, Indeed, and most job boards
              </p>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="content">Job Description</Label>
              <Textarea
                id="content"
                placeholder="Paste the job description here..."
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                disabled={isLoading}
                className="min-h-[150px]"
              />
              <div className="flex justify-end">
                <Button onClick={handleExtract} disabled={!pastedContent.trim() || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Extract Details
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {extractedData && (
          <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Data extracted successfully
            </div>

            <div className="space-y-2 text-sm">
              {extractedData.clientName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client:</span>
                  <span className="font-medium">{extractedData.clientName}</span>
                </div>
              )}
              {extractedData.projectTitle && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project:</span>
                  <span className="font-medium">{extractedData.projectTitle}</span>
                </div>
              )}
              {extractedData.budget && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{extractedData.budget}</span>
                </div>
              )}
              {extractedData.timeline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timeline:</span>
                  <span className="font-medium">{extractedData.timeline}</span>
                </div>
              )}
              {extractedData.industry && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry:</span>
                  <Badge variant="secondary">{extractedData.industry}</Badge>
                </div>
              )}
            </div>

            {extractedData.skills && extractedData.skills.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Required Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {extractedData.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {extractedData.requirements && extractedData.requirements.length > 0 && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Requirements:</span>
                <div className="flex flex-wrap gap-1">
                  {extractedData.requirements.map((req, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {extractedData.projectDescription && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground">Description:</span>
                <p className="text-xs line-clamp-3">{extractedData.projectDescription}</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!extractedData}>
            Import & Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
