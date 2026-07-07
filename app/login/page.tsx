import { LogIn } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"
import { appConfig } from "@/lib/config"

export const metadata = {
  title: `Anmelden · ${appConfig.name}`,
  description: "Melde dich mit deiner E-Mail-Adresse und deinem Passwort an.",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  // Only allow relative next-paths to prevent open redirect attacks.
  const safNext = next?.startsWith("/") ? next : "/account"

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <LogIn className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-7 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Willkommen zurück
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Melde dich an, um dein Abonnement zu verwalten.
        </p>

        <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-8">
          <LoginForm next={safNext} />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Noch kein Konto?{" "}
          <a href="/" className="underline underline-offset-4 hover:text-foreground">
            Zur Startseite
          </a>
        </p>
      </div>
    </main>
  )
}
