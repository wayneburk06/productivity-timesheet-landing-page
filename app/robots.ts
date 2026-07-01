import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: "https://www.productivitytimesheet.app",
    sitemap: "https://www.productivitytimesheet.app/sitemap.xml",
  }
}
