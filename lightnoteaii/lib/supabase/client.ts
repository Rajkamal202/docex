import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    return null
  }

  if (client) return client

  client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return client
}

export async function getSafeUser() {
  if (typeof window === "undefined") {
    return null
  }

  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      // Check if it's a refresh token error or network error
      if (
        error.message?.includes("Refresh Token") ||
        error.message?.includes("refresh_token") ||
        error.message?.includes("Failed to fetch")
      ) {
        try {
          await supabase.auth.signOut()
        } catch {
          // Ignore signout errors
        }
        return null
      }
      throw error
    }
    return user
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
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
      return null
    }
    // For other errors, return null instead of throwing
    console.error("Auth error:", errorMessage)
    return null
  }
}
