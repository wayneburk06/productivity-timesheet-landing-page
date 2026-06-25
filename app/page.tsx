import { PageViewTracker } from "@/components/page-view-tracker"
import { SiteHeader } from "@/components/landing/site-header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { Screenshots } from "@/components/landing/screenshots"
import { DownloadCta } from "@/components/landing/download-cta"
import { Faq } from "@/components/landing/faq"
import { Contact } from "@/components/landing/contact"
import { SiteFooter } from "@/components/landing/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <PageViewTracker path="/" />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <Screenshots />
        <DownloadCta />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
