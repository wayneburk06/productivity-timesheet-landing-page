import Link from "next/link"
import { CheckCircle2, Download } from "lucide-react"
import { PageViewTracker } from "@/components/page-view-tracker"
import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"
import { cn } from "@/lib/utils"
import { appConfig } from "@/lib/config"

export const metadata = {
  title: `You're all set · ${appConfig.name}`,
  description: "Your free trial has started. Download the Windows app and sign in to start tracking.",
}

const checklist = [
  "Free trial activated",
  "Account created",
  "Download the app",
  "Sign in",
  "Start tracking your productivity",
]

export default function SuccessPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <PageViewTracker path="/success" />
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-7 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          You&apos;re all set!
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Your free trial has started successfully.
        </p>

        <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-8">
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            Your account has been created and your free trial is now active.
          </p>
          <p className="mt-4 text-pretty text-base leading-relaxed text-foreground">
            Next step: download the Windows application and sign in using the email address you used
            during checkout.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href={appConfig.downloadUrl}
              className={cn(ctaBaseClasses, ctaPrimaryClasses, "w-full sm:w-auto")}
            >
              <Download aria-hidden="true" />
              Download for Windows
            </Link>
            <p className="text-xs text-muted-foreground">
              {appConfig.fileSize} · {appConfig.minWindows}
            </p>
          </div>

          <ul className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/"
          className="mt-8 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
