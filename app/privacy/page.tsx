import type { Metadata } from "next"
import { LegalPage, LegalSection } from "@/components/landing/legal-page"
import { appConfig } from "@/lib/config"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Productivity Timesheet handles your data.",
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 1, 2026">
      <LegalSection heading="1. General Information">
        <p>
          This Privacy Policy explains how information is collected and used when you visit the{" "}
          {appConfig.name} website.
        </p>
        <p>If you have any questions regarding this Privacy Policy, you can contact:</p>
        <p>
          Email:{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={`mailto:${appConfig.contactEmail}`}
          >
            {appConfig.contactEmail}
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="2. Information We Collect">
        <p>
          When you visit this website, certain technical information may automatically be collected
          by your browser, including:
        </p>
        <ul className="list-disc pl-5">
          <li>IP address (processed in anonymized form where possible)</li>
          <li>Browser type</li>
          <li>Operating system</li>
          <li>Date and time of access</li>
          <li>Pages visited</li>
          <li>Referring website (if applicable)</li>
        </ul>
        <p>This information is used solely to improve the website and ensure its proper operation.</p>
      </LegalSection>

      <LegalSection heading="3. Google Analytics">
        <p>
          This website uses Google Analytics, a web analytics service provided by Google LLC.
        </p>
        <p>
          Google Analytics helps us understand how visitors use our website by collecting anonymous
          usage information, such as:
        </p>
        <ul className="list-disc pl-5">
          <li>Page views</li>
          <li>Session duration</li>
          <li>Device type</li>
          <li>Country or region</li>
          <li>Traffic sources</li>
          <li>Download button clicks</li>
        </ul>
        <p>Google Analytics may use cookies or similar technologies to collect this information.</p>
        <p>For more information, please visit:</p>
        <p>
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/privacy
          </a>
        </p>
        <p>
          You can prevent Google Analytics from collecting your information by using Google&apos;s
          browser opt-out add-on:
        </p>
        <p>
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://tools.google.com/dlpage/gaoptout
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="4. Download Tracking">
        <p>
          When you click the download button, the website records that a download has been
          initiated.
        </p>
        <p>This information is collected only for statistical purposes and may include:</p>
        <ul className="list-disc pl-5">
          <li>Date and time</li>
          <li>Anonymous visitor information</li>
          <li>App version downloaded</li>
        </ul>
        <p>No personal files stored on your computer are accessed.</p>
      </LegalSection>

      <LegalSection heading="5. Contact">
        <p>
          If you contact us via email, we will process the information you provide solely to respond
          to your request.
        </p>
        <p>This may include:</p>
        <ul className="list-disc pl-5">
          <li>Your email address</li>
          <li>Your name (if provided)</li>
          <li>The content of your message</li>
        </ul>
        <p>We do not sell or share your information with third parties.</p>
      </LegalSection>

      <LegalSection heading="6. Data Storage">
        <p>
          The {appConfig.name} application stores all user data locally on your own computer.
        </p>
        <p>Your productivity data is not uploaded to our servers.</p>
        <p>
          The application works offline, and your personal productivity data remains under your
          control.
        </p>
      </LegalSection>

      <LegalSection heading="7. Third-Party Services">
        <p>This website may use services provided by third parties, including:</p>
        <ul className="list-disc pl-5">
          <li>Google Analytics</li>
          <li>Vercel (website hosting)</li>
          <li>GitHub (software distribution)</li>
        </ul>
        <p>
          These providers may process technical information necessary to deliver their services.
        </p>
      </LegalSection>

      <LegalSection heading="8. Cookies">
        <p>This website may use cookies required for analytics and website functionality.</p>
        <p>
          You can configure your browser to refuse cookies. Please note that some features of the
          website may not function correctly if cookies are disabled.
        </p>
      </LegalSection>

      <LegalSection heading="9. Data Security">
        <p>
          Reasonable technical and organizational measures are taken to protect the website and user
          information against unauthorized access, alteration, or disclosure.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to this Privacy Policy">
        <p>This Privacy Policy may be updated from time to time.</p>
        <p>The latest version will always be published on this page.</p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>For privacy-related questions, please contact:</p>
        <p>
          <a
            className="text-primary underline-offset-4 hover:underline"
            href={`mailto:${appConfig.contactEmail}`}
          >
            {appConfig.contactEmail}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  )
}
