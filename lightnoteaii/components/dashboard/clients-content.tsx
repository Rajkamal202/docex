"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  Globe,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Upload,
  Download,
  Users,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Star,
  Clock,
  X,
  User,
  Briefcase,
  StickyNote,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import { useClients, type Client } from "@/lib/client-store"

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Other",
]

const industryColors: Record<string, string> = {
  Technology: "bg-blue-500/10 text-blue-600 border-blue-200",
  Finance: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  Healthcare: "bg-red-500/10 text-red-600 border-red-200",
  "E-commerce": "bg-purple-500/10 text-purple-600 border-purple-200",
  Education: "bg-amber-500/10 text-amber-600 border-amber-200",
  Manufacturing: "bg-slate-500/10 text-slate-600 border-slate-200",
  "Real Estate": "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  Marketing: "bg-pink-500/10 text-pink-600 border-pink-200",
  Other: "bg-gray-500/10 text-gray-600 border-gray-200",
}

export function ClientsContent() {
  const { clients = [], addClient, updateClient, deleteClient, isLoading } = useClients()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [newClient, setNewClient] = useState<Partial<Client>>({
    industry: "Technology",
  })

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.industry.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "all") return matchesSearch
    if (activeFilter === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return matchesSearch && new Date(client.createdAt) > oneWeekAgo
    }
    if (activeFilter === "top") return matchesSearch && client.winRate >= 50
    return matchesSearch
  })

  const handleAddClient = () => {
    if (!newClient.companyName) return

    addClient({
      companyName: newClient.companyName || "",
      contactName: newClient.contactName || "",
      contactRole: newClient.contactRole || "",
      email: newClient.email || "",
      phone: newClient.phone || "",
      website: newClient.website || "",
      industry: newClient.industry || "Other",
      notes: newClient.notes || "",
    })

    setNewClient({ industry: "Technology" })
    setIsAddDialogOpen(false)
  }

  const handleUpdateClient = () => {
    if (!editingClient) return
    updateClient(editingClient.id, editingClient)
    setEditingClient(null)
  }

  const handleDeleteClient = (id: string) => {
    deleteClient(id)
    if (selectedClient?.id === id) setSelectedClient(null)
  }

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  const totalClients = clients.length
  const totalProposals = clients.reduce((sum, c) => sum + c.proposalCount, 0)
  const totalValue = clients.reduce((sum, c) => sum + c.totalValue, 0)
  const avgWinRate =
    clients.length > 0 ? Math.round(clients.reduce((sum, c) => sum + c.winRate, 0) / clients.length) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          <p className="text-sm text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Mac-style Window */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41] shadow-sm" />
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <h1 className="text-sm font-medium text-gray-700">Client Directory</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-600">
              <Upload className="h-3.5 w-3.5 mr-1.5" />
              Import
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-gray-600">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs bg-black hover:bg-gray-800">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>Add a client to quickly populate future proposals</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={newClient.companyName || ""}
                        onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={newClient.industry}
                        onValueChange={(v) => setNewClient({ ...newClient, industry: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input
                        id="contactName"
                        value={newClient.contactName || ""}
                        onChange={(e) => setNewClient({ ...newClient, contactName: e.target.value })}
                        placeholder="John Smith"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactRole">Role/Title</Label>
                      <Input
                        id="contactRole"
                        value={newClient.contactRole || ""}
                        onChange={(e) => setNewClient({ ...newClient, contactRole: e.target.value })}
                        placeholder="VP of Engineering"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email || ""}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="contact@company.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newClient.phone || ""}
                        onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={newClient.website || ""}
                      onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                      placeholder="www.company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newClient.notes || ""}
                      onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                      placeholder="Important details about this client..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClient} disabled={!newClient.companyName}>
                    Add Client
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 px-4 py-3 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">{totalClients}</p>
              <p className="text-[10px] text-muted-foreground">Clients</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">{totalProposals}</p>
              <p className="text-[10px] text-muted-foreground">Proposals</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">${(totalValue / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-muted-foreground">Total Value</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none">{avgWinRate}%</p>
              <p className="text-[10px] text-muted-foreground">Avg Win Rate</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/30">
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="h-8 bg-transparent p-0 gap-1">
              <TabsTrigger
                value="all"
                className="h-7 px-3 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                All Clients
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="h-7 px-3 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Clock className="h-3 w-3 mr-1" />
                Recent
              </TabsTrigger>
              <TabsTrigger
                value="top"
                className="h-7 px-3 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                <Star className="h-3 w-3 mr-1" />
                Top Performers
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content - List + Detail View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Client List */}
          <div
            className={`${selectedClient ? "w-1/2 border-r border-gray-100" : "w-full"} overflow-y-auto transition-all duration-300`}
          >
            {filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No clients yet</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Add your first client to start organizing your proposals and tracking win rates
                </p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Client
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredClients.map((client) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`group flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${
                      selectedClient?.id === client.id ? "bg-blue-50/50" : "hover:bg-gray-50/80"
                    }`}
                    onClick={() => setSelectedClient(client)}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        industryColors[client.industry]?.split(" ")[0] || "bg-gray-100"
                      }`}
                    >
                      <Building2
                        className={`h-5 w-5 ${industryColors[client.industry]?.split(" ")[1] || "text-gray-600"}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm truncate">{client.companyName}</h3>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 h-5 ${industryColors[client.industry] || ""}`}
                        >
                          {client.industry}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {client.contactName || "No contact"} {client.contactRole && `• ${client.contactRole}`}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="text-center">
                        <p className="font-medium text-foreground">{client.proposalCount}</p>
                        <p className="text-[10px]">Proposals</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-medium ${client.winRate >= 50 ? "text-green-600" : "text-foreground"}`}>
                          {client.winRate}%
                        </p>
                        <p className="text-[10px]">Win Rate</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingClient(client)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/generate?client=${client.id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              New Proposal
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClient(client.id)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronRight className="h-4 w-4 text-gray-300" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <AnimatePresence>
            {selectedClient && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-1/2 overflow-y-auto bg-gray-50/30"
              >
                {/* Detail Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        industryColors[selectedClient.industry]?.split(" ")[0] || "bg-gray-100"
                      }`}
                    >
                      <Building2
                        className={`h-6 w-6 ${
                          industryColors[selectedClient.industry]?.split(" ")[1] || "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold">{selectedClient.companyName}</h2>
                      <Badge variant="outline" className={`text-xs ${industryColors[selectedClient.industry] || ""}`}>
                        {selectedClient.industry}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedClient(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Detail Content */}
                <div className="p-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
                      <p className="text-2xl font-semibold">{selectedClient.proposalCount}</p>
                      <p className="text-xs text-muted-foreground">Proposals</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
                      <p className={`text-2xl font-semibold ${selectedClient.winRate >= 50 ? "text-green-600" : ""}`}>
                        {selectedClient.winRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">Win Rate</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
                      <p className="text-2xl font-semibold">${(selectedClient.totalValue / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-3">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      {selectedClient.contactName && (
                        <div className="flex items-center gap-3 text-sm">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedClient.contactName}</span>
                          {selectedClient.contactRole && (
                            <span className="text-muted-foreground">• {selectedClient.contactRole}</span>
                          )}
                        </div>
                      )}
                      {selectedClient.email && (
                        <div className="flex items-center gap-3 text-sm group/email">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:underline">
                            {selectedClient.email}
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover/email:opacity-100"
                            onClick={() => copyEmail(selectedClient.email)}
                          >
                            {copiedEmail ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                      {selectedClient.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedClient.phone}</span>
                        </div>
                      )}
                      {selectedClient.website && (
                        <div className="flex items-center gap-3 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={`https://${selectedClient.website.replace(/^https?:\/\//, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {selectedClient.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedClient.notes && (
                    <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <StickyNote className="h-4 w-4 text-muted-foreground" />
                        Notes
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedClient.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/dashboard/generate?client=${selectedClient.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Proposal
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={() => setEditingClient(selectedClient)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update client information</DialogDescription>
          </DialogHeader>
          {editingClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editingClient.companyName}
                    onChange={(e) => setEditingClient({ ...editingClient, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={editingClient.industry}
                    onValueChange={(v) => setEditingClient({ ...editingClient, industry: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={editingClient.contactName}
                    onChange={(e) => setEditingClient({ ...editingClient, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role/Title</Label>
                  <Input
                    value={editingClient.contactRole}
                    onChange={(e) => setEditingClient({ ...editingClient, contactRole: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={editingClient.website}
                  onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editingClient.notes}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClient(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateClient}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
