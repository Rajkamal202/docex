"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void
  onInterim?: (transcript: string) => void
  continuous?: boolean
  language?: string
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const { onResult, onInterim, continuous = false, language = "en-US" } = options

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any | null>(null)

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = continuous
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ""
        let interim = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interim += result[0].transcript
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript)
          onResult?.(finalTranscript)
        }

        setInterimTranscript(interim)
        onInterim?.(interim)
      }

      recognitionRef.current.onerror = (event) => {
        setError(event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        setInterimTranscript("")
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [continuous, language, onResult, onInterim])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return

    setError(null)
    setTranscript("")
    setInterimTranscript("")

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (err) {
      setError("Failed to start voice recognition")
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  }
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
