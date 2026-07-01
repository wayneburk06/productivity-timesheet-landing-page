import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/landing/legal-page"
import { appConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice and imprint for Productivity Timesheet.",
}

export default function ImprintPage() {
  return (
    <LegalPage title="Legal Notice">
      <p>Information according to Section 5 DDG (Germany)</p>

      <LegalSection heading="Responsible for content">
        <p className="flex flex-col">
          <span>{appConfig.company.owner}</span>
          {appConfig.company.addressLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Email:{" "}
          <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${appConfig.company.email}`}>
            {appConfig.company.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimer">
        <p>
          Despite careful control of content, we assume no liability for the content of external
          links. The operators of linked pages are solely responsible for their content.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
