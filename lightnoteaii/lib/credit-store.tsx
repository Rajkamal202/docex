"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// Feature costs in dollars - Made immutable with Object.freeze
export const FEATURE_COSTS = Object.freeze({
  proposal_audit: 2.0,
  ai_rewrite: 3.0,
  generate_proposal: 2.5,
  export_pdf: 0.5,
  detailed_analysis: 1.5,
} as const)

export type FeatureType = keyof typeof FEATURE_COSTS

export interface CreditTransaction {
  id: string
  type: "credit" | "debit"
  amount: number
  feature?: string
  description: string
  timestamp: Date
  balance: number
}

interface CreditState {
  balance: number
  initialCredit: number
  transactions: CreditTransaction[]
  isNewUser: boolean
  hasAddedPayment: boolean
  isLoading: boolean
  userId: string | null
  tableMissing: boolean
  error: string | null
}

interface CreditContextType extends CreditState {
  deductCredit: (feature: FeatureType, description?: string) => Promise<boolean>
  canAfford: (feature: FeatureType) => boolean
  getFeatureCost: (feature: FeatureType) => number
  addPaymentMethod: () => void
  refreshCredits: () => Promise<void>
  addCredits: (amount: number, description: string) => Promise<boolean>
  isLowBalance: boolean
  isCreditExhausted: boolean
  userId: string | null
}

const CreditContext = createContext<CreditContextType | null>(null)

const INITIAL_CREDIT = 20.0
const LOW_BALANCE_THRESHOLD = 5.0

const INITIAL_STATE: CreditState = {
  balance: INITIAL_CREDIT,
  initialCredit: INITIAL_CREDIT,
  transactions: [],
  isNewUser: true,
  hasAddedPayment: false,
  isLoading: true,
  userId: null,
  tableMissing: false,
  error: null,
}

