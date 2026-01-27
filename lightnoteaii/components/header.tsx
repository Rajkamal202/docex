"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, FileText } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav className="flex h-12 items-center gap-1 rounded-full bg-white px-2 shadow-sm border border-gray-100">
        <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f0f0f]">
          <FileText className="h-4 w-4 text-white" strokeWidth={1.5} />
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center md:flex">
          <Link
            href="#features"
            className="flex items-center gap-1 px-3 py-2 text-sm text-[#0f0f0f] transition-colors hover:text-[#6b7280]"
          >
            Product
            <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
          <Link href="/pricing" className="px-3 py-2 text-sm text-[#0f0f0f] transition-colors hover:text-[#6b7280]">
            Pricing
          </Link>
          <Link href="/docs" className="px-3 py-2 text-sm text-[#0f0f0f] transition-colors hover:text-[#6b7280]">
            Documentation
          </Link>
        </div>

        {/* Spacer */}
        <div className="hidden md:block w-8" />

        {/* Auth Buttons */}
        <div className="hidden items-center gap-1 md:flex">
          <Link href="/login" className="px-3 py-2 text-sm text-[#0f0f0f] transition-colors hover:text-[#6b7280]">
            Login
          </Link>
          <Button
            className="h-8 rounded-full bg-[#0f0f0f] px-4 text-sm font-medium text-white hover:bg-[#0f0f0f]/90"
            asChild
          >
            <Link href="/signup">Register</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          )}
        </Button>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-4 right-4 rounded-2xl bg-white p-4 shadow-lg border border-gray-100 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="#features"
              className="flex items-center justify-between px-3 py-2 text-sm text-[#0f0f0f] rounded-lg hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
              <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-2 text-sm text-[#0f0f0f] rounded-lg hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="px-3 py-2 text-sm text-[#0f0f0f] rounded-lg hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <Link
                href="/login"
                className="block px-3 py-2 text-sm text-[#0f0f0f] rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block px-3 py-2 text-sm text-white bg-[#0f0f0f] rounded-lg mt-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
