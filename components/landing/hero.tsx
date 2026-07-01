import { ShieldCheck } from "lucide-react"
import { DownloadButton } from "@/components/download-button"
import { LearnMoreButton } from "@/components/learn-more-button"
import { appConfig } from "@/lib/config"
import { AppMock } from "./app-mock"

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* subtle background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.922_0_0/0.6)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.922_0_0/0.6)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Privacy-first · Your data stays on your PC
          </span>

          <h1 className="mt-7 text-4xl leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            <span className="block font-normal">Plan every 15 minutes.</span>
            <span className="mt-1 block font-bold sm:mt-2">Know where your time really goes.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            A powerful Windows productivity app that helps you compare your planned work with what
            you actually accomplished. Stay focused, improve your productivity and gain insights
            into your daily work.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <DownloadButton className="shadow-sm" />
            <LearnMoreButton />
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
