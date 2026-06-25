"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { appConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "secondary"
  label?: string
  showIcon?: boolean
}

export function DownloadButton({
  className,
  size = "lg",
  variant = "default",
  label = "Download for Windows",
  showIcon = true,
}: Props) {
  function handleDownload() {
    // Fire-and-forget tracking. keepalive lets it complete during navigation.
    try {
      void fetch("/api/track/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: appConfig.version }),
        keepalive: true,
      })
      // Also push a custom event for GA/Matomo if present later.
      // @ts-expect-error optional analytics globals
      window.dataLayer?.push?.({ event: "download_click", app_version: appConfig.version })
      // @ts-expect-error optional analytics globals
      window._paq?.push?.(["trackEvent", "Download", "Click", "Windows"])
    } catch {
      // ignore — never block the download
    }
  }

  return (
    <Button asChild size={size} variant={variant} className={cn("gap-2", className)}>
      <a href={appConfig.downloadUrl} download onClick={handleDownload}>
        {showIcon ? <Download className="size-5" aria-hidden="true" /> : null}
        {label}
      </a>
    </Button>
  )
}
