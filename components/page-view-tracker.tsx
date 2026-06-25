"use client"

import { useEffect } from "react"

// Records a single page view per mount. Kept lightweight and non-blocking.
export function PageViewTracker({ path = "/" }: { path?: string }) {
  useEffect(() => {
    void fetch("/api/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
      keepalive: true,
    }).catch(() => {})
  }, [path])

  return null
}
