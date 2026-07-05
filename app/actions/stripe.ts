"use server"

import { headers } from "next/headers"

import { stripe } from "@/lib/stripe"
import { PRODUCTS, DEFAULT_PLAN_ID } from "@/lib/products"

// Creates a subscription Checkout Session with a free trial and returns the
// hosted Checkout URL. The client redirects the user there; on completion
// Stripe sends them to /success, which surfaces the Windows download.
export async function startTrialCheckout(planId: string = DEFAULT_PLAN_ID) {
  const plan = PRODUCTS.find((p) => p.id === planId)
  if (!plan) {
    throw new Error(`Plan with id "${planId}" not found`)
  }

  const headerList = await headers()
  const origin =
    headerList.get("origin") ??
    (headerList.get("host") ? `https://${headerList.get("host")}` : "")

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    // Do NOT pass payment_method_types — let Stripe pick dynamically.
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: plan.priceInCents,
          recurring: { interval: plan.interval },
        },
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: plan.trialDays,
    },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=cancelled#trial`,
  })

  if (!session.url) {
    throw new Error("Unable to create checkout session")
  }

  return session.url
}
