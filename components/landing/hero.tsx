import { ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DownloadButton } from "@/components/download-button"
import { appConfig } from "@/lib/config"
import { AppMock } from "./app-mock"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* subtle background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.92_0.006_256/0.5)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.92_0.006_256/0.5)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Privacy-first · Your data stays on your PC
          </span>

          <h1 className="mt-6 text-pretty text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Plan every 15 minutes. Know where your time really goes.
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A powerful Windows productivity app that helps you compare your planned work with what
            you actually accomplished. Stay focused, improve your productivity and gain insights
            into your daily work.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <DownloadButton className="shadow-sm" />
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href="#features">
                Learn More
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Free to use · {appConfig.fileSize} · {appConfig.minWindows}
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-4xl">
          <AppMock />
        </div>
      </div>
    </section>
  )
}
