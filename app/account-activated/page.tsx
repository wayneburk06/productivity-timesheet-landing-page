import Link from "next/link"
import { CheckCircle2, Download, MonitorCheck } from "lucide-react"

import { ctaBaseClasses, ctaPrimaryClasses } from "@/components/download-button"
import { cn } from "@/lib/utils"
import { appConfig } from "@/lib/config"

export const metadata = {
  title: `Account activated · ${appConfig.name}`,
  description: "Your password has been set. Download the Windows app and sign in to start tracking.",
}

const checklist = ["Account activated", "Password set successfully", "Ready to sign in"]

export default function AccountActivatedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-7 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Account activated!
        </h1>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Your password has been set successfully.
        </p>

        <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-8">
          <ul className="flex flex-col gap-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6">
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

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <MonitorCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-pretty text-sm leading-relaxed text-foreground">
              Sign in to the desktop app now using your email address and the password you just set.
            </p>
          </div>
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
