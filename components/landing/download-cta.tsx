import { Check, MonitorDown } from "lucide-react"
import { DownloadButton } from "@/components/download-button"
import { appConfig } from "@/lib/config"

const points = [
  "Free to use",
  "No account required",
  "Works fully offline",
  "Data stays on your PC",
]

export function DownloadCta() {
  return (
    <section id="download" className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary-foreground/10">
            <MonitorDown className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Download Productivity Timesheet for Windows
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80">
            Get the latest version and start tracking your time in minutes. Version{" "}
            {appConfig.version} · {appConfig.fileSize}
          </p>

          <div className="mt-8 flex justify-center">
            <DownloadButton
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-md"
            />
          </div>

          <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-1.5 text-sm text-primary-foreground/90">
                <Check className="size-4" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-primary-foreground/70">
            Compatible with {appConfig.minWindows}
          </p>
        </div>
      </div>
    </section>
  )
}
