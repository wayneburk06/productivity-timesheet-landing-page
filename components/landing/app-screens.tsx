import Image from "next/image"
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react"

/**
 * A single, shared presentation system for every screenshot so they all read as
 * one product (à la Linear / Raycast): identical width, radius, border, shadow,
 * padding and a fixed 16/10 media viewport that guarantees equal-height cards.
 * Content is centered inside and never stretched.
 */
function ScreenCard({
  children,
  /** when true the child fills the viewport (used for the full-bleed hero image) */
  bleed = false,
}: {
  children: React.ReactNode
  bleed?: boolean
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-0 -z-10 h-10 rounded-[50%] bg-foreground/20 blur-2xl"
      />
      <div className="relative rounded-2xl border border-white/10 bg-[#0b0b0b] p-2 shadow-2xl shadow-black/60 ring-1 ring-black/50">
        <div
          className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#050505] ${
            bleed ? "" : "flex items-center justify-center p-4 sm:p-5"
          }`}
        >
          {children}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
        />
      </div>
    </div>
  )
}

/* 1. Daily planner — the real hero screenshot, framed and desaturated. */
export function DailyPlannerScreen() {
  return (
    <ScreenCard bleed>
      <Image
        src="/images/app-hero.png"
        alt="Productivity Timesheet daily planner showing planned versus actual activity in 15-minute blocks"
        fill
        quality={100}
        sizes="(max-width: 768px) 100vw, 520px"
        className="select-none object-cover object-top [filter:grayscale(1)_contrast(1.05)]"
      />
    </ScreenCard>
  )
}

/* 2. Floating task popup — compact always-on-top reminder window. */
export function FloatingTaskPopupScreen() {
  return (
    <ScreenCard>
      <div className="w-full max-w-[260px] rounded-xl border border-white/10 bg-[#111] p-4 shadow-lg shadow-black/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium tabular-nums text-zinc-400">21:30 – 21:45</span>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-zinc-300" aria-hidden="true" />
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-200">
              Hide
            </span>
          </div>
        </div>

        <h4 className="mt-2.5 text-base font-semibold tracking-tight text-zinc-50">Coaching session</h4>

        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400"
        >
          <span className="flex size-5 items-center justify-center rounded-full border border-white/10">
            <ChevronUp className="size-3" aria-hidden="true" />
          </span>
          Expand
        </button>

        <div className="mt-2.5 border-t border-white/10 pt-2.5">
          <p className="text-[11px] text-zinc-500">
            Next up · <span className="tabular-nums">21:45 – 22:00</span>
          </p>
          <p className="text-xs font-medium text-zinc-300">Plan next day</p>
        </div>

        <div className="mt-2.5">
          <label className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            Actual
          </label>
          <div className="mt-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-zinc-100">
            Coaching session
          </div>
        </div>
      </div>
    </ScreenCard>
  )
}

/* Small helpers for the dashboard */
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-2">
      <p className="text-[10px] font-medium text-zinc-400">{label}</p>
      <p className="mt-0.5 text-base font-semibold tracking-tight text-zinc-50">{value}</p>
    </div>
  )
}

function Bar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-zinc-300">{label}</span>
        <span className="tabular-nums text-zinc-400">{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-zinc-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* 3. Productivity dashboard — restyled to match the app's dark theme. */
export function DashboardScreen() {
  return (
    <ScreenCard>
      <div className="w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-50">Dashboard</h3>
            <p className="text-[10px] text-zinc-500">Jul 1, 2026</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
              Today <ChevronDown className="size-2.5" aria-hidden="true" />
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300">
              <RefreshCw className="size-2.5" aria-hidden="true" /> Refresh
            </span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          <StatCard label="Fill rate" value="82%" />
          <StatCard label="Planned" value="9.5 h" />
          <StatCard label="Actual" value="8.75 h" />
          <StatCard label="Wasted" value="0.5 h" />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2.5">
            <h4 className="text-[11px] font-semibold text-zinc-100">Top categories</h4>
            <div className="mt-2 flex flex-col gap-2">
              <Bar label="Deep Work" value="4.25 h" pct={100} />
              <Bar label="Meetings" value="2.5 h" pct={59} />
              <Bar label="Admin" value="1.5 h" pct={35} />
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-2.5">
            <h4 className="text-[11px] font-semibold text-zinc-100">HP vs LP</h4>
            <div className="mt-2 flex flex-col gap-2">
              <Bar label="HP" value="64%" pct={64} />
              <Bar label="LP" value="36%" pct={36} />
            </div>
          </div>
        </div>
      </div>
    </ScreenCard>
  )
}

/* Row for the weekly report KPI table */
function KpiRow({
  kpi,
  current,
  trend,
}: {
  kpi: string
  current: string
  trend: string
}) {
  return (
    <div className="grid grid-cols-[1.6fr_1fr_0.9fr] items-center gap-2 border-t border-white/10 py-1.5 text-[11px]">
      <span className="text-zinc-300">{kpi}</span>
      <span className="text-right font-medium tabular-nums text-zinc-100">{current}</span>
      <span className="text-right tabular-nums text-zinc-400">{trend}</span>
    </div>
  )
}

/* 4. Weekly report — fictional but realistic English productivity report. */
export function WeeklyReportScreen() {
  return (
    <ScreenCard>
      <div className="w-full">
        <h3 className="text-sm font-bold tracking-tight text-zinc-50">Weekly Performance Report</h3>
        <p className="mt-0.5 text-[10px] text-zinc-400">
          <span className="font-semibold text-zinc-300">Period:</span> 2026-06-08 to 2026-06-12
        </p>

        <div className="mt-3">
          <div className="grid grid-cols-[1.6fr_1fr_0.9fr] gap-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            <span>KPI</span>
            <span className="text-right">Current</span>
            <span className="text-right">Trend</span>
          </div>
          <KpiRow kpi="Filled slots" current="84.2%" trend="+7.5 pp" />
          <KpiRow kpi="Total planned hours" current="42.0 h" trend="+3.5 h" />
          <KpiRow kpi="Total actual hours" current="39.5 h" trend="+4.5 h" />
          <KpiRow kpi="Wasted time" current="1.25 h" trend="-1.25 h" />
          <KpiRow kpi="HP percentage" current="68%" trend="+7 pp" />
        </div>
      </div>
    </ScreenCard>
  )
}
