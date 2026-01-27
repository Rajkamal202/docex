import type React from "react"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { CreditProvider } from "@/lib/credit-store"
import { ProposalProvider } from "@/lib/proposal-store"
import { ClientProvider } from "@/lib/client-store"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  let profile = null

  try {
    const supabase = await getSupabaseServerClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      // Handle auth errors gracefully - redirect to login
      console.error("Auth error:", userError.message)
      redirect("/login")
    }
    
    user = userData?.user

    if (!user) {
      redirect("/login")
    }

    // Fetch user profile with error handling
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    
    profile = profileData
  } catch (error) {
    // Handle network errors or other unexpected errors
    console.error("Dashboard layout error:", error)
    redirect("/login")
  }

  if (!user) {
    redirect("/login")
  }

  const userDataForComponents = {
    id: user.id,
    email: user.email || "",
    fullName: profile?.full_name || user.email?.split("@")[0] || "User",
    avatarUrl: profile?.avatar_url || null,
  }

  return (
    <CreditProvider>
      <ProposalProvider>
        <ClientProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="flex min-h-screen">
              <DashboardSidebar user={userDataForComponents} />
              <div className="flex flex-1 flex-col">
                <DashboardHeader user={userDataForComponents} />
                <main className="flex-1 overflow-auto p-6">{children}</main>
              </div>
            </div>
          </div>
        </ClientProvider>
      </ProposalProvider>
    </CreditProvider>
  )
}
