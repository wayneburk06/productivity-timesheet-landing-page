import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { stripe } from "@/lib/stripe"
import {
  findOrCreateAuthUser,
  mapSubscriptionStatus,
  upsertSubscriptionRecord,
} from "@/lib/subscriptions"

// Stripe signature verification needs the raw, unparsed request body, so this
// route must run on the Node.js runtime and never be statically optimized.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// The webhook signing secret is read EXCLUSIVELY from an environment variable.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ""

/**
 * Resolve a customer's email from a Stripe customer id.
 * Returns null for deleted customers or on error.
 */
async function getCustomerEmail(customerId: string | null | undefined): Promise<string | null> {
  if (!customerId) return null
  try {
    const customer = await stripe.customers.retrieve(customerId)
    if ((customer as Stripe.DeletedCustomer).deleted) return null
    return (customer as Stripe.Customer).email ?? null
  } catch (err) {
    console.error("[v0] webhook: failed to retrieve customer", customerId, "-", err instanceof Error ? err.message : err)
    return null
  }
}

/** Safely retrieve a full subscription object from an id. */
async function retrieveSubscription(subscriptionId: string | null | undefined): Promise<Stripe.Subscription | null> {
  if (!subscriptionId) return null
  try {
    return await stripe.subscriptions.retrieve(subscriptionId)
  } catch (err) {
    console.error(
      "[v0] webhook: failed to retrieve subscription",
      subscriptionId,
      "-",
      err instanceof Error ? err.message : err,
    )
    return null
  }
}

/**
 * Given a Stripe subscription (and optional pre-resolved email), sync the
 * matching row in public.subscriptions: resolve/create the auth user, then
 * upsert the subscription record.
 */
async function syncSubscription(
  subscription: Stripe.Subscription,
  opts: { emailOverride?: string | null; statusOverride?: string; sendActivationEmail?: boolean } = {},
): Promise<void> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null

  const email = opts.emailOverride ?? (await getCustomerEmail(customerId))
  if (!email) {
    console.error("[v0] webhook: no email found for subscription", subscription.id, "- skipping user link")
  }

  const userId = email
    ? await findOrCreateAuthUser(email, { sendActivationEmail: opts.sendActivationEmail ?? false })
    : null
  const status = mapSubscriptionStatus(opts.statusOverride ?? subscription.status)

  await upsertSubscriptionRecord({
    userId,
    email,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    status,
    subscription,
  })
}

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("[v0] webhook: STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
  }

  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    console.error("[v0] webhook: missing stripe-signature header")
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  // Raw body is required for signature verification.
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature"
    console.error("[v0] webhook: signature verification failed -", message)
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  console.log("[v0] webhook: received event", event.type, event.id)

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const email = session.customer_details?.email ?? session.customer_email ?? null
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id

        const subscription = await retrieveSubscription(subscriptionId)
        if (subscription) {
          // A completed checkout is the one place we send the activation /
          // login email (new user -> invite, returning user -> password reset).
          await syncSubscription(subscription, { emailOverride: email, sendActivationEmail: true })
        } else {
          console.error("[v0] webhook: checkout.session.completed had no subscription", session.id)
        }
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await syncSubscription(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        // Deletion always means access should end.
        await syncSubscription(subscription, { statusOverride: "canceled" })
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        // invoice.subscription is a string id (or null) depending on API version.
        const subscriptionId =
          typeof (invoice as unknown as { subscription?: string }).subscription === "string"
            ? (invoice as unknown as { subscription?: string }).subscription
            : null

        const subscription = await retrieveSubscription(subscriptionId)
        if (subscription) {
          // Prefer the live subscription status; fall back to past_due.
          const status = subscription.status === "unpaid" ? "unpaid" : "past_due"
          await syncSubscription(subscription, { statusOverride: status })
        } else {
          console.error("[v0] webhook: invoice.payment_failed had no linked subscription", invoice.id)
        }
        break
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        console.log("[v0] webhook: ignoring unhandled event type", event.type)
    }
  } catch (err) {
    // Returning 500 tells Stripe to retry the event later.
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[v0] webhook: handler error for", event.type, "-", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
