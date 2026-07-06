import "server-only"

import type Stripe from "stripe"

import { getSupabaseAdmin } from "@/lib/supabase-admin"

/**
 * Allowed subscription statuses that the WPF app understands.
 * Everything else is normalized into one of these values.
 */
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "unpaid"

const KNOWN_STATUSES: SubscriptionStatus[] = ["trialing", "active", "past_due", "canceled", "unpaid"]

/**
 * Normalize a raw Stripe subscription status into the set the WPF app expects.
 * Unknown/edge statuses are mapped to the closest safe equivalent.
 */
export function mapSubscriptionStatus(raw: string | null | undefined): SubscriptionStatus {
  if (raw && (KNOWN_STATUSES as string[]).includes(raw)) {
    return raw as SubscriptionStatus
  }

  switch (raw) {
    case "incomplete":
    case "incomplete_expired":
      // Payment never completed -> treat as unpaid so the app locks features.
      return "unpaid"
    case "paused":
      // Paused subscriptions should not grant access.
      return "past_due"
    default:
      // Fallback: safest is to deny access.
      return "canceled"
  }
}

/** Convert a Stripe unix timestamp (seconds) to an ISO string, or null. */
function unixToIso(seconds: number | null | undefined): string | null {
  if (!seconds || typeof seconds !== "number") return null
  return new Date(seconds * 1000).toISOString()
}

/**
 * Reads current_period_end from a subscription, handling both the legacy
 * top-level field and the newer per-item location across Stripe API versions.
 */
function getCurrentPeriodEnd(subscription: Stripe.Subscription): string | null {
  // Loosely typed access so this works regardless of the pinned API version.
  const sub = subscription as unknown as {
    current_period_end?: number
    items?: { data?: Array<{ current_period_end?: number }> }
  }

  if (typeof sub.current_period_end === "number") {
    return unixToIso(sub.current_period_end)
  }

  const itemPeriodEnd = sub.items?.data?.[0]?.current_period_end
  return unixToIso(itemPeriodEnd)
}

/**
 * Finds an existing Supabase auth user by email, or creates one if missing.
 * Returns the user id, or null if the user could not be resolved/created.
 */
export async function findOrCreateAuthUser(email: string): Promise<string | null> {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) {
    console.error("[v0] webhook: cannot resolve auth user, empty email")
    return null
  }

  const supabase = getSupabaseAdmin()

  // 1) Try to find an existing user by paging through the auth users list.
  const existing = await findAuthUserByEmail(normalizedEmail)
  if (existing) {
    console.log("[v0] webhook: found existing auth user for", normalizedEmail)
    return existing
  }

  // 2) Not found -> invite the user by email. This creates the auth user AND
  //    sends a Supabase "You have been invited" email containing a link to set
  //    their password / activate the account. Only brand new users reach this
  //    branch, so existing customers are never re-invited.
  const redirectTo = process.env.SUPABASE_INVITE_REDIRECT_URL || undefined

  const { data, error } = await supabase.auth.admin.inviteUserByEmail(
    normalizedEmail,
    redirectTo ? { redirectTo } : undefined,
  )

  if (error) {
    // Race condition: another event may have created the user first.
    const alreadyExists = await findAuthUserByEmail(normalizedEmail)
    if (alreadyExists) {
      console.log("[v0] webhook: user already existed (race); no invite sent to", normalizedEmail)
      return alreadyExists
    }

    console.error("[v0] webhook: failed to invite auth user for", normalizedEmail, "-", error.message)
    return null
  }

  console.log("[v0] webhook: invite email sent to new user", normalizedEmail)
  return data.user?.id ?? null
}

/** Pages through Supabase auth users to find one matching the given email. */
async function findAuthUserByEmail(email: string): Promise<string | null> {
  const supabase = getSupabaseAdmin()
  const perPage = 200
  const maxPages = 50 // safety cap (up to 10k users scanned)

  for (let page = 1; page <= maxPages; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage })
    if (error) {
      console.error("[v0] webhook: listUsers failed on page", page, "-", error.message)
      return null
    }

    const match = data.users.find((u) => (u.email ?? "").toLowerCase() === email)
    if (match) return match.id

    if (data.users.length < perPage) break // reached the last page
  }

  return null
}

export interface SubscriptionRecordInput {
  userId: string | null
  email: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  status: SubscriptionStatus
  subscription?: Stripe.Subscription | null
}

/**
 * Inserts or updates a row in public.subscriptions, keyed by
 * stripe_subscription_id. This is what the WPF app reads to determine access.
 */
export async function upsertSubscriptionRecord(input: SubscriptionRecordInput): Promise<void> {
  const supabase = getSupabaseAdmin()

  const row: Record<string, unknown> = {
    user_id: input.userId,
    email: input.email,
    stripe_customer_id: input.stripeCustomerId,
    stripe_subscription_id: input.stripeSubscriptionId,
    subscription_status: input.status,
    trial_end: input.subscription ? unixToIso(input.subscription.trial_end) : null,
    current_period_end: input.subscription ? getCurrentPeriodEnd(input.subscription) : null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("subscriptions")
    .upsert(row, { onConflict: "stripe_subscription_id" })

  if (error) {
    console.error("[v0] webhook: failed to upsert subscription", input.stripeSubscriptionId, "-", error.message)
    throw new Error(`Supabase upsert failed: ${error.message}`)
  }

  console.log(
    "[v0] webhook: upserted subscription",
    input.stripeSubscriptionId,
    "status:",
    input.status,
    "user:",
    input.userId ?? "(unresolved)",
  )
}
