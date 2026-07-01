import Link from "next/link"
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
  // Buttons point at the internal /download route, which performs the tracking
  // and GA event before redirecting straight to the installer asset. This keeps
  // the user off the GitHub release page.
  return (
    <Button asChild size={size} variant={variant} className={cn("gap-2", className)}>
      <Link href={appConfig.downloadUrl}>
        {showIcon ? <Download className="size-5" aria-hidden="true" /> : null}
        {label}
      </Link>
    </Button>
  )
}
