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
    <Button
      asChild
      size={size}
      variant={variant}
      className={cn(
        // Consistent premium sizing: fixed height, generous padding,
        // icon + text always on one line, smooth hover.
        "h-11 gap-2 rounded-lg px-6 text-sm font-medium whitespace-nowrap transition-colors",
        className,
      )}
    >
      <Link href={appConfig.downloadUrl}>
        {showIcon ? <Download className="size-4" aria-hidden="true" /> : null}
        {label}
      </Link>
    </Button>
  )
}
