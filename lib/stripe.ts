import "server-only"

import Stripe from "stripe"

// Use the live secret key for the Stripe account (acct_1TpQ7xLjAVqODdeg) that
// owns the live price. STRIPE_SECRET_KEY is a test/sandbox key and does not
// contain the live price used at checkout.
export const stripe = new Stripe(process.env.STRIPE_ACCESS_TOKEN_2 as string)