export function CreditProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CreditState>(INITIAL_STATE)

  const mounted = useRef(false)
  const initialized = useRef(false)
  const fetchInProgress = useRef(false)

  const fetchCredits = useCallback(async () => {
    if (!mounted.current || fetchInProgress.current) return
    fetchInProgress.current = true

    if (typeof window === "undefined") {
      setState((prev) => ({ ...prev, isLoading: false }))
      fetchInProgress.current = false
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setState((prev) => ({ ...prev, isLoading: false }))
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
        if (
          errorMessage.includes("Refresh Token") ||
          errorMessage.includes("refresh_token") ||
          errorMessage.includes("Failed to fetch")
        ) {
          try {
            await supabase.auth.signOut()
          } catch {
            // Ignore signout errors
          }
          if (mounted.current) {
            setState((prev) => ({ ...prev, isLoading: false }))
          }
          fetchInProgress.current = false
          return
        }
      }

      if (!user) {
        if (mounted.current) {
          setState((prev) => ({ ...prev, isLoading: false }))
        }
        fetchInProgress.current = false
        return
      }

      const [creditResult, transactionsResult] = await Promise.all([
        supabase.from("credits").select("balance").eq("user_id", user.id).single(),
        supabase
          .from("credit_transactions")
          .select("id, amount, feature, description, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ])

      if (creditResult.error) throw creditResult.error
      if (transactionsResult.error) throw transactionsResult.error

      const transactions: CreditTransaction[] = (transactionsResult.data || []).map((t) => ({
        id: t.id,
        type: t.amount > 0 ? "credit" : "debit",
        amount: Math.abs(t.amount),
        feature: t.feature,
        description: t.description || "",
        timestamp: new Date(t.created_at),
        balance: 0,
      }))

      if (mounted.current) {
        setState({
          balance: creditResult.data?.balance || INITIAL_CREDIT,
          initialCredit: INITIAL_CREDIT,
          transactions,
          isNewUser: transactions.length <= 1,
          hasAddedPayment: false,
          isLoading: false,
          userId: user.id,
          tableMissing: false,
          error: null,
        })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (
        errorMessage.includes("Refresh Token") ||
        errorMessage.includes("refresh_token") ||
        errorMessage.includes("Failed to fetch")
      ) {
        const supabase = getSupabaseBrowserClient()
        if (supabase) {
          try {
            await supabase.auth.signOut()
          } catch {
            // Ignore signout errors
          }
        }
      } else {
        console.error("Error fetching credits:", error)
      }
      if (mounted.current) {
        const tableMissing =
          errorMessage.includes("PGRST205") ||
          errorMessage.includes("Could not find the table") ||
          errorMessage.includes("credits") ||
          errorMessage.includes("credit_transactions")
        setState((prev) => ({
          ...prev,
          isLoading: false,
          tableMissing,
          error: errorMessage,
        }))
      }
    } finally {
      fetchInProgress.current = false
    }
  }, [])

  useEffect(() => {
    mounted.current = true

    if (!initialized.current) {
      initialized.current = true

      const timer = setTimeout(() => {
        if (mounted.current) {
          fetchCredits()
        }
      }, 100)

      return () => {
        mounted.current = false
        clearTimeout(timer)
      }
    }

    if (typeof window === "undefined") return

    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (mounted.current) {
          fetchCredits()
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted.current) {
          setState(INITIAL_STATE)
        }
      }
    })

    return () => {
      mounted.current = false
      subscription.unsubscribe()
    }
  }, [fetchCredits])

  const canAfford = useCallback(
    (feature: FeatureType): boolean => {
      return state.balance >= FEATURE_COSTS[feature]
    },
    [state.balance],
  )

  const getFeatureCost = useCallback((feature: FeatureType): number => {
    return FEATURE_COSTS[feature]
  }, [])

  const deductCredit = useCallback(
    async (feature: FeatureType, description?: string): Promise<boolean> => {
      const cost = FEATURE_COSTS[feature]

      if (state.balance < cost || !state.userId) {
        return false
      }

      const supabase = getSupabaseBrowserClient()
      if (!supabase) return false

      try {
        const newBalance = Math.round((state.balance - cost) * 100) / 100

        const [updateResult, txResult] = await Promise.all([
          supabase
            .from("credits")
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq("user_id", state.userId),
          supabase.from("credit_transactions").insert({
            user_id: state.userId,
            amount: -cost,
            feature,
            description: description || `Used ${feature.replace(/_/g, " ")}`,
          }),
        ])

        if (updateResult.error) throw updateResult.error
        if (txResult.error) throw txResult.error

        setState((prev) => ({
          ...prev,
          balance: newBalance,
          isNewUser: false,
        }))

        return true
      } catch (error) {
        console.error("Error deducting credit:", error)
        return false
      }
    },
    [state.balance, state.userId],
  )

  const addPaymentMethod = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hasAddedPayment: true,
    }))
  }, [])

  const refreshCredits = useCallback(async () => {
    await fetchCredits()
  }, [fetchCredits])

  const addCredits = useCallback(
    async (amount: number, description: string): Promise<boolean> => {
      if (!state.userId) return false

      const supabase = getSupabaseBrowserClient()
      if (!supabase) return false

      try {
        const newBalance = Math.round((state.balance + amount) * 100) / 100

        const [updateResult, txResult] = await Promise.all([
          supabase
            .from("credits")
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq("user_id", state.userId),
          supabase.from("credit_transactions").insert({
            user_id: state.userId,
            amount: amount,
            feature: "credit_purchase",
            description,
          }),
        ])

        if (updateResult.error) throw updateResult.error
        if (txResult.error) throw txResult.error

        setState((prev) => ({
          ...prev,
          balance: newBalance,
        }))

        return true
      } catch (error) {
        console.error("Error adding credits:", error)
        return false
      }
    },
    [state.balance, state.userId],
  )

  const isLowBalance = useMemo(() => state.balance > 0 && state.balance <= LOW_BALANCE_THRESHOLD, [state.balance])
  const isCreditExhausted = useMemo(() => state.balance <= 0, [state.balance])

  const contextValue = useMemo<CreditContextType>(
    () => ({
      ...state,
      deductCredit,
      canAfford,
      getFeatureCost,
      addPaymentMethod,
      refreshCredits,
      addCredits,
      isLowBalance,
      isCreditExhausted,
    }),
    [
      state,
      deductCredit,
      canAfford,
      getFeatureCost,
      addPaymentMethod,
      refreshCredits,
      addCredits,
      isLowBalance,
      isCreditExhausted,
    ],
  )

  return <CreditContext.Provider value={contextValue}>{children}</CreditContext.Provider>
}

export function useCredit() {
  const context = useContext(CreditContext)
  if (!context) {
    throw new Error("useCredit must be used within a CreditProvider")
  }
  return context
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (!context) {
    throw new Error("useCredits must be used within a CreditProvider")
  }
  return context
}
