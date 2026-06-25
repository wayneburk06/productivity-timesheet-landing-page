import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

// Single shared pg Pool for the whole app.
const globalForDb = globalThis as unknown as { pool?: Pool }

export const pool =
  globalForDb.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL })

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool

// Records one row per Download button click.
export const downloadEvents = pgTable("download_events", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  platform: text("platform").notNull().default("windows"),
  version: text("version"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
})

// Records one row per page view (visitor analytics).
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  path: text("path").notNull().default("/"),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  ipHash: text("ip_hash"),
})

export const db = drizzle(pool, {
  schema: { downloadEvents, pageViews },
})
