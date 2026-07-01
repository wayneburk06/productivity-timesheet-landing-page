"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Download, Loader2 } from "lucide-react"
import { appConfig } from "@/lib/config"
import { trackEvent } from "@/lib/analytics"

export default function DownloadPage() {
  // Guard against React StrictMode double-invoking the effect in development,
  // so tracking + the GA event fire exactly once per visit.
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    // Fire-and-forget server-side tracking. keepalive lets it complete even if
    // the browser starts the file download right away.
    try {
      void fetch("/api/track/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: appConfig.version }),
        keepalive: true,
      })
      // GA4 custom event — same event name the buttons previously fired.
      trackEvent("download_button_clicked", { app_version: appConfig.version })
      // Optional legacy analytics globals, preserved from the button logic.
      // @ts-expect-error optional analytics globals
      window.dataLayer?.push?.({ event: "download_click", app_version: appConfig.version })
      // @ts-expect-error optional analytics globals
      window._paq?.push?.(["trackEvent", "Download", "Click", "Windows"])
    } catch {
      // Never block the download because tracking failed.
    }

    // Give the tracking/GA calls a brief moment to dispatch, then send the user
    // straight to the installer. Navigating to the .exe triggers the download
    // without navigating away from this page.
    const timer = setTimeout(() => {
      window.location.href = appConfig.installerUrl
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Download className="size-7" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-balance text-2xl font-semibold text-foreground">
            Your download is starting
          </h1>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {appConfig.name} for Windows should begin downloading automatically.
            You can safely close this tab once the file has saved.
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Preparing your installer…
        </p>
        <p className="text-sm text-muted-foreground">
          {"Download didn't start? "}
          <a
            href={appConfig.installerUrl}
            className="font-medium text-primary underline underline-offset-4"
          >
            Click here to download manually
          </a>
          .
        </p>
        <Link
          href="/"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  )
}
