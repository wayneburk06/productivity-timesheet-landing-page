"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"
import { cn } from "@/lib/utils"

interface SetPasswordFormProps {
  initialError?: string
  mode?: "activation" | "reset"
}

export function SetPasswordForm({ initialError, mode = "activation" }: SetPasswordFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(initialError ?? null)

  // Establish the activation/recovery session before showing the form. 
  // Supabase can deliver the session in two ways depending on the email template:
  //   - OTP flow (default): token_hash + type -> handled by /auth/callback,
  //     which verifies the token via verifyOtp(), then sets cookies.
  //     Here we simply read the resulting user session from cookies.
  //   - PKCE flow: code -> handled by /auth/callback, which exchanges the code
  //     for a session via exchangeCodeForSession(), then sets cookies.
  //   - Implicit flow (rare): tokens in URL hash (#access_token=...&refresh_token=...).
  //     Fragments never reach the server, so we set the session on the client.
  useEffect(() => {
    let active = true

    async function establishSession() {
      // First, check for implicit flow tokens in the URL fragment (rare, but supported).
      if (typeof window !== "undefined" && window.location.hash) {
        const params = new URLSearchParams(window.location.hash.replace(/^#/, ""))
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")
        const fragmentError = params.get("error_description") || params.get("error")

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          // Strip the tokens from the URL immediately (never leave them around).
          window.history.replaceState(null, "", window.location.pathname)
          if (sessionError && active) {
            console.log("[v0] set-password-form: setSession error:", sessionError.message)
            setError(sessionError.message)
          }
        } else if (fragmentError) {
          window.history.replaceState(null, "", window.location.pathname)
          if (active) {
            console.log("[v0] set-password-form: fragment error:", fragmentError)
            setError(fragmentError)
          }
        }
      }

      // Now check for a valid session. The /auth/callback route will have already
      // verified the token_hash or code and set the session in cookies if successful.
      const { data } = await supabase.auth.getUser()
      if (!active) return
      
      if (data.user) {
        console.log("[v0] set-password-form: valid session found for:", data.user.email)
        setHasSession(true)
        setEmail(data.user.email ?? null)
        // A valid session supersedes any stale error from the query string.
        setError(null)
      } else {
        console.log("[v0] set-password-form: no valid session found")
      }
      setCheckingSession(false)
    }

    void establishSession()
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

    // Sign out so the session isn't left lingering in the browser,
    // then send the user to the confirmation page or login.
    await supabase.auth.signOut()
    if (mode === "reset") {
      router.push("/login?reset=success")
    } else {
      router.push("/account-activated")
    }
  }

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        <span>
          {mode === "reset"
            ? "Verifying your reset link…"
            : "Verifying your activation link…"}
        </span>
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="text-center">
        <p className="text-pretty text-base leading-relaxed text-foreground">
          {error ??
            (mode === "reset"
              ? "This reset link is invalid or has expired."
              : "This activation link is invalid or has expired.")}
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
          {mode === "reset" ? "New password" : "New password"}
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
        {submitting
          ? mode === "reset"
            ? "Resetting password…"
            : "Setting password…"
          : mode === "reset"
            ? "Reset password"
            : "Set password"}
      </button>
    </form>
  )
}
