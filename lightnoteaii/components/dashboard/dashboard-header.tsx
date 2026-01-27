"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface UserData {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364-.707.707M6.343 17.657l-.707.707m12.728 0-.707-.707M6.343 6.343l-.707-.707" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22,4 12,14.01 9,11.01" />
    </svg>
  )
}

export function DashboardHeader({ user }: { user: UserData }) {
  const pathname = usePathname()
  const router = useRouter()
  const isDashboardOverview = pathname === "/dashboard"

  const [hasUnread, setHasUnread] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: "welcome",
      type: "welcome" as const,
      title: "Welcome to LightNote AI",
      message:
        "You're all set to create proposals that win. Upload your first proposal to receive AI-powered analysis and recommendations tailored to your goals.",
      timestamp: new Date(),
      read: false,
    },
  ])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && hasUnread) {
      // Mark notifications as read after viewing
      setTimeout(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setHasUnread(false)
      }, 2000)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    const stillUnread = notifications.some((n) => n.id !== id && !n.read)
    setHasUnread(stillUnread)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

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
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Page context */}
      <div className="flex items-center gap-2">
        {!isDashboardOverview && (
          <span className="text-sm font-medium text-gray-600">
            {pathname
              ?.split("/")
              .pop()
              ?.replace(/-/g, " ")
              ?.replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
              <BellIcon className="h-[18px] w-[18px]" />
              {hasUnread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-black ring-2 ring-white" />}
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-[360px] p-0 rounded-xl border border-gray-200 bg-white shadow-xl"
            sideOffset={8}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {notifications.some((n) => !n.read) && (
                <button
                  onClick={() => {
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                    setHasUnread(false)
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <div className="mx-auto h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <BellIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-gray-50/50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${
                            notification.type === "welcome"
                              ? "bg-gradient-to-br from-gray-900 to-gray-700"
                              : "bg-gray-100"
                          }`}
                        >
                          {notification.type === "welcome" ? (
                            <SparkIcon className="h-4 w-4 text-white" />
                          ) : (
                            <BellIcon className="h-4 w-4 text-gray-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read ? "text-gray-900" : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="flex-shrink-0 h-2 w-2 rounded-full bg-black mt-1.5" />
                            )}
                          </div>
                          <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{formatTime(notification.timestamp)}</p>
                        </div>
                      </div>

                      {/* Welcome notification CTA */}
                      {notification.type === "welcome" && !notification.read && (
                        <div className="mt-3 ml-12">
                          <Link
                            href="/dashboard/audit"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
                          >
                            <span>Upload your first proposal</span>
                            <svg
                              className="h-3 w-3"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14m-7-7 7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
              <Link href="/dashboard/settings" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                Notification settings
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-6 w-px bg-gray-200" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl || "/placeholder.svg"}
                  alt={user.fullName}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-xs font-medium text-gray-600">{initials}</span>
                </div>
              )}
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border border-gray-100 bg-white shadow-lg p-1">
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <DropdownMenuItem asChild className="rounded-lg text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900">
              <Link href="/dashboard/settings">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900">
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900">
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="rounded-lg text-sm text-gray-600 focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
