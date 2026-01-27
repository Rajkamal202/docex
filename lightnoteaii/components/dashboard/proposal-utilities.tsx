"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Type,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Gauge,
  RefreshCw,
  DollarSign,
  Calendar,
  FileText,
  Users,
  Target,
} from "lucide-react"

type ProposalSettings = {
  tone: number // 0 = formal, 100 = casual
  length: number // 0 = concise, 100 = detailed
  urgency: number // 0 = low, 100 = high
}

type ChecklistItem = {
  id: string
  label: string
  description: string
  checked: boolean
  required: boolean
  icon: React.ElementType
}

interface ProposalUtilitiesProps {
  content?: string
  onSettingsChange?: (settings: ProposalSettings) => void
  onRegenerateSection?: (section: string) => void
}

export function ProposalUtilities({ content = "", onSettingsChange, onRegenerateSection }: ProposalUtilitiesProps) {
  const [settings, setSettings] = useState<ProposalSettings>({
    tone: 30,
    length: 50,
    urgency: 50,
  })

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "pricing",
      label: "Pricing included",
      description: "Clear investment amount",
      checked: false,
      required: true,
      icon: DollarSign,
    },
    {
      id: "timeline",
      label: "Timeline defined",
      description: "Project duration specified",
      checked: false,
      required: true,
      icon: Calendar,
    },
    {
      id: "deliverables",
      label: "Deliverables listed",
      description: "Clear outcomes defined",
      checked: false,
      required: true,
      icon: FileText,
    },
    {
      id: "cta",
      label: "Call-to-action",
      description: "Next steps are clear",
      checked: false,
      required: true,
      icon: Target,
    },
    {
      id: "personalized",
      label: "Personalized",
      description: "Client name mentioned",
      checked: false,
      required: false,
      icon: Users,
    },
    {
      id: "social-proof",
      label: "Social proof",
      description: "Testimonials or case studies",
      checked: false,
      required: false,
      icon: CheckCircle,
    },
  ])

  // Calculate stats from content
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const charCount = content.length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const paragraphCount = content.split(/\n\n+/).filter(Boolean).length

  // Auto-check checklist items based on content
  useEffect(() => {
    const lowerContent = content.toLowerCase()
    setChecklist((prev) =>
      prev.map((item) => {
        let isChecked = false
        switch (item.id) {
          case "pricing":
            isChecked = /\$[\d,]+|\d+\s*(usd|dollars?)|(investment|price|cost|budget)/i.test(content)
            break
          case "timeline":
            isChecked = /(week|month|day|timeline|duration|deadline)/i.test(content)
            break
          case "deliverables":
            isChecked = /(deliverable|deliver|provide|include)/i.test(content)
            break
          case "cta":
            isChecked = /(next step|schedule|contact|call|sign|approve|let's)/i.test(content)
            break
          case "personalized":
            isChecked = content.length > 0 && !/\[client\]|\[company\]/i.test(content)
            break
          case "social-proof":
            isChecked = /(testimonial|review|case study|client said|according to)/i.test(content)
            break
        }
        return { ...item, checked: isChecked }
      }),
    )
  }, [content])

  const handleSettingChange = (key: keyof ProposalSettings, value: number[]) => {
    const newSettings = { ...settings, [key]: value[0] }
    setSettings(newSettings)
    onSettingsChange?.(newSettings)
  }

  const handleChecklistToggle = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const requiredChecked = checklist.filter((i) => i.required && i.checked).length
  const requiredTotal = checklist.filter((i) => i.required).length
  const completionPercent = (requiredChecked / requiredTotal) * 100

  const getToneLabel = (value: number) => {
    if (value < 33) return "Professional"
    if (value < 66) return "Balanced"
    return "Conversational"
  }

  const getLengthLabel = (value: number) => {
    if (value < 33) return "Concise"
    if (value < 66) return "Standard"
    return "Detailed"
  }

  const getUrgencyLabel = (value: number) => {
    if (value < 33) return "Low"
    if (value < 66) return "Medium"
    return "High"
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Type className="h-4 w-4" />
            Document Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-6 w-6 justify-center rounded-full p-0 text-xs">
                {wordCount}
              </Badge>
              <span className="text-muted-foreground">words</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-6 w-6 justify-center rounded-full p-0 text-xs">
                {charCount}
              </Badge>
              <span className="text-muted-foreground">characters</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{paragraphCount} sections</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Adjustments */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4" />
            Quick Adjustments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Tone</Label>
              <Badge variant="outline" className="text-xs">
                {getToneLabel(settings.tone)}
              </Badge>
            </div>
            <Slider
              value={[settings.tone]}
              onValueChange={(v) => handleSettingChange("tone", v)}
              max={100}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Formal</span>
              <span>Casual</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Length</Label>
              <Badge variant="outline" className="text-xs">
                {getLengthLabel(settings.length)}
              </Badge>
            </div>
            <Slider
              value={[settings.length]}
              onValueChange={(v) => handleSettingChange("length", v)}
              max={100}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Concise</span>
              <span>Detailed</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Urgency</Label>
              <Badge variant="outline" className="text-xs">
                {getUrgencyLabel(settings.urgency)}
              </Badge>
            </div>
            <Slider
              value={[settings.urgency]}
              onValueChange={(v) => handleSettingChange("urgency", v)}
              max={100}
              step={1}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={() => onRegenerateSection?.("all")}
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Regenerate with Settings
          </Button>
        </CardContent>
      </Card>

      {/* Pre-send Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4" />
              Pre-send Checklist
            </CardTitle>
            <Badge variant={completionPercent === 100 ? "default" : "secondary"} className="text-xs">
              {requiredChecked}/{requiredTotal} required
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Progress value={completionPercent} className="h-1.5" />

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border p-2 transition-colors hover:bg-muted/50"
              >
                <Checkbox id={item.id} checked={item.checked} onCheckedChange={() => handleChecklistToggle(item.id)} />
                <div className="flex-1">
                  <label htmlFor={item.id} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {item.label}
                    {item.required && <span className="text-xs text-destructive">*</span>}
                  </label>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                {item.checked ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : item.required ? (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                ) : null}
              </div>
            ))}
          </div>

          {completionPercent < 100 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs">Complete all required items before sending your proposal for best results.</p>
            </div>
          )}

          {completionPercent === 100 && (
            <div className="flex items-start gap-2 rounded-lg bg-green-50 p-2 text-green-800">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs">Your proposal looks ready to send!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
