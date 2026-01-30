import { createClient } from "@supabase/supabase-js"

export function createTemplatesAdminClient() {
  const url = process.env.LN_NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.LN_SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.LN_NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error("LN_NEXT_PUBLIC_SUPABASE_URL not configured for templates database")
  }

  const key = serviceRoleKey || anonKey
  if (!key) {
    throw new Error("Templates Supabase key not configured (LN_SUPABASE_SERVICE_ROLE_KEY or LN_NEXT_PUBLIC_SUPABASE_ANON_KEY)")
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

