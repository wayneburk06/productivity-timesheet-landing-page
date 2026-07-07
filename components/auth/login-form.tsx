"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"
import { cn } from "@/lib/utils"

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    setSubmitting(false)

    if (signInError) {
      // Supabase returns "Invalid login credentials" for wrong email/password.
      // We translate it into a clear, user-facing message.
      if (
        signInError.message.toLowerCase().includes("invalid login") ||
        signInError.message.toLowerCase().includes("invalid credentials") ||
        signInError.status === 400
      ) {
        setError("E-Mail-Adresse oder Passwort ist falsch. Bitte versuche es erneut.")
      } else {
        setError(signInError.message)
      }
      return
    }

    // Redirect to the originally requested page, defaulting to /account.
    router.push(next ?? "/account")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none ring-primary/40 focus:ring-2"
          placeholder="name@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none ring-primary/40 focus:ring-2"
          placeholder="Dein Passwort"
        />
      </div>

      {error ? (
        <p role="alert" className="text-pretty text-sm leading-relaxed text-destructive">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={cn(ctaBaseClasses, ctaPrimaryClasses, "w-full disabled:opacity-70")}
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <LogIn className="size-4" aria-hidden="true" />
        )}
        {submitting ? "Wird angemeldet…" : "Anmelden"}
      </button>
    </form>
  )
}
