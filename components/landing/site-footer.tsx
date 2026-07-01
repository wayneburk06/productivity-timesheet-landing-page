import { Clock } from "lucide-react"
import { appConfig } from "@/lib/config"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="flex w-full flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {appConfig.name}
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
          <a
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </a>
          <a
            href="/imprint"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Legal Notice
          </a>
          <a
            href={`mailto:${appConfig.contactEmail}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="w-full px-6 py-4 sm:px-8 lg:px-12">
          <p className="text-xs text-muted-foreground">
            © {year} {appConfig.company.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
