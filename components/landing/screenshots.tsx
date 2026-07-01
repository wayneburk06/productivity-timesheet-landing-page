import {
  DailyPlannerScreen,
  DashboardScreen,
  FloatingTaskPopupScreen,
  WeeklyReportScreen,
} from "./app-screens"

const shots = [
  {
    title: "Daily planner",
    caption: "Block out your day in 15-minute increments, planned and actual side by side.",
    screen: <DailyPlannerScreen />,
  },
  {
    title: "Floating task popup",
    caption:
      "Stay focused with an always-on-top popup that reminds you what to work on next and lets you quickly log your actual activity.",
    screen: <FloatingTaskPopupScreen />,
  },
  {
    title: "Productivity dashboard",
    caption: "Trends, focus time, category breakdowns and on-plan percentage at a glance.",
    screen: <DashboardScreen />,
  },
  {
    title: "Weekly report",
    caption: "Automatic weekly summaries with KPIs, top categories and top projects.",
    screen: <WeeklyReportScreen />,
  },
]

export function Screenshots() {
  return (
    <section id="screenshots" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Screenshots</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A clean, focused workspace
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            See how Productivity Timesheet keeps your plan and your reality side by side.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
          {shots.map((shot) => (
            <figure key={shot.title} className="flex flex-col">
              {shot.screen}
              <figcaption className="mt-4 flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">{shot.title}</span>
                <span className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {shot.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
