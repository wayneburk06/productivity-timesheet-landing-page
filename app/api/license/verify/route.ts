import { createClient } from "@supabase/supabase-js"

import { getSupabaseAdmin } from "@/lib/supabase-admin"

/**
 * POST /api/license/verify
 *
 * License check for the WPF desktop app. Verifies email + password against
 * Supabase Auth, then confirms the customer has an active/trialing subscription
 * in public.subscriptions.
 *
 * Security:
 *  - Runs server-side only. The service-role key never leaves the server.
 *  - Passwords are never logged.
 *  - Password verification uses a throwaway anon-key client (no session
 *    persistence); the subscription lookup uses the service-role client.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Statuses that grant access to the desktop app.
const ACCESS_STATUSES = new Set(["active", "trialing"])

type VerifyBody = {
  email?: unknown
  password?: unknown
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

/**
 * Verifies a password using a short-lived anon client so we never mutate the
 * shared admin singleton or persist a session on the server.
 */
async function verifyPassword(email: string, password: string): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variable")
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data, error } = await authClient.auth.signInWithPassword({ email, password })

  // Best-effort sign-out so no session lingers on this throwaway client.
  if (data?.session) {
    await authClient.auth.signOut().catch(() => {})
  }

  if (error || !data?.user) {
    return false
  }
  return true
}

export async function POST(request: Request): Promise<Response> {
  let body: VerifyBody
  try {
    body = (await request.json()) as VerifyBody
  } catch {
    return jsonResponse({ valid: false, reason: "invalid_request" }, 400)
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body.password === "string" ? body.password : ""

  if (!email || !password) {
    return jsonResponse({ valid: false, reason: "missing_credentials" }, 400)
  }

  // 1) Verify credentials against Supabase Auth.
  let authenticated = false
  try {
    authenticated = await verifyPassword(email, password)
  } catch (err) {
    console.error("[v0] license: auth verification error -", err instanceof Error ? err.message : "unknown")
    return jsonResponse({ valid: false, reason: "server_error" }, 500)
  }

  if (!authenticated) {
    console.log("[v0] license: invalid credentials for", email)
    return jsonResponse({ valid: false, reason: "invalid_credentials" }, 401)
  }

  // 2) Look up the subscription for this email (service role bypasses RLS).
  let subscription: {
    subscription_status: string | null
    trial_end: string | null
    current_period_end: string | null
  } | null = null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from("subscriptions")
      .select("subscription_status, trial_end, current_period_end")
      .eq("email", email)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("[v0] license: subscription lookup failed for", email, "-", error.message)
      return jsonResponse({ valid: false, reason: "server_error" }, 500)
    }
    subscription = data
  } catch (err) {
    console.error("[v0] license: subscription lookup error -", err instanceof Error ? err.message : "unknown")
    return jsonResponse({ valid: false, reason: "server_error" }, 500)
  }

  // 3) No subscription row at all -> deny.
  if (!subscription) {
    console.log("[v0] license: no subscription found for", email)
    return jsonResponse({ valid: false, reason: "no_subscription" }, 403)
  }

  const status = subscription.subscription_status ?? ""

  // 4) Only active / trialing grant access.
  if (!ACCESS_STATUSES.has(status)) {
    console.log("[v0] license: access denied for", email, "- status:", status || "(none)")
    return jsonResponse({ valid: false, reason: `subscription_${status || "unknown"}` }, 403)
  }

  console.log("[v0] license: access granted for", email, "- status:", status)
  return jsonResponse(
    {
      valid: true,
      email,
      status,
      trial_end: subscription.trial_end,
      current_period_end: subscription.current_period_end,
    },
    200,
  )
}
