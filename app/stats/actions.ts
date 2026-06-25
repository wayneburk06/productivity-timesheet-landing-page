"use server"

import { createHash } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const COOKIE_NAME = "pt_stats_auth"

function expectedToken() {
  const password = process.env.STATS_PASSWORD ?? ""
  const salt = process.env.BETTER_AUTH_SECRET ?? "productivity-timesheet"
  return createHash("sha256").update(password + salt).digest("hex")
}

export async function isStatsAuthed() {
  // If no password is configured, the dashboard stays locked and tells the
  // owner to set STATS_PASSWORD.
  if (!process.env.STATS_PASSWORD) return false
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value === expectedToken()
}

export async function statsPasswordConfigured() {
  return Boolean(process.env.STATS_PASSWORD)
}

export async function login(_prev: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "")
  if (!process.env.STATS_PASSWORD) {
    return { error: "No password is configured. Set the STATS_PASSWORD environment variable." }
  }
  if (password !== process.env.STATS_PASSWORD) {
    return { error: "Incorrect password. Please try again." }
  }
  const store = await cookies()
  store.set(COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })
  redirect("/stats")
}

export async function logout() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
  redirect("/stats")
}
