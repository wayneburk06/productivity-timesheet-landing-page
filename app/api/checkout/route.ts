import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

// Production Stripe price for the Pro subscription (7-day free trial).
const PRICE_ID = "price_1TpQZILjAVqODdegWXcYwEan"
const TRIAL_PERIOD_DAYS = 7

// Absolute URLs for the production domain, per requirements.
const SUCCESS_URL = "https://productivitytimesheet.app/success"
const CANCEL_URL = "https://productivitytimesheet.app/pricing"

// Secure, server-side Checkout Session creation.
// The Stripe secret key never leaves the server.
export async function POST() {
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
    console.error("[v0] Stripe checkout error:", err)
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 })
  }
}
