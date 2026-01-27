"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export type Client = {
  id: string
  companyName: string
  contactName: string
  contactRole: string
  email: string
  phone: string
  website: string
  industry: string
  notes: string
  proposalCount: number
  totalValue: number
  winRate: number
  createdAt: string
  lastProposal: string
}

type ClientContextType = {
  clients: Client[]
  addClient: (
    client: Omit<Client, "id" | "proposalCount" | "totalValue" | "winRate" | "createdAt" | "lastProposal">,
  ) => Promise<Client | null>
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  getClientById: (id: string) => Client | undefined
  incrementProposalCount: (clientId: string, value: number, won?: boolean) => Promise<void>
  isLoading: boolean
  refreshClients: () => Promise<void>
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

function mapDbRowToClient(c: any): Client {
  return {
    id: c.id,
    companyName: c.company || "",
    contactName: c.name,
    contactRole: "",
    email: c.email || "",
    phone: "",
    website: "",
    industry: c.industry || "",
    notes: c.notes || "",
    proposalCount: 0,
    totalValue: 0,
    winRate: 0,
    createdAt: c.created_at.split("T")[0],
    lastProposal: "-",
  }
}

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const mounted = useRef(false)
  const fetchInProgress = useRef(false)

  const clientMap = useRef<Map<string, Client>>(new Map())

  useEffect(() => {
    clientMap.current.clear()
    clients.forEach((c) => clientMap.current.set(c.id, c))
  }, [clients])

  const fetchClients = useCallback(async () => {
    if (fetchInProgress.current) return
    fetchInProgress.current = true

    if (typeof window === "undefined") {
      setIsLoading(false)
      fetchInProgress.current = false
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setIsLoading(false)
      fetchInProgress.current = false
      return
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        const errorMessage = authError.message || ""
        if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Refresh Token")) {
          if (mounted.current) {
            setClients([])
            setIsLoading(false)
            setUserId(null)
          }
          fetchInProgress.current = false
          return
        }
      }

      if (!user) {
        if (mounted.current) {
          setClients([])
          setIsLoading(false)
          setUserId(null)
        }
        fetchInProgress.current = false
        return
      }

      if (mounted.current) {
        setUserId(user.id)
      }

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const mappedClients: Client[] = (data || []).map(mapDbRowToClient)

      if (mounted.current) {
        setClients(mappedClients)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      if (mounted.current) {
        setIsLoading(false)
      }
    } finally {
      fetchInProgress.current = false
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    fetchClients()

    if (typeof window === "undefined") return

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (mounted.current) {
        fetchClients()
      }
    })

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [fetchClients])

  const addClient = useCallback(
    async (
      clientData: Omit<Client, "id" | "proposalCount" | "totalValue" | "winRate" | "createdAt" | "lastProposal">,
    ): Promise<Client | null> => {
      if (!userId) return null

      const supabase = getSupabaseBrowserClient()
      if (!supabase) return null

      try {
        const { data, error } = await supabase
          .from("clients")
          .insert({
            user_id: userId,
            name: clientData.contactName,
            email: clientData.email,
            company: clientData.companyName,
            industry: clientData.industry,
            notes: clientData.notes,
            status: "active",
          })
          .select()
          .single()

        if (error) throw error

        const newClient = mapDbRowToClient(data)

        setClients((prev) => [newClient, ...prev])
        return newClient
      } catch (error) {
        console.error("Error adding client:", error)
        return null
      }
    },
    [userId],
  )

  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    try {
      const dbUpdates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      }

      if (updates.contactName !== undefined) dbUpdates.name = updates.contactName
      if (updates.email !== undefined) dbUpdates.email = updates.email
      if (updates.companyName !== undefined) dbUpdates.company = updates.companyName
      if (updates.industry !== undefined) dbUpdates.industry = updates.industry
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes

      const { error } = await supabase.from("clients").update(dbUpdates).eq("id", id)

      if (error) throw error

      setClients((prev) => prev.map((client) => (client.id === id ? { ...client, ...updates } : client)))
    } catch (error) {
      console.error("Error updating client:", error)
    }
  }, [])

  const deleteClient = useCallback(async (id: string) => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id)

      if (error) throw error

      setClients((prev) => prev.filter((client) => client.id !== id))
    } catch (error) {
      console.error("Error deleting client:", error)
    }
  }, [])

  const getClientById = useCallback((id: string): Client | undefined => {
    return clientMap.current.get(id)
  }, [])

  const incrementProposalCount = useCallback(async (clientId: string, value: number, won?: boolean) => {
    setClients((prev) =>
      prev.map((client) => {
        if (client.id === clientId) {
          const newCount = client.proposalCount + 1
          const newValue = client.totalValue + value
          let newWinRate = client.winRate
          if (won !== undefined) {
            const currentWins = Math.round((client.winRate / 100) * client.proposalCount)
            const newWins = won ? currentWins + 1 : currentWins
            newWinRate = newCount > 0 ? Math.round((newWins / newCount) * 100) : 0
          }
          return {
            ...client,
            proposalCount: newCount,
            totalValue: newValue,
            winRate: newWinRate,
            lastProposal: new Date().toISOString().split("T")[0],
          }
        }
        return client
      }),
    )
  }, [])

  const refreshClients = useCallback(async () => {
    await fetchClients()
  }, [fetchClients])

  const contextValue = useMemo<ClientContextType>(
    () => ({
      clients,
      addClient,
      updateClient,
      deleteClient,
      getClientById,
      incrementProposalCount,
      isLoading,
      refreshClients,
    }),
    [clients, addClient, updateClient, deleteClient, getClientById, incrementProposalCount, isLoading, refreshClients],
  )

  return <ClientContext.Provider value={contextValue}>{children}</ClientContext.Provider>
}

export function useClients() {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error("useClients must be used within a ClientProvider")
  }
  return context
}
