"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Info, AlertTriangle, Sparkles } from "lucide-react"

type ValidationIssue = {
  id: string
  type: "error" | "warning" | "info" | "success"
  message: string
  field?: string
  suggestion?: string
}

interface ValidationPanelProps {
  collectedInfo: Record<string, string | undefined>
  currentPhase: string
}

export function ValidationPanel({ collectedInfo, currentPhase }: ValidationPanelProps) {
  const [issues, setIssues] = useState<ValidationIssue[]>([])

  useEffect(() => {
    const newIssues: ValidationIssue[] = []

    // Check for required fields
    if (!collectedInfo.proposalType) {
      newIssues.push({
        id: "no-type",
        type: "error",
        message: "Proposal type not selected",
        field: "proposalType",
        suggestion: "Select a proposal type to continue",
      })
    }

    if (!collectedInfo.clientCompany && currentPhase !== "type") {
      newIssues.push({
        id: "no-client",
        type: "warning",
        message: "Client company name missing",
        field: "clientCompany",
        suggestion: "Adding the client name personalizes your proposal",
      })
    }

    if (!collectedInfo.problem && currentPhase !== "type" && currentPhase !== "universal") {
      newIssues.push({
        id: "no-problem",
        type: "warning",
        message: "Problem statement not defined",
        field: "problem",
        suggestion: "Clearly stating the problem increases relevance",
      })
    }

    if (!collectedInfo.budget && currentPhase === "confirm") {
      newIssues.push({
        id: "no-budget",
        type: "info",
        message: "Budget not specified",
        field: "budget",
        suggestion: "Including budget helps set expectations",
      })
    }

    // Positive feedback
    if (collectedInfo.proposalType && collectedInfo.clientCompany && collectedInfo.problem) {
      newIssues.push({
        id: "good-basics",
        type: "success",
        message: "Core information captured",
        suggestion: "Your proposal has the essential details",
      })
    }

    if (collectedInfo.deliverables) {
      newIssues.push({
        id: "has-deliverables",
        type: "success",
        message: "Deliverables defined",
        suggestion: "Clear deliverables improve win rates",
      })
    }

    setIssues(newIssues)
  }, [collectedInfo, currentPhase])

  const errorCount = issues.filter((i) => i.type === "error").length
  const warningCount = issues.filter((i) => i.type === "warning").length
  const successCount = issues.filter((i) => i.type === "success").length

  const completeness = Object.values(collectedInfo).filter(Boolean).length
  const maxFields = 15
  const completenessPercent = Math.min(100, (completeness / maxFields) * 100)

  const getIcon = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getBgColor = (type: ValidationIssue["type"]) => {
    switch (type) {
      case "error":
        return "bg-destructive/5 border-destructive/20"
      case "warning":
        return "bg-amber-50 border-amber-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      case "success":
        return "bg-green-50 border-green-200"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4" />
            Validation
          </CardTitle>
          <div className="flex gap-1">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount}
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                {warningCount}
              </Badge>
            )}
            {successCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                {successCount}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Completeness</span>
            <span className="font-medium">{Math.round(completenessPercent)}%</span>
          </div>
          <Progress value={completenessPercent} className="h-1.5" />
        </div>

        <div className="space-y-2">
          {issues.map((issue) => (
            <div key={issue.id} className={`rounded-lg border p-2 ${getBgColor(issue.type)}`}>
              <div className="flex items-start gap-2">
                {getIcon(issue.type)}
                <div className="flex-1 text-xs">
                  <p className="font-medium">{issue.message}</p>
                  {issue.suggestion && <p className="mt-0.5 text-muted-foreground">{issue.suggestion}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {issues.length === 0 && (
          <div className="flex items-center justify-center py-4 text-center text-xs text-muted-foreground">
            <p>Start answering questions to see validation feedback</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
