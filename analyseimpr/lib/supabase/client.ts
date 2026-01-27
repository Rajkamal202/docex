import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(process.env.LN_NEXT_PUBLIC_SUPABASE_URL!, process.env.LN_NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
