"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileSearch,
  PenLine,
  Sparkles,
  Users,
  History,
  CreditCard,
  Settings,
  LogOut,
  FileText,
} from "lucide-react"
import { useCredit } from "@/lib/credit-store"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface UserData {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
}

const primaryNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/studio", icon: Sparkles, label: "AI Proposal Studio" },
  { href: "/dashboard/generate", icon: PenLine, label: "Generate Proposal" },
  { href: "/dashboard/upload", icon: FileSearch, label: "Audit Proposal" },
  { href: "/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/dashboard/history", icon: History, label: "History" },
]

const utilityNavItems = [
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardSidebar({ user }: { user: UserData }) {
  const pathname = usePathname()
  const router = useRouter()
  const { balance, isLowBalance, isCreditExhausted } = useCredit()

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
          <FileText className="h-4 w-4 text-white" strokeWidth={1.5} />
        </div>
        <span className="text-lg font-semibold text-gray-900">LightNote AI</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4">
        <div className="space-y-1">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex-1" />

        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Credit Balance</span>
            {isLowBalance && (
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                Low
              </span>
            )}
            {isCreditExhausted && (
              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">Empty</span>
            )}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            ${typeof balance === "number" ? balance.toFixed(2) : "0.00"}
          </p>
          <p className="text-xs text-gray-500">remaining</p>
          <Link
            href="/dashboard/billing"
            className="mt-2 block w-full rounded-md bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Manage billing →
          </Link>
        </div>

        <div className="border-t border-gray-200 pt-3 space-y-1">
          {utilityNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* User section */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  )
}
