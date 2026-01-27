"use client"

import { useVoiceInput } from "@/hooks/use-voice-input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceInputButtonProps {
  onResult: (transcript: string) => void
  className?: string
}

export function VoiceInputButton({ onResult, className }: VoiceInputButtonProps) {
  const { isListening, isSupported, interimTranscript, error, toggleListening } = useVoiceInput({
    onResult,
    continuous: false,
  })

  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled className={className}>
              <MicOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice input not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isListening ? "default" : "ghost"}
            size="icon"
            onClick={toggleListening}
            className={cn(className, isListening && "animate-pulse bg-red-500 hover:bg-red-600")}
          >
            {error ? (
              <AlertCircle className="h-4 w-4" />
            ) : isListening ? (
              <Mic className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Click to stop" : "Voice input (Ctrl+M)"}</p>
          {interimTranscript && <p className="mt-1 text-xs italic">{interimTranscript}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
