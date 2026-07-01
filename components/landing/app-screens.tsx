import Image from "next/image"
import { ChevronDown, ChevronUp, Minus, RefreshCw, Square, X } from "lucide-react"

/**
 * Shared "desktop window" frame so every mock reads as the same application
 * shown in the hero screenshot: near-black glass window, hairline border,
 * soft ambient shadow and a faint top highlight.
 */
function ScreenFrame({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 bottom-0 -z-10 h-12 rounded-[50%] bg-foreground/20 blur-2xl"
      />
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] text-zinc-100 shadow-2xl shadow-black/60 ring-1 ring-black/50 ${className}`}
      >
        {children}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
        />
      </div>
    </div>
  )
}

/** Windows-style title bar to match the desktop app chrome. */
function TitleBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-black px-3 py-2">
      <span className="text-xs font-medium text-zinc-300">{title}</span>
      <div className="flex items-center gap-3 text-zinc-500">
        <Minus className="size-3.5" aria-hidden="true" />
        <Square className="size-3" aria-hidden="true" />
        <X className="size-3.5" aria-hidden="true" />
      </div>
    </div>
  )
}

/* 1. Daily planner — the real hero screenshot, framed and desaturated. */
export function DailyPlannerScreen() {
  return (
    <ScreenFrame>
      <Image
        src="/images/app-hero.png"
        alt="Productivity Timesheet daily planner showing planned versus actual activity in 15-minute blocks"
        width={2244}
        height={1240}
        className="h-auto w-full select-none [filter:grayscale(1)_contrast(1.06)_brightness(0.98)]"
      />
    </ScreenFrame>
  )
}

/* 2. Floating task popup — compact always-on-top reminder window. */
export function FloatingTaskPopupScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-[#050505] p-8">
      <ScreenFrame className="w-full max-w-xs">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tabular-nums text-zinc-400">21:30 – 21:45</span>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-zinc-300" aria-hidden="true" />
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-zinc-200">
                Hide
              </span>
            </div>
          </div>

          <h4 className="mt-3 text-lg font-semibold tracking-tight text-zinc-50">Coaching session</h4>

          <button
            type="button"
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400"
          >
            <span className="flex size-5 items-center justify-center rounded-full border border-white/10">
              <ChevronUp className="size-3" aria-hidden="true" />
            </span>
            Expand
          </button>

          <div className="mt-3 border-t border-white/10 pt-3">
            <p className="text-[11px] text-zinc-500">
              Next up · <span className="tabular-nums">21:45 – 22:00</span>
            </p>
            <p className="text-xs font-medium text-zinc-300">Plan next day</p>
          </div>

          <div className="mt-3">
            <label className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              Actual
            </label>
            <div className="mt-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-zinc-100">
              Coaching session
            </div>
          </div>
        </div>
      </ScreenFrame>
    </div>
  )
}

/* Small helpers for the dashboard */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[11px] font-medium text-zinc-400">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">{value}</p>
    </div>
  )
}

function Bar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-300">{label}</span>
        <span className="tabular-nums text-zinc-400">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-zinc-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* 3. Productivity dashboard — restyled to match the app's dark theme. */
export function DashboardScreen() {
  return (
    <ScreenFrame>
      <TitleBar title="Dashboard" />
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-50">Dashboard</h3>
            <p className="text-xs text-zinc-500">Jul 1, 2026 – Jul 1, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
              Today <ChevronDown className="size-3" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300">
              <RefreshCw className="size-3" aria-hidden="true" /> Refresh
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatCard label="Fill rate" value="82%" />
          <StatCard label="Total planned" value="9.5 h" />
          <StatCard label="Total actual" value="8.75 h" />
          <StatCard label="Wasted time" value="0.5 h" />
        </div>
        <div className="mt-2.5">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] font-medium text-zinc-400">Completed vs planned</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
              31 / 38 slots (82%)
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
            <h4 className="text-sm font-semibold text-zinc-100">Top categories</h4>
            <div className="mt-3 flex flex-col gap-3">
              <Bar label="Deep Work" value="4.25 h" pct={100} />
              <Bar label="Meetings" value="2.5 h" pct={59} />
              <Bar label="Email &amp; Admin" value="1.5 h" pct={35} />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
              <h4 className="text-sm font-semibold text-zinc-100">HP vs LP</h4>
              <div className="mt-3 flex flex-col gap-3">
                <Bar label="HP" value="64%" pct={64} />
                <Bar label="LP" value="36%" pct={36} />
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
              <h4 className="text-sm font-semibold text-zinc-100">Top projects</h4>
              <div className="mt-3 flex flex-col gap-3">
                <Bar label="Client Proposal" value="2.5 h" pct={100} />
                <Bar label="Product Development" value="2.25 h" pct={90} />
                <Bar label="Team Meeting" value="1 h" pct={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenFrame>
  )
}

/* Row for the weekly report KPI table */
function KpiRow({
  kpi,
  current,
  previous,
  trend,
}: {
  kpi: string
  current: string
  previous: string
  trend: string
}) {
  return (
    <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] items-center gap-2 border-t border-white/10 py-2 text-xs">
      <span className="text-zinc-300">{kpi}</span>
      <span className="text-right font-medium tabular-nums text-zinc-100">{current}</span>
      <span className="text-right tabular-nums text-zinc-500">{previous}</span>
      <span className="text-right tabular-nums text-zinc-400">{trend}</span>
    </div>
  )
}

/* 4. Weekly report — fictional but realistic English productivity report. */
export function WeeklyReportScreen() {
  return (
    <ScreenFrame>
      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-bold tracking-tight text-zinc-50">Weekly Performance Report</h3>
        <div className="mt-2 space-y-0.5 text-xs text-zinc-400">
          <p>
            <span className="font-semibold text-zinc-300">Period:</span> 2026-06-08 to 2026-06-12
          </p>
          <p>
            <span className="font-semibold text-zinc-300">Window:</span> Monday–Friday, 08:00–18:00
          </p>
        </div>

        <div className="mt-5">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span>KPI</span>
            <span className="text-right">Current</span>
            <span className="text-right">Previous</span>
            <span className="text-right">Trend</span>
          </div>
          <KpiRow kpi="Filled slots" current="84.2% (202/240)" previous="76.7% (184/240)" trend="+7.5 pp" />
          <KpiRow kpi="Total planned hours" current="42.0 h" previous="38.5 h" trend="+3.5 h" />
          <KpiRow kpi="Total actual logged hours" current="39.5 h" previous="35.0 h" trend="+4.5 h" />
          <KpiRow kpi="Wasted time hours" current="1.25 h" previous="2.5 h" trend="-1.25 h" />
          <KpiRow kpi="Wasted time percentage" current="3.2%" previous="7.1%" trend="-3.9 pp" />
          <KpiRow kpi="HP percentage" current="68%" previous="61%" trend="+7 pp" />
          <KpiRow kpi="LP percentage" current="32%" previous="39%" trend="-7 pp" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">Top Categories</h4>
            <ul className="mt-2 space-y-1.5 text-xs text-zinc-400">
              <li className="flex justify-between">
                <span>Deep Work</span>
                <span className="tabular-nums text-zinc-300">16.5 h</span>
              </li>
              <li className="flex justify-between">
                <span>Meetings</span>
                <span className="tabular-nums text-zinc-300">9.0 h</span>
              </li>
              <li className="flex justify-between">
                <span>Client Proposal</span>
                <span className="tabular-nums text-zinc-300">7.5 h</span>
              </li>
              <li className="flex justify-between">
                <span>Email &amp; Admin</span>
                <span className="tabular-nums text-zinc-300">4.25 h</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">Top Projects</h4>
            <ol className="mt-2 space-y-1.5 text-xs text-zinc-400">
              <li className="flex justify-between">
                <span>1. Client Proposal</span>
                <span className="tabular-nums text-zinc-300">9.5 h</span>
              </li>
              <li className="flex justify-between">
                <span>2. Product Development</span>
                <span className="tabular-nums text-zinc-300">8.25 h</span>
              </li>
              <li className="flex justify-between">
                <span>3. Team Meeting</span>
                <span className="tabular-nums text-zinc-300">6.0 h</span>
              </li>
              <li className="flex justify-between">
                <span>4. Deep Work</span>
                <span className="tabular-nums text-zinc-300">5.5 h</span>
              </li>
              <li className="flex justify-between">
                <span>5. Email &amp; Admin</span>
                <span className="tabular-nums text-zinc-300">4.25 h</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </ScreenFrame>
  )
}
