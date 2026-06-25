"use client"

import { useActionState } from "react"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { login } from "@/app/stats/actions"

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Lock className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-center text-xl font-semibold tracking-tight text-foreground">
          Stats Dashboard
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter the password to view visitor and download analytics.
        </p>

        {!configured ? (
          <p className="mt-6 rounded-lg border border-border bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
            No password is configured yet. Set the <code className="font-mono">STATS_PASSWORD</code>{" "}
            environment variable to enable access.
          </p>
        ) : (
          <form action={formAction} className="mt-6 flex flex-col gap-3">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-ring/40 focus-visible:ring-2"
            />
            {state?.error ? (
              <p className="text-sm text-destructive">{state.error}</p>
            ) : null}
            <Button type="submit" disabled={pending} className="mt-1">
              {pending ? "Checking..." : "Unlock dashboard"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
