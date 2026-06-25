import { Download, LogOut, MousePointerClick, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/stats/actions"
import type { StatsSummary } from "@/lib/stats"

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string
  value: string
  sub: string
  icon: typeof Users
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}

export function Dashboard({ stats }: { stats: StatsSummary }) {
  const maxDaily = Math.max(1, ...stats.daily.map((d) => Math.max(d.views, d.downloads)))

  return (
    <div className="min-h-dvh bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              Stats Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">Productivity Timesheet analytics</p>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm" className="gap-1.5">
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total visitors"
            value={stats.totalViews.toLocaleString()}
            sub={`${stats.viewsLast7.toLocaleString()} in last 7 days`}
            icon={Users}
          />
          <StatCard
            label="Unique visitors"
            value={stats.uniqueVisitors.toLocaleString()}
            sub="By anonymized IP hash"
            icon={MousePointerClick}
          />
          <StatCard
            label="Downloads"
            value={stats.totalDownloads.toLocaleString()}
            sub={`${stats.downloadsLast7.toLocaleString()} in last 7 days`}
            icon={Download}
          />
          <StatCard
            label="Conversion rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            sub="Downloads ÷ visitors"
            icon={TrendingUp}
          />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Last 14 days</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-primary" /> Views
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-chart-3" /> Downloads
              </span>
            </div>
          </div>

          <div className="mt-6 flex h-48 items-end gap-1.5">
            {stats.daily.map((d) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center gap-1">
                <div className="flex h-40 w-full items-end justify-center gap-0.5">
                  <div
                    className="w-1/2 rounded-t bg-primary transition-all"
                    style={{ height: `${(d.views / maxDaily) * 100}%` }}
                    title={`${d.views} views`}
                  />
                  <div
                    className="w-1/2 rounded-t bg-chart-3 transition-all"
                    style={{ height: `${(d.downloads / maxDaily) * 100}%` }}
                    title={`${d.downloads} downloads`}
                  />
                </div>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Visitor counts are based on privacy-friendly, anonymized analytics. No raw IP addresses
          are stored.
        </p>
      </main>
    </div>
  )
}
