import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

// The ONE canonical live price for the Pro subscription (7-day free trial).
// There are no other/test/sandbox price IDs in this codebase.
const PRICE_ID = "price_1TpQZILjAVqODdegWXcYwEan"
const TRIAL_PERIOD_DAYS = 7

// Absolute URLs for the production domain, per requirements.
const SUCCESS_URL = "https://productivitytimesheet.app/success"
const CANCEL_URL = "https://productivitytimesheet.app"

// --- Startup diagnostics (safe to log) --------------------------------------
// Logs which Stripe account the backend is actually authenticating as, so we can
// verify the checkout key belongs to the same account that owns PRICE_ID.
// The client uses STRIPE_SECRET_KEY (see lib/stripe.ts).
// Runs once when this module is first loaded.
const secretKey = process.env.STRIPE_SECRET_KEY ?? ""
const keyMode = secretKey.startsWith("sk_live_")
  ? "LIVE"
  : secretKey.startsWith("sk_test_")
    ? "TEST"
    : secretKey.startsWith("rk_")
      ? "RESTRICTED"
      : "UNKNOWN"

;(async () => {
  console.log("[v0] Stripe key mode:", keyMode)
  try {
    const account = await stripe.accounts.retrieve()
    console.log("[v0] Stripe account id (startup):", account.id)
    console.log("[v0] Stripe account name (startup):", account.settings?.dashboard?.display_name ?? "(none)")
  } catch (err) {
    console.error("[v0] Stripe account retrieve failed (startup):", err instanceof Error ? err.message : err)
  }
})()

// Secure, server-side Checkout Session creation.
// The Stripe secret key never leaves the server.
export async function POST() {
  // --- Per-request diagnostics (visible in Vercel Production logs) ----------
  // These run on every checkout attempt and are awaited so they are flushed
  // before the (possibly failing) create call. Safe to log: no secret values.
  console.log("[v0] checkout: STRIPE_SECRET_KEY set:", secretKey.length > 0)
  console.log("[v0] checkout: key mode:", keyMode)
  try {
    const account = await stripe.accounts.retrieve()
    console.log("[v0] checkout: authenticated Stripe account id:", account.id)
    console.log(
      "[v0] checkout: account matches expected (acct_1TpQ7xLjAVqODdeg):",
      account.id === "acct_1TpQ7xLjAVqODdeg",
    )
  } catch (err) {
    console.error(
      "[v0] checkout: stripe.accounts.retrieve() failed:",
      err instanceof Error ? err.message : err,
    )
  }
  console.log("[v0] checkout: using PRICE_ID:", PRICE_ID)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: TRIAL_PERIOD_DAYS,
      },
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    })

    if (!session.url) {
      return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Stripe error"
    console.error("[v0] Stripe checkout error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
