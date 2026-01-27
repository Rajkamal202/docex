import type React from "react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-16 items-center px-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" className="text-gray-900" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" className="text-gray-900" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" className="text-gray-900" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" className="text-gray-300" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-gray-900">LightNote AI</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
    </div>
  )
}
