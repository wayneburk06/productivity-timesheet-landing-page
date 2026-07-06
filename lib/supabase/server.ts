import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Server-side Supabase client (uses the public anon key) wired to Next.js
 * cookies. Used by the auth callback route to verify the invite token and
 * persist the resulting session as cookies.
 *
 * This is the official @supabase/ssr pattern for the Next.js App Router.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Called from a Server Component where setting cookies is not
            // allowed. Safe to ignore when a middleware/route refreshes them.
          }
        },
      },
    },
  )
}
