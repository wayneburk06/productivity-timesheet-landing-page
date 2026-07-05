import { CreditCard, MonitorDown, LogIn } from "lucide-react"

const steps = [
  {
    icon: CreditCard,
    title: "Start your free trial",
    body: "Create your account and begin your 7-day free trial. No commitment, cancel anytime.",
  },
  {
    icon: MonitorDown,
    title: "Download the Windows app",
    body: "After checkout, download Productivity Timesheet for Windows and run the installer.",
  },
  {
    icon: LogIn,
    title: "Sign in and start tracking",
    body: "Open the app, sign in with your account and start planning your day in 15-minute blocks.",
  },
]

export function Onboarding() {
  return (
    <section id="how-it-works" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">How it works</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Up and running in three steps
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <step.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-2xl font-semibold text-muted-foreground/40">{i + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
