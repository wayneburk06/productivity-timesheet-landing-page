import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { appConfig } from "@/lib/config"

const faqs = [
  {
    q: "Is the app free?",
    a: "Yes. Productivity Timesheet is free to download and use. There are no accounts to create and no subscription required.",
  },
  {
    q: "Does it work offline?",
    a: "Absolutely. The app runs entirely on your computer and does not require an internet connection. Outlook sync is the only feature that uses a connection.",
  },
  {
    q: "Is Microsoft Outlook required?",
    a: "No. Outlook Calendar sync is optional. You can plan and track your time fully without Outlook — connecting it simply pulls your meetings into your daily plan automatically.",
  },
  {
    q: "Where is my data stored?",
    a: "All of your data is stored locally in a SQLite database on your own PC. Nothing is uploaded to the cloud, and no third parties have access to it.",
  },
  {
    q: "Which Windows versions are supported?",
    a: `Productivity Timesheet supports ${appConfig.minWindows}. Both 64-bit Windows 10 and Windows 11 are fully supported.`,
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
