import type { Metadata } from "next"
import { Dashboard } from "@/components/stats/dashboard"
import { LoginForm } from "@/components/stats/login-form"
import { getStats } from "@/lib/stats"
import { isStatsAuthed, statsPasswordConfigured } from "./actions"

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function StatsPage() {
  const authed = await isStatsAuthed()

  if (!authed) {
    const configured = await statsPasswordConfigured()
    return <LoginForm configured={configured} />
  }

  const stats = await getStats()
  return <Dashboard stats={stats} />
}
