import { KeyRound } from "lucide-react"

import { SetPasswordForm } from "@/components/auth/set-password-form"
import { appConfig } from "@/lib/config"

export const metadata = {
  title: `Set your password · ${appConfig.name}`,
  description: "Choose a password to activate your account.",
}

// Activation is per-user and must never be cached.
export const dynamic = "force-dynamic"

export default async function SetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-7 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Set your password
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Choose a password to finish activating your account.
        </p>

        <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-8">
          <SetPasswordForm initialError={error} />
        </div>
      </div>
    </main>
  )
}
