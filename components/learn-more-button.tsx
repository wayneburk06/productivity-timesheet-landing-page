"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics"

export function LearnMoreButton() {
  return (
    <Button asChild size="lg" variant="outline" className="gap-2">
      <a href="#features" onClick={() => trackEvent("learn_more_clicked")}>
        Learn More
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </Button>
  )
}
