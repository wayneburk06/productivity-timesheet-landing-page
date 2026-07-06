"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"
import { cn } from "@/lib/utils"

export function SetPasswordForm({ initialError }: { initialError?: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(initialError ?? null)

  // Confirm the invite link produced a valid session before showing the form.
  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return
      if (data.user) {
        setHasSession(true)
        setEmail(data.user.email ?? null)
      }
      setCheckingSession(false)
    })
    return () => {
      active = false
    }
  }, [supabase])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    // Sign out so the activation session isn't left lingering in the browser,
    // then send the user to the confirmation page.
    await supabase.auth.signOut()
    router.push("/account-activated")
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        <span>Verifying your activation link…</span>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="text-center">
        <p className="text-pretty text-base leading-relaxed text-foreground">
          {error ?? "This activation link is invalid or has expired."}
        </p>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
          Please use the most recent email we sent you, or contact support if the problem persists.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {email ? (
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          Setting a password for <span className="font-medium text-foreground">{email}</span>
        </p>
      ) : null}

      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          New password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none ring-primary/40 focus:ring-2"
          placeholder="At least 8 characters"
        />
      </div>

      <div className="flex flex-col gap-2 text-left">
        <label htmlFor="confirm" className="text-sm font-medium text-foreground">
          Confirm password
        </label>
        <input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none ring-primary/40 focus:ring-2"
          placeholder="Re-enter your password"
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
          <KeyRound className="size-4" aria-hidden="true" />
        )}
        {submitting ? "Setting password…" : "Set password"}
      </button>
    </form>
  )
}
