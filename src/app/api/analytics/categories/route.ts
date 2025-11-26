import payload from 'payload'
import { NextResponse } from 'next/server'

type CategoryStats = {
  category: string
  plays: number
  views: number
  likes: number
  trendScore: number
}

export async function GET() {
  try {
    const { docs } = await payload.find({
      collection: 'analytics',
      limit: 500,
    })

    const totals: Record<string, CategoryStats> = {}

    for (const a of docs as any[]) {
      for (const row of a.categoryRollup || []) {
        if (!totals[row.category]) {
          totals[row.category] = {
            category: row.category,
            plays: 0,
            views: 0,
            likes: 0,
            trendScore: 0,
          }
        }

        totals[row.category].plays += row.plays ?? 0
        totals[row.category].views += row.views ?? 0
        totals[row.category].likes += row.likes ?? 0
        totals[row.category].trendScore += row.trendScore ?? 0
      }
    }

    return NextResponse.json({
      categories: Object.values(totals).sort((a, b) => b.trendScore - a.trendScore),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
