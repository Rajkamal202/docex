"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const fullName = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    const supabase = getSupabaseBrowserClient()

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    router.push("/auth/sign-up-success")
  }

  return (
    <div className="w-full max-w-[360px]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">Start writing winning proposals with AI</p>
      </div>

      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-green-800">$20 Welcome Credit</p>
            <p className="text-xs text-green-700 mt-0.5">Sign up today and get $20 to try all premium features</p>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:opacity-50 transition-colors"
          />
          <p className="text-xs text-gray-400">Must be at least 8 characters</p>
        </div>

        <div className="flex items-start gap-2.5 py-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label htmlFor="terms" className="text-sm text-gray-500 leading-tight">
            I agree to the{" "}
            <Link href="/terms" className="text-gray-900 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-900 hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !agreed}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gray-900 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
