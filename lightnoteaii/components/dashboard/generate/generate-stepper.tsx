"use client"

import { CheckCircle2 } from "lucide-react"
import type { CollectedInfo, ConversationStep } from "@/app/(dashboard)/dashboard/generate/types"

interface GenerateStepperProps {
  steps: ConversationStep[]
  currentStep: number
  collectedInfo: CollectedInfo
}

export function GenerateStepper({ steps, currentStep, collectedInfo }: GenerateStepperProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.slice(0, -1).map((step, index) => {
          const Icon = step.icon
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          if (step.condition && !step.condition(collectedInfo)) {
            return null
          }

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? "bg-emerald-500 text-white" : ""}
                    ${isCurrent ? "bg-gray-900 text-white ring-4 ring-gray-900/10" : ""}
                    ${isUpcoming ? "bg-gray-100 text-gray-400" : ""}
                  `}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${isCurrent ? "text-gray-900" : "text-gray-400"}`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 2 && (
                <div
                  className={`w-8 h-0.5 mx-1 mt-[-16px] ${index < currentStep ? "bg-emerald-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
