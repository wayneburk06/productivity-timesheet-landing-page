import Link from "next/link"
import { Download } from "lucide-react"
import { appConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "secondary"
  label?: string
  showIcon?: boolean
}

// Unified premium button sizing shared by every CTA on the site.
// The classes are applied directly to the anchor so the icon and label are
// always perfectly centered on a single line (base-ui's Button `asChild` does
// not forward styles to the child, which caused the icon to stack on the text).
export const ctaBaseClasses =
  "inline-flex h-12 items-center justify-center gap-2.5 rounded-lg px-7 text-sm font-medium leading-none whitespace-nowrap transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0"

export const ctaPrimaryClasses =
  "bg-primary text-primary-foreground hover:bg-primary/90"

export function DownloadButton({ className, label = "Download for Windows", showIcon = true }: Props) {
  // Buttons point at the internal /download route, which performs the tracking
  // and GA event before redirecting straight to the installer asset. This keeps
  // the user off the GitHub release page.
  return (
    <Link href={appConfig.downloadUrl} className={cn(ctaBaseClasses, ctaPrimaryClasses, className)}>
      {showIcon ? <Download aria-hidden="true" /> : null}
      {label}
    </Link>
  )
}
