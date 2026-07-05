export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  // Number of free trial days offered before the first charge.
  trialDays: number
  // Billing interval for the recurring subscription.
  interval: "month" | "year"
}

// Source of truth for the subscription plan behind the free trial.
// The server validates the price from here — the client can only pick an id.
export const PRODUCTS: Product[] = [
  {
    id: "pro-monthly",
    name: "Productivity Timesheet Pro",
    description: "Full access to the Windows app. Cancel anytime during your trial.",
    priceInCents: 900, // $9.00 / month after the trial
    trialDays: 7,
    interval: "month",
  },
]

export const DEFAULT_PLAN_ID = "pro-monthly"
