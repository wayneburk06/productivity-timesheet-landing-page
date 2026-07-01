/**
 * Lightweight helper for sending custom Google Analytics 4 events.
 *
 * The GoogleAnalytics component from @next/third-parties injects the `gtag`
 * function on the window. We guard access so the app keeps working even when
 * analytics is blocked or not yet loaded (e.g. during SSR or in development).
 */

type GtagEventParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set",
      targetOrEventName: string,
      params?: GtagEventParams,
    ) => void
  }
}

export function trackEvent(eventName: string, params?: GtagEventParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", eventName, params)
}
