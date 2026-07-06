import { createBrowserClient } from "@supabase/ssr"

/**
 * Browser-side Supabase client (uses the public anon key).
 *
 * Safe to use in Client Components. Reads the session from the cookies that the
 * server-side auth callback sets, so the user stays signed in during the
 * account-activation flow.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
