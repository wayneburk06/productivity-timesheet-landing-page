import { Mail, MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { appConfig } from "@/lib/config"

export function Contact() {
  return (
    <section id="contact" className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquareText className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            We&apos;d love your feedback
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Found a bug, have a feature request, or just want to share how the app helps your
            workflow? Get in touch — every message is read and genuinely appreciated.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" className="gap-2">
              <a href={`mailto:${appConfig.contactEmail}`}>
                <Mail className="size-5" aria-hidden="true" />
                {appConfig.contactEmail}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
