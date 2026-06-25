import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/landing/legal-page"
import { appConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Productivity Timesheet handles your data.",
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        This privacy policy explains how the {appConfig.name} website and desktop application handle
        your information. This is a placeholder draft — please review it with a legal professional
        before publishing.
      </p>

      <LegalSection heading="The desktop application">
        <p>
          {appConfig.name} is a privacy-first Windows application. All of your timesheet data is
          stored locally in a SQLite database on your own computer. The application does not upload,
          sync, or transmit your task and time data to us or any third party. Optional Microsoft
          Outlook Calendar sync communicates directly between your machine and Microsoft.
        </p>
      </LegalSection>

      <LegalSection heading="This website">
        <p>
          To understand how many people visit and download the application, we record basic,
          privacy-friendly analytics: anonymous page views and download button clicks. We do not
          store raw IP addresses — instead a one-way, salted hash is kept solely to approximately
          de-duplicate visits. We do not use advertising cookies or sell any data.
        </p>
      </LegalSection>

      <LegalSection heading="What we collect on the site">
        <ul className="list-disc pl-5">
          <li>Page views (which page was viewed and when)</li>
          <li>Download clicks (which version, and when)</li>
          <li>Referrer and browser user-agent string</li>
          <li>A salted, irreversible hash derived from your IP address</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          You may request information about the data associated with you, or its deletion, by
          contacting us. Because website analytics are anonymized, we may be unable to link records
          to a specific individual.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          For any privacy questions, email{" "}
          <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${appConfig.contactEmail}`}>
            {appConfig.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}
