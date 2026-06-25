import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

export type DailyPoint = { date: string; views: number; downloads: number }

export type StatsSummary = {
  totalViews: number
  totalDownloads: number
  uniqueVisitors: number
  conversionRate: number
  viewsLast7: number
  downloadsLast7: number
  daily: DailyPoint[]
}

export async function getStats(): Promise<StatsSummary> {
  const [views] = (await db.execute(
    sql`select count(*)::int as count, count(distinct ip_hash)::int as unique from page_views`,
  )).rows as { count: number; unique: number }[]

  const [downloads] = (await db.execute(
    sql`select count(*)::int as count from download_events`,
  )).rows as { count: number }[]

  const [recent] = (await db.execute(
    sql`select
          (select count(*)::int from page_views where created_at >= now() - interval '7 days') as views,
          (select count(*)::int from download_events where created_at >= now() - interval '7 days') as downloads`,
  )).rows as { views: number; downloads: number }[]

  const dailyRows = (await db.execute(
    sql`
      with days as (
        select generate_series(
          (current_date - interval '13 days')::date,
          current_date,
          interval '1 day'
        )::date as day
      ),
      v as (
        select created_at::date as day, count(*)::int as c
        from page_views
        where created_at >= current_date - interval '13 days'
        group by 1
      ),
      d as (
        select created_at::date as day, count(*)::int as c
        from download_events
        where created_at >= current_date - interval '13 days'
        group by 1
      )
      select
        to_char(days.day, 'YYYY-MM-DD') as date,
        coalesce(v.c, 0) as views,
        coalesce(d.c, 0) as downloads
      from days
      left join v on v.day = days.day
      left join d on d.day = days.day
      order by days.day asc
    `,
  )).rows as DailyPoint[]

  const totalViews = views?.count ?? 0
  const totalDownloads = downloads?.count ?? 0
  const conversionRate = totalViews > 0 ? (totalDownloads / totalViews) * 100 : 0

  return {
    totalViews,
    totalDownloads,
    uniqueVisitors: views?.unique ?? 0,
    conversionRate,
    viewsLast7: recent?.views ?? 0,
    downloadsLast7: recent?.downloads ?? 0,
    daily: dailyRows.map((r) => ({
      date: r.date,
      views: Number(r.views),
      downloads: Number(r.downloads),
    })),
  }
}
