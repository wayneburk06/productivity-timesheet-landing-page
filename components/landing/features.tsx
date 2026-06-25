import {
  CalendarSync,
  Database,
  Gauge,
  LayoutDashboard,
  LineChart,
  ListChecks,
  PictureInPicture2,
  ShieldCheck,
} from "lucide-react"

const features = [
  {
    icon: ListChecks,
    title: "15-minute time blocking",
    description:
      "Plan your day in clean 15-minute increments so nothing slips through the cracks.",
  },
  {
    icon: Gauge,
    title: "Planned vs actual tracking",
    description:
      "See the gap between what you intended to do and what really happened, block by block.",
  },
  {
    icon: CalendarSync,
    title: "Outlook Calendar sync",
    description:
      "Pull meetings and events straight from Microsoft Outlook so your plan reflects reality.",
  },
  {
    icon: LineChart,
    title: "Weekly performance reports",
    description:
      "Automatic weekly summaries reveal trends, focus time and where your hours actually go.",
  },
  {
    icon: LayoutDashboard,
    title: "Productivity dashboard",
    description:
      "A single overview of focus time, categories and on-plan percentage at a glance.",
  },
  {
    icon: PictureInPicture2,
    title: "Floating current task window",
    description:
      "Keep your active task always visible in a compact, always-on-top window.",
  },
  {
    icon: Database,
    title: "Local SQLite storage",
    description:
      "Everything is stored in a fast local SQLite database — no accounts, no cloud required.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    description:
      "Your data never leaves your PC. No tracking, no syncing, no third parties.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Features</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to master your day
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Built for professionals who want clarity, focus and honest insight into how their time
            is spent.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
