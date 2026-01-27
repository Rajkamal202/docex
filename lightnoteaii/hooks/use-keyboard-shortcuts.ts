"use client"

import { useEffect, useCallback } from "react"

type ShortcutAction = () => void

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: ShortcutAction
  description: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        // Allow Ctrl+S and Ctrl+Enter even in inputs
        if (!(event.ctrlKey && (event.key === "s" || event.key === "Enter"))) {
          return
        }
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    },
    [shortcuts, enabled],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

export const defaultShortcuts = {
  save: { key: "s", ctrl: true, description: "Save draft" },
  generate: { key: "Enter", ctrl: true, description: "Generate proposal" },
  preview: { key: "p", ctrl: true, shift: true, description: "Toggle preview" },
  newProposal: { key: "n", ctrl: true, description: "New proposal" },
  voiceInput: { key: "m", ctrl: true, description: "Toggle voice input" },
  importUrl: { key: "i", ctrl: true, shift: true, description: "Import from URL" },
  help: { key: "/", ctrl: true, description: "Show shortcuts" },
}
