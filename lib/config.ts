// Central place to manage app metadata and the download link.
// Replace DOWNLOAD_URL with the real Windows installer URL when ready.

export const appConfig = {
  name: "Productivity Timesheet",
  tagline: "Plan every 15 minutes. Know where your time really goes.",
  // The latest Windows installer. This is a placeholder — swap it for the
  // real .exe / .msi download URL (e.g. /downloads/ProductivityTimesheet-Setup.exe).
  downloadUrl: "/downloads/ProductivityTimesheet-Setup.exe",
  version: "1.0.0",
  fileSize: "24 MB",
  minWindows: "Windows 10 (64-bit) or later",
  contactEmail: "support@productivitytimesheet.app",
  // Used in the Imprint / Legal Notice. Replace with real details.
  company: {
    name: "Productivity Timesheet",
    owner: "Your Name",
    addressLines: ["Your Street 1", "12345 Your City", "Germany"],
    email: "support@productivitytimesheet.app",
  },
} as const
