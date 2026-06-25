import { CheckCircle2, Circle, Clock3 } from "lucide-react"

type Block = {
  time: string
  planned: string
  actual?: string
  status: "done" | "active" | "planned"
}

const blocks: Block[] = [
  { time: "09:00", planned: "Inbox & daily planning", actual: "Inbox & daily planning", status: "done" },
  { time: "09:15", planned: "Inbox & daily planning", actual: "Inbox & daily planning", status: "done" },
  { time: "09:30", planned: "Client proposal draft", actual: "Client proposal draft", status: "done" },
  { time: "09:45", planned: "Client proposal draft", actual: "Slack / interruptions", status: "done" },
  { time: "10:00", planned: "Deep work: Q3 report", actual: "Deep work: Q3 report", status: "active" },
  { time: "10:15", planned: "Deep work: Q3 report", status: "planned" },
  { time: "10:30", planned: "Team sync (Outlook)", status: "planned" },
  { time: "10:45", planned: "Team sync (Outlook)", status: "planned" },
]

// A lightweight, faithful CSS mock of the desktop app — no screenshot needed.
export function AppMock() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-primary/5">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Productivity Timesheet — Tuesday, June 9
        </span>
        <span className="text-xs font-medium text-primary">82% on plan</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1fr_240px]">
        {/* Timeline */}
        <div className="border-r border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Today&apos;s 15-minute blocks</h3>
            <span className="text-xs text-muted-foreground">Planned vs actual</span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {blocks.map((b, i) => {
              const mismatch = b.actual && b.actual !== b.planned
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
                    {b.time}
                  </span>
                  <span className="shrink-0">
                    {b.status === "done" ? (
                      <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                    ) : b.status === "active" ? (
                      <Clock3 className="size-4 text-primary" aria-hidden="true" />
                    ) : (
                      <Circle className="size-4 text-border" aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={[
                      "min-w-0 flex-1 truncate rounded-md px-2.5 py-1.5 text-xs font-medium",
                      b.status === "active"
                        ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
                        : b.status === "done"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-secondary/50 text-muted-foreground",
                    ].join(" ")}
                  >
                    {b.actual ?? b.planned}
                    {mismatch ? (
                      <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                        (planned: {b.planned})
                      </span>
                    ) : null}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Side panel */}
        <div className="flex flex-col gap-4 p-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Focus today</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">3h 45m</p>
          </div>
          <div className="h-px bg-border" />
          <div className="flex flex-col gap-2">
            {[
              { label: "Deep work", value: 62 },
              { label: "Meetings", value: 24 },
              { label: "Admin", value: 14 },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="tabular-nums text-foreground">{row.value}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-lg border border-border bg-secondary/40 p-3">
            <p className="text-[11px] font-medium text-muted-foreground">Current task</p>
            <p className="mt-0.5 text-xs font-semibold text-foreground">Deep work: Q3 report</p>
            <p className="mt-1 text-[11px] tabular-nums text-primary">12:34 elapsed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
