"use client"

import { useState, useTransition } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"

export function ManageSubscriptionButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch("/api/stripe/customer-portal", { method: "POST" })
        const body = (await res.json()) as { url?: string; error?: string }

        if (!res.ok || !body.url) {
          setError(
            body.error ??
              "Das Kundenportal konnte nicht geöffnet werden. Bitte versuche es erneut.",
          )
          return
        }

        window.location.href = body.url
      } catch {
        setError(
          "Verbindungsfehler. Bitte prüfe deine Internetverbindung und versuche es erneut.",
        )
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        aria-busy={isPending}
        className={cn(ctaBaseClasses, ctaPrimaryClasses, "w-full sm:w-auto", className)}
      >
        {isPending ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          <ExternalLink aria-hidden="true" />
        )}
        {isPending ? "Wird geöffnet…" : "Abonnement verwalten"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-destructive text-center max-w-xs">
          {error}
        </p>
      )}
    </div>
  )
}
