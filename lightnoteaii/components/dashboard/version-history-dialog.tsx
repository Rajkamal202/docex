"use client"

import { format, formatDistanceToNow } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, RotateCcw, Trash2, FileText } from "lucide-react"
import type { DraftVersion } from "@/hooks/use-autosave"

interface VersionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  versions: DraftVersion[]
  onRestore: (versionId: string) => void
  onDelete: (versionId: string) => void
}

export function VersionHistoryDialog({ open, onOpenChange, versions, onRestore, onDelete }: VersionHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Version History
          </DialogTitle>
          <DialogDescription>Restore previous versions of your proposal draft</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No saved versions yet</p>
              <p className="text-xs text-muted-foreground">Versions are saved automatically every 30 seconds</p>
            </div>
          ) : (
            <div className="space-y-2 pr-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {versions.length - index}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{version.label || `Draft ${versions.length - index}`}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{format(version.timestamp, "MMM d, h:mm a")}</span>
                        <Badge variant="secondary" className="text-xs">
                          {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onRestore(version.id)
                        onOpenChange(false)
                      }}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(version.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
