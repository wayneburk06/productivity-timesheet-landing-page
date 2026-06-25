import { ArrowLeft, Clock } from "lucide-react"
import type { ReactNode } from "react"
import { SiteFooter } from "@/components/landing/site-footer"
import { appConfig } from "@/lib/config"

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  updated?: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clock className="size-5" aria-hidden="true" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              {appConfig.name}
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </a>
        </div>
      </header>

      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {updated ? (
            <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
          ) : null}
          <div className="prose-legal mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-muted-foreground">
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      {children}
    </section>
  )
}
