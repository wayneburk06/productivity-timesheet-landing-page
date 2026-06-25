import { createHash } from "crypto"
import { type NextRequest, NextResponse } from "next/server"
import { db, downloadEvents } from "@/lib/db"

// Privacy-first: we never store raw IPs, only a salted one-way hash
// used to roughly de-duplicate. No personal data leaves this server.
function hashIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for") ?? ""
  const ip = fwd.split(",")[0]?.trim() || "unknown"
  const salt = process.env.BETTER_AUTH_SECRET ?? "productivity-timesheet"
  return createHash("sha256").update(ip + salt).digest("hex").slice(0, 32)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    await db.insert(downloadEvents).values({
      platform: "windows",
      version: typeof body?.version === "string" ? body.version : null,
      referrer: req.headers.get("referer"),
      userAgent: req.headers.get("user-agent"),
      ipHash: hashIp(req),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.log("[v0] download track error:", (error as Error).message)
    // Never block the download because tracking failed.
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
