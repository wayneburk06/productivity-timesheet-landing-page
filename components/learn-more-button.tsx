"use client"

import { ArrowRight } from "lucide-react"
import { ctaBaseClasses } from "@/components/download-button"
import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

export function LearnMoreButton() {
  return (
    <a
      href="#features"
      onClick={() => trackEvent("learn_more_clicked")}
      className={cn(
        ctaBaseClasses,
        // Secondary: white background, black border + text, subtle hover.
        "border border-foreground bg-background text-foreground hover:bg-secondary",
      )}
    >
      Learn More
      <ArrowRight aria-hidden="true" />
    </a>
  )
}
