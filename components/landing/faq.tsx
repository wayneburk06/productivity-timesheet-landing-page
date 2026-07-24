"use client"

import { useRef } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { appConfig } from "@/lib/config"
import { trackEvent } from "@/lib/analytics"

const faqs = [
  {
    q: "How does the free trial work?",
    a: "You start with a free 7-day trial. Create your account, download the Windows app and sign in to start tracking. You won't be charged until the trial ends, and you can cancel anytime before then.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. You create an account when you start your free trial, then sign in inside the Windows app to activate it. This keeps your subscription and trial linked to you.",
  },
  {
    q: "Does it work offline?",
    a: "Absolutely. Once you've signed in, the app runs entirely on your computer and does not require a constant internet connection. Outlook sync is the only feature that uses a connection.",
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
  {
    q: "How can I cancel my subscription?",
    a: "Subscription and billing can be managed anytime in the Account area.",
  },
  {
    q: "Where can I find my invoices?",
    a: 'Invoices are available in the Account area under "Manage subscription".',
  },
  {
    q: "What should I do if the download didn't work or start?",
    a: "If the download fails or doesn't start, try logging into your account on the website. You'll find a download link in the Account area that you can use to download the app again. If you continue to experience issues, please contact support@productivitytimesheet.app.",
  },
]

export function Faq() {
  // Track which items are already open so we only fire on newly-opened items.
  const openValues = useRef<Set<string>>(new Set())

  return (
    <section id="faq" className="border-t border-border bg-secondary/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-10 w-full"
          onValueChange={(value) => {
            const current = new Set(
              (Array.isArray(value) ? value : [value]).map(String),
            )
            // Fire only for items that were not open before.
            for (const item of current) {
              if (!openValues.current.has(item)) {
                const index = Number(item.replace("item-", ""))
                trackEvent("faq_opened", {
                  faq_index: index,
                  faq_question: faqs[index]?.q ?? item,
                })
              }
            }
            openValues.current = current
          }}
        >
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
