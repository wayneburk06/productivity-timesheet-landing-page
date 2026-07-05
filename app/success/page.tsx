import Link from "next/link"
import { CheckCircle2, Download, LogIn } from "lucide-react"
import { PageViewTracker } from "@/components/page-view-tracker"
import { DownloadButton } from "@/components/download-button"
import { stripe } from "@/lib/stripe"
import { appConfig } from "@/lib/config"

export const metadata = {
  title: `Your trial is ready · ${appConfig.name}`,
  description: "Download Productivity Timesheet for Windows and sign in to start tracking.",
}

async function getSession(sessionId: string | undefined) {
  if (!sessionId) return null
  try {
    return await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return null
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  const session = await getSession(session_id)
  const isConfirmed = session?.status === "complete"

  const steps = [
    {
      icon: Download,
      title: "Download the Windows app",
      body: `Get the ${appConfig.name} installer for Windows and run the setup file.`,
    },
    {
      icon: LogIn,
      title: "Sign in inside the app",
      body: "Open the app and sign in with the email you used at checkout to activate your trial.",
    },
  ]

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <PageViewTracker path="/success" />
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </span>

        <h1 className="mt-7 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your 7-day free trial is active
        </h1>
        <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          {isConfirmed
            ? "Thanks for starting your trial. Finish setup in two quick steps."
            : "Your trial is being set up. Finish setup in two quick steps below."}
        </p>

        <div className="mt-10 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm sm:p-8">
          <ol className="flex flex-col gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2 text-base font-medium text-foreground">
                    <step.icon className="size-4 text-primary" aria-hidden="true" />
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col items-center gap-3">
            <DownloadButton className="w-full shadow-sm sm:w-auto" />
            <p className="text-xs text-muted-foreground">
              {appConfig.fileSize} · {appConfig.minWindows}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
