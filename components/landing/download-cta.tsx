import { Check, Sparkles } from "lucide-react"
import { StartTrialButton } from "@/components/start-trial-button"
import { appConfig } from "@/lib/config"

const points = [
  "7-day free trial",
  "Cancel anytime",
  "Works fully offline",
  "Data stays on your PC",
]

export function DownloadCta() {
  return (
    <section id="trial" className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted px-6 py-14 text-center shadow-sm sm:px-12 sm:py-20">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-foreground text-background">
            <Sparkles className="size-7" aria-hidden="true" />
          </span>
          <h2 className="mt-7 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Start your free trial of Productivity Timesheet
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Create your account, then download the Windows app and start tracking your time in
            minutes. Version {appConfig.version} · {appConfig.fileSize}
          </p>

          <div className="mt-9 flex justify-center">
            <StartTrialButton className="shadow-sm" />
          </div>

          <ul className="mx-auto mt-9 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check className="size-4 text-foreground" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-xs text-muted-foreground">
            Compatible with {appConfig.minWindows}
          </p>
        </div>
      </div>
    </section>
  )
}
