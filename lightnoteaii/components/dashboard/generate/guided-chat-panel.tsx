"use client"

import type React from "react"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Bot,
  Check,
  LayoutTemplate,
  Lightbulb,
  Loader2,
  Send,
  Sparkles,
  Star,
  User,
  Zap,
} from "lucide-react"
import type { ChatMessage, CollectedInfo, ConversationStep } from "@/app/(dashboard)/dashboard/generate/types"

interface GuidedChatPanelProps {
  messages: ChatMessage[]
  collectedInfo: CollectedInfo
  isGenerating: boolean
  isAwaitingClarification: boolean
  generationState: string
  generationError: string | null
  currentStep: number
  conversationSteps: ConversationStep[]
  inputValue: string
  onInputChange: (value: string) => void
  onSubmitInput: () => void
  onGenerate: () => void
  onTemplateSelect: (templateId: string, templateName: string) => void
  onOptionSelect: (option: string, fieldId?: string) => void
  onMultiSelectOption: (field: string, option: string) => void
  getSortedOptions: (options: string[], stepId: string) => string[]
  isOptionRecommended: (option: string, stepId: string) => boolean
  clarificationResponse: string
  onClarificationChange: (value: string) => void
  clarificationQuestions: Array<{ question: string; reason: string; field: string }>
  messagesEndRef: React.RefObject<HTMLDivElement>
  templates: Array<{ id: string; name: string; description: string; color: string }>
  getRecommendedTemplates: () => string[]
}

export function GuidedChatPanel({
  messages,
  collectedInfo,
  isGenerating,
  isAwaitingClarification,
  generationState,
  generationError,
  currentStep,
  conversationSteps,
  inputValue,
  onInputChange,
  onSubmitInput,
  onGenerate,
  onTemplateSelect,
  onOptionSelect,
  onMultiSelectOption,
  getSortedOptions,
  isOptionRecommended,
  clarificationResponse,
  onClarificationChange,
  clarificationQuestions,
  messagesEndRef,
  templates,
  getRecommendedTemplates,
}: GuidedChatPanelProps) {
  const isReadyToGenerate = currentStep === conversationSteps.length - 1
  const currentStepId = conversationSteps[currentStep]?.id

  const placeholder = useMemo(() => {
    switch (currentStepId) {
      case "client":
        return "Enter client name or company..."
      case "yourInfo":
        return "Your name, Your company (e.g., John Smith, Acme Agency)..."
      case "problem":
        return "Describe the client's problem or need..."
      case "solution":
        return "Describe your proposed solution..."
      case "budget":
        return "Enter budget range (e.g., $5,000 - $10,000)..."
      case "timeline":
        return "Enter timeline (e.g., 4 weeks, 2 months)..."
      case "proposalPages":
        return "Choose page count (e.g., 2 pages)..."
      case "websitePages":
        return "Select number of pages (e.g., 6-8 pages)..."
      case "primaryAction":
        return "Enter primary visitor action (e.g., More phone calls)..."
      default:
        return "Type your response..."
    }
  }, [currentStepId])

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 min-h-0">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-gray-900 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                {message.whyAsking && message.role === "assistant" && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-blue-700">Why we're asking:</span>
                        <p className="text-xs text-blue-600 mt-0.5">{message.whyAsking}</p>
                      </div>
                    </div>
                  </div>
                )}

                {message.suggestions && message.suggestions.length > 0 && message.role === "assistant" && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">
                        Suggestions for {collectedInfo.proposalType}:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => onOptionSelect(suggestion, message.field)}
                          className="text-xs px-2.5 py-1.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {message.isTemplateSelection && message.role === "assistant" && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[...templates]
                      .sort((a, b) => {
                        const aRec = getRecommendedTemplates().includes(a.id) ? 0 : 1
                        const bRec = getRecommendedTemplates().includes(b.id) ? 0 : 1
                        return aRec - bRec
                      })
                      .map((template) => {
                        const isRecommended = getRecommendedTemplates().includes(template.id)
                        return (
                          <Card
                            key={template.id}
                            className={cn(
                              "p-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-2 relative",
                              collectedInfo.template === template.id
                                ? "border-violet-500 bg-violet-50"
                                : isRecommended
                                  ? "border-blue-200 bg-blue-50/30"
                                  : "border-gray-200 hover:border-gray-300",
                            )}
                            onClick={() => onTemplateSelect(template.id, template.name)}
                          >
                            {isRecommended && (
                              <div className="absolute -top-2 -right-2">
                                <Badge className="bg-blue-500 text-white text-[10px] px-1.5 py-0">Recommended</Badge>
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${template.color}15` }}
                              >
                                <LayoutTemplate className="w-5 h-5" style={{ color: template.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                                <p className="text-xs text-gray-500">{template.description}</p>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                  </div>
                )}

                {message.options && message.role === "assistant" && !message.isTemplateSelection && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getSortedOptions(message.options, message.field || "").map((option) => {
                      const isRecommended = isOptionRecommended(option, message.field || "")
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (message.multiSelect && message.field) {
                              onMultiSelectOption(message.field, option)
                            } else {
                              onOptionSelect(option, message.field)
                            }
                          }}
                          className={cn(
                            "px-3 py-1.5 text-sm font-medium rounded-full border transition-colors relative",
                            isRecommended
                              ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-400"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
                            message.multiSelect &&
                              (collectedInfo[message.field as keyof CollectedInfo] as string[])?.includes(option) &&
                              "border-primary bg-primary/5 text-primary font-semibold",
                          )}
                        >
                          {isRecommended && !message.multiSelect && <Star className="w-3 h-3 inline mr-1 text-blue-500" />}
                          {option}
                        </button>
                      )
                    })}
                  </div>
                )}

                {message.clarificationQuestions && isAwaitingClarification && (
                  <div className="mt-4 space-y-4">
                    <div className="space-y-3">
                      {clarificationQuestions.map((q, idx) => (
                        <div key={idx} className="bg-white/60 rounded-lg p-3 border border-gray-100">
                          <p className="text-sm font-medium text-gray-800">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 italic">{q.reason}</p>
                        </div>
                      ))}
                    </div>

                    <Textarea
                      value={clarificationResponse}
                      onChange={(e) => onClarificationChange(e.target.value)}
                      placeholder="Type your response here... You can answer all questions in one message."
                      className="min-h-[100px] bg-white border-gray-200 resize-none focus:border-emerald-300 focus:ring-emerald-500/20"
                    />
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {isReadyToGenerate && !isGenerating && !isAwaitingClarification && (
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Proposal...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Proposal
                </>
              )}
            </Button>
          )}

          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-600" />
                  <span className="text-sm text-gray-600">Generating your proposal...</span>
                </div>
              </div>
            </div>
          )}

          {isAwaitingClarification && !isGenerating && (
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Response...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Response
                </>
              )}
            </Button>
          )}

          {generationState === "error" && generationError && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl rounded-bl-md px-4 py-3 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">Generation Failed</span>
                </div>
                <p className="text-xs text-red-600">{generationError}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {!isReadyToGenerate && !isGenerating && !isAwaitingClarification && currentStep < conversationSteps.length - 1 && (
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (inputValue.trim()) {
                onSubmitInput()
              }
            }}
            className="flex gap-3"
          >
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 h-11 bg-gray-50 border-gray-200 focus:bg-white"
              autoFocus
            />
            <Button type="submit" disabled={!inputValue.trim()} className="h-11 px-4 bg-violet-600 hover:bg-violet-700 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">Press Enter to send or click the options above</p>
        </div>
      )}
    </div>
  )
}
