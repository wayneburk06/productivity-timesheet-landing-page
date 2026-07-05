"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"
import { startTrialCheckout } from "@/app/actions/stripe"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

type Props = {
  className?: string
  label?: string
  showIcon?: boolean
}

// Primary CTA across the site. Kicks off a Stripe subscription Checkout with a
// free trial, then redirects the user to Stripe's hosted checkout page.
export function StartTrialButton({
  className,
  label = "Start Free Trial",
  showIcon = true,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = () => {
    setError(null)
    trackEvent("start_trial_clicked")
    startTransition(async () => {
      try {
        const url = await startTrialCheckout()
        window.location.href = url
      } catch {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          ctaBaseClasses,
          ctaPrimaryClasses,
          "disabled:cursor-not-allowed disabled:opacity-70",
          className,
        )}
      >
        {isPending ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : showIcon ? (
          <ArrowRight aria-hidden="true" />
        ) : null}
        {isPending ? "Redirecting…" : label}
      </button>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
