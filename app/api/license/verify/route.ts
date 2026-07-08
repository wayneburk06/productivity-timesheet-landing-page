import { createClient } from "@supabase/supabase-js"

import { getSupabaseAdmin } from "@/lib/supabase-admin"

/**
 * POST /api/license/verify
 *
 * License check for the WPF desktop app. Verifies email + password against
 * Supabase Auth, then confirms the customer has an active/trialing subscription
 * or is flagged as admin in public.subscriptions.
 *
 * Security:
 *  - Runs server-side only. The service-role key never leaves the server.
 *  - Passwords are never logged.
 *  - No session tokens are returned to the caller.
 *  - Password verification uses a throwaway anon-key client (no session
 *    persistence); the subscription lookup uses the service-role client.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Statuses that grant access (unless is_admin overrides).
const ACCESS_STATUSES = new Set(["active", "trialing"])

type VerifyBody = {
  email?: unknown
  password?: unknown
}

type SubscriptionRow = {
  user_id: string | null
  subscription_status: string | null
  trial_end: string | null
  current_period_end: string | null
  is_admin: boolean | null
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
 * Returns the verified user id on success, or null on failure.
 */
async function verifyPassword(email: string, password: string): Promise<string | null> {
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
    return null
  }
  return data.user.id
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
  let userId: string | null = null
  try {
    userId = await verifyPassword(email, password)
  } catch (err) {
    console.error("[v0] license: auth verification error -", err instanceof Error ? err.message : "unknown")
    return jsonResponse({ valid: false, reason: "server_error" }, 500)
  }

  if (!userId) {
    console.log("[v0] license: invalid credentials for", email)
    return jsonResponse({ valid: false, reason: "invalid_credentials" }, 401)
  }

  // 2) Look up the subscription by user_id (service role bypasses RLS).
  //    Falls back to email lookup so rows written before user_id was populated
  //    are still found.
  let subscription: SubscriptionRow | null = null

  try {
    const supabase = getSupabaseAdmin()

    // Primary: lookup by user_id (most reliable, handles email changes).
    const { data: byUserId, error: errById } = await supabase
      .from("subscriptions")
      .select("user_id, subscription_status, trial_end, current_period_end, is_admin")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (errById) {
      console.error("[v0] license: subscription lookup by user_id failed -", errById.message)
      return jsonResponse({ valid: false, reason: "server_error" }, 500)
    }

    if (byUserId) {
      subscription = byUserId as SubscriptionRow
    } else {
      // Fallback: lookup by email for rows without a user_id.
      const { data: byEmail, error: errByEmail } = await supabase
        .from("subscriptions")
        .select("user_id, subscription_status, trial_end, current_period_end, is_admin")
        .eq("email", email)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (errByEmail) {
        console.error("[v0] license: subscription lookup by email failed -", errByEmail.message)
        return jsonResponse({ valid: false, reason: "server_error" }, 500)
      }
      subscription = (byEmail as SubscriptionRow) ?? null
    }
  } catch (err) {
    console.error("[v0] license: subscription lookup error -", err instanceof Error ? err.message : "unknown")
    return jsonResponse({ valid: false, reason: "server_error" }, 500)
  }

  // 3) No subscription row at all -> deny (unless admin).
  if (!subscription) {
    console.log("[v0] license: no subscription found for", email)
    return jsonResponse({ valid: false, reason: "no_active_subscription", is_admin: false }, 403)
  }

  const subscriptionStatus = subscription.subscription_status ?? ""
  const isAdmin = subscription.is_admin === true

  // 4) Admin flag grants unconditional access, regardless of subscription status.
  if (isAdmin) {
    console.log("[v0] license: access granted (admin) for", email)
    return jsonResponse(
      {
        valid: true,
        user_id: userId,
        email,
        subscription_status: subscriptionStatus || null,
        trial_end: subscription.trial_end,
        current_period_end: subscription.current_period_end,
        is_admin: true,
      },
      200,
    )
  }

  // 5) Regular users need active or trialing status.
  if (!ACCESS_STATUSES.has(subscriptionStatus)) {
    console.log("[v0] license: access denied for", email, "- status:", subscriptionStatus || "(none)")
    return jsonResponse(
      {
        valid: false,
        reason: "no_active_subscription",
        subscription_status: subscriptionStatus || null,
        trial_end: subscription.trial_end,
        current_period_end: subscription.current_period_end,
        is_admin: false,
      },
      403,
    )
  }

  console.log("[v0] license: access granted for", email, "- status:", subscriptionStatus)
  return jsonResponse(
    {
      valid: true,
      user_id: userId,
      email,
      subscription_status: subscriptionStatus,
      trial_end: subscription.trial_end,
      current_period_end: subscription.current_period_end,
      is_admin: false,
    },
    200,
  )
}
