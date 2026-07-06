// Central place to manage app metadata and the download link.
// Replace DOWNLOAD_URL with the real Windows installer URL when ready.

export const appConfig = {
  name: "Productivity Timesheet",
  tagline: "Plan every 15 minutes. Know where your time really goes.",
  // Where Download buttons point. This internal route handles tracking + the
  // GA event, then redirects the user straight to the installer asset so they
  // never see the GitHub release page.
  downloadUrl: "/download",
  // The real Windows installer asset. `latest/download` always resolves to the
  // newest published release, so this keeps working across future releases.
  installerUrl:
    "https://github.com/wayneburk06/productivity-timesheet/releases/latest/download/ProductivityTimesheetSetup-v2.1.0.exe",
  version: "2.0.0",
  fileSize: "24 MB",
  minWindows: "Windows 10 (64-bit) or later",
  contactEmail: "support@productivitytimesheet.app",
  // Used in the Imprint / Legal Notice.
  company: {
    name: "Elvatica",
    owner: "Wayne Burk",
    addressLines: ["Limbergstraße 11", "35649 Bischoffen", "Germany"],
    website: "https://productivitytimesheet.app",
    email: "support@productivitytimesheet.app",
  },
} as const
