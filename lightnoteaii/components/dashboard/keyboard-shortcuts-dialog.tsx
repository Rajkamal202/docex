"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  { keys: ["Ctrl", "S"], description: "Save draft" },
  { keys: ["Ctrl", "Enter"], description: "Generate proposal" },
  { keys: ["Ctrl", "Shift", "P"], description: "Toggle preview panel" },
  { keys: ["Ctrl", "N"], description: "New proposal" },
  { keys: ["Ctrl", "M"], description: "Toggle voice input" },
  { keys: ["Ctrl", "Shift", "I"], description: "Import from URL" },
  { keys: ["Ctrl", "D"], description: "Duplicate proposal" },
  { keys: ["Ctrl", "H"], description: "View version history" },
  { keys: ["Ctrl", "/"], description: "Show this help" },
  { keys: ["Esc"], description: "Close dialogs" },
]

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Speed up your workflow with these shortcuts</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <Badge key={keyIndex} variant="secondary" className="font-mono text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
