"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export function LearnMoreButton() {
  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="h-11 gap-2 rounded-lg border-foreground/20 bg-background px-6 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-secondary"
    >
      <a href="#features" onClick={() => trackEvent("learn_more_clicked")}>
        Learn More
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </Button>
  )
}
