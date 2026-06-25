import { createHash } from "crypto"
import { type NextRequest, NextResponse } from "next/server"
import { db, pageViews } from "@/lib/db"

function hashIp(req: NextRequest) {
  const fwd = req.headers.get("x-forwarded-for") ?? ""
  const ip = fwd.split(",")[0]?.trim() || "unknown"
  const salt = process.env.BETTER_AUTH_SECRET ?? "productivity-timesheet"
  return createHash("sha256").update(ip + salt).digest("hex").slice(0, 32)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    await db.insert(pageViews).values({
      path: typeof body?.path === "string" ? body.path : "/",
      referrer: req.headers.get("referer"),
      userAgent: req.headers.get("user-agent"),
      ipHash: hashIp(req),
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.log("[v0] view track error:", (error as Error).message)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
