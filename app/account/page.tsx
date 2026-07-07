import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { ManageSubscriptionButton } from "@/components/account/manage-subscription-button"

export const metadata: Metadata = {
  title: "Account – Productivity Timesheet",
  description: "Verwalte dein Abonnement und deine Kontodaten.",
  robots: { index: false, follow: false },
}

type SubscriptionRow = {
  subscription_status: string | null
  trial_end: string | null
  current_period_end: string | null
  email: string | null
}

const STATUS_LABELS: Record<string, string> = {
  trialing: "Kostenlose Testphase aktiv",
  active: "Aktiv",
  past_due: "Zahlung ausstehend",
  canceled: "Gekündigt",
  unpaid: "Unbezahlt",
}

const STATUS_ACTIVE = new Set(["trialing", "active"])

function formatDate(iso: string | null): string {
  if (!iso) return "–"
  return new Intl.DateTimeFormat("de-DE", { dateStyle: "long" }).format(new Date(iso))
}

export default async function AccountPage() {
  // Require an authenticated session — redirect to home if not logged in.
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/account")
  }

  // Fetch the most recent subscription row for this user.
  const admin = getSupabaseAdmin()
  const { data: sub } = await admin
    .from("subscriptions")
    .select("subscription_status, trial_end, current_period_end, email")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionRow>()

  const status = sub?.subscription_status ?? null
  const isActive = status ? STATUS_ACTIVE.has(status) : false
  const statusLabel = status ? (STATUS_LABELS[status] ?? status) : "Kein Abonnement gefunden"
  const renewalDate =
    status === "trialing"
      ? formatDate(sub?.trial_end ?? null)
      : formatDate(sub?.current_period_end ?? null)
  const renewalLabel = status === "trialing" ? "Testphase endet am" : "Verlängert sich am"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          {isActive ? (
            <CheckCircle2 className="h-10 w-10 text-foreground" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dein Account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        {/* Subscription status */}
        <div className="mb-6 rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Status</span>
            <span
              className={cn(
                "font-medium",
                isActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {statusLabel}
            </span>
          </div>
          {(sub?.trial_end ?? sub?.current_period_end) && (
            <div className="mt-2 flex items-center justify-between gap-4 border-t border-border pt-2">
              <span className="text-muted-foreground">{renewalLabel}</span>
              <span className="font-medium text-foreground">{renewalDate}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <ManageSubscriptionButton className="w-full" />
          <Link
            href="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  )
}


