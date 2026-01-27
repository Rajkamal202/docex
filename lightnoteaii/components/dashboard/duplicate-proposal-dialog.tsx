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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Copy, FileText } from "lucide-react"

interface DuplicateProposalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposals: Array<{
    id: string
    name: string
    client: string
    date: string
    score?: number
    status?: string
  }>
  onDuplicate: (proposalId: string, newName: string) => void
}

export function DuplicateProposalDialog({
  open,
  onOpenChange,
  proposals = [],
  onDuplicate,
}: DuplicateProposalDialogProps) {
  const [selectedProposal, setSelectedProposal] = useState<string>("")
  const [newName, setNewName] = useState("")

  const selectedData = proposals.find((p) => p.id === selectedProposal)

  const handleDuplicate = () => {
    if (selectedProposal && newName.trim()) {
      onDuplicate(selectedProposal, newName.trim())
      setSelectedProposal("")
      setNewName("")
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    setSelectedProposal("")
    setNewName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Duplicate Proposal
          </DialogTitle>
          <DialogDescription>Select a previous proposal to use as a starting point</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select proposal to duplicate</Label>
            <RadioGroup value={selectedProposal} onValueChange={setSelectedProposal}>
              <div className="max-h-[200px] space-y-2 overflow-auto rounded-lg border p-2">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                      selectedProposal === proposal.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedProposal(proposal.id)}
                  >
                    <RadioGroupItem value={proposal.id} id={proposal.id} />
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{proposal.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{proposal.client}</span>
                        <span>•</span>
                        <span>{proposal.date}</span>
                      </div>
                    </div>
                    {proposal.score && (
                      <Badge
                        variant="secondary"
                        className={
                          proposal.score >= 80
                            ? "bg-emerald-500/10 text-emerald-600"
                            : proposal.score >= 60
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                        }
                      >
                        {proposal.score}/100
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {selectedData && (
            <div className="space-y-2">
              <Label htmlFor="newName">New proposal name</Label>
              <Input
                id="newName"
                placeholder={`Copy of ${selectedData.name}`}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                All content will be copied. You can edit it after duplication.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDuplicate} disabled={!selectedProposal || !newName.trim()}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
