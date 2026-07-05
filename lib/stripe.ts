import "server-only"

import Stripe from "stripe"

// The single canonical Stripe secret key, used for both checkout and webhook
// verification. Must be the live secret key for the account that owns the
// live price. Never exposed to the client (server-only import).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
