import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the SERVICE ROLE key.
 *
 * This client bypasses Row Level Security and can use the Auth Admin API
 * (create users, list users). It must NEVER be imported into client code.
 *
 * All secrets are read exclusively from environment variables.
 */

// Server-side only. No NEXT_PUBLIC_ variables are used for secrets.
const supabaseUrl = process.env.SUPABASE_URL ?? ""

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

let cachedClient: SupabaseClient | null = null

/**
 * Returns a singleton service-role Supabase client.
 * Throws a descriptive error (instead of failing silently) when the required
 * environment variables are missing, so misconfiguration is obvious in logs.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error("Missing SUPABASE_URL environment variable")
  }
  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return cachedClient
}
