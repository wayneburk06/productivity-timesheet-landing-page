import { ImageIcon } from "lucide-react"

const shots = [
  {
    title: "Daily planner",
    caption: "Block out your day in 15-minute increments.",
    aspect: "aspect-[16/10]",
  },
  {
    title: "Planned vs actual",
    caption: "Compare intention with reality at a glance.",
    aspect: "aspect-[16/10]",
  },
  {
    title: "Productivity dashboard",
    caption: "Trends, focus time and category breakdowns.",
    aspect: "aspect-[16/10]",
  },
  {
    title: "Weekly report",
    caption: "Automatic summaries every week.",
    aspect: "aspect-[16/10]",
  },
]

// Placeholder frames — drop real PNG/JPG screenshots into /public and
// replace each placeholder with an <Image /> when they are ready.
export function Screenshots() {
  return (
    <section id="screenshots" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Screenshots</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A clean, focused workspace
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            See how Productivity Timesheet keeps your plan and your reality side by side.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {shots.map((shot) => (
            <figure
              key={shot.title}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              <div
                className={`relative flex ${shot.aspect} w-full items-center justify-center border-b border-dashed border-border bg-[repeating-linear-gradient(45deg,oklch(0.97_0.004_256),oklch(0.97_0.004_256)_12px,oklch(0.99_0.002_256)_12px,oklch(0.99_0.002_256)_24px)]`}
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="size-7" aria-hidden="true" />
                  <span className="text-xs font-medium">Screenshot placeholder</span>
                </div>
              </div>
              <figcaption className="flex flex-col gap-0.5 px-4 py-3">
                <span className="text-sm font-semibold text-foreground">{shot.title}</span>
                <span className="text-sm text-muted-foreground">{shot.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
