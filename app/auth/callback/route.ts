import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

/**
 * Official Supabase auth callback for the Next.js App Router.
 *
 * Handles the link from the Supabase invite / password-recovery email. It
 * supports both delivery styles so it works regardless of the email template:
 *   - token_hash + type  -> verifyOtp   (default invite/recovery emails)
 *   - code               -> exchangeCodeForSession (PKCE)
 *
 * On success the user's session is written to cookies and they are redirected
 * to the set-password page. On failure they land on set-password with an error.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")
  // Where to send the user after a successful verification.
  const next = searchParams.get("next") ?? "/set-password"

  const supabase = await createClient()

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.log("[v0] auth/callback: verifyOtp failed:", error.message)
    return NextResponse.redirect(`${origin}/set-password?error=${encodeURIComponent(error.message)}`)
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.log("[v0] auth/callback: exchangeCodeForSession failed:", error.message)
    return NextResponse.redirect(`${origin}/set-password?error=${encodeURIComponent(error.message)}`)
  }

  // Neither parameter present -> invalid or already-consumed link.
  return NextResponse.redirect(
    `${origin}/set-password?error=${encodeURIComponent("Invalid or expired activation link.")}`,
  )
}
