import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

const RETURN_URL = "https://www.productivitytimesheet.app/account"

export async function POST() {
  try {
    // 1. Resolve the logged-in user from the cookie-based session.
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return Response.json(
        { error: "Not authenticated. Please sign in before managing your subscription." },
        { status: 401 },
      )
    }

    // 2. Look up the stripe_customer_id from the subscriptions table.
    const admin = getSupabaseAdmin()
    const { data: subscription, error: subError } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (subError || !subscription?.stripe_customer_id) {
      console.error(
        "[v0] customer-portal: no subscription found for user",
        user.id,
        subError?.message ?? "missing stripe_customer_id",
      )
      return Response.json(
        { error: "No active subscription found for your account." },
        { status: 404 },
      )
    }

    // 3. Create the Stripe Billing Portal session.
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: RETURN_URL,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] customer-portal: unexpected error:", message)
    return Response.json(
      { error: "Something went wrong. Please try again or contact support." },
      { status: 500 },
    )
  }
}
