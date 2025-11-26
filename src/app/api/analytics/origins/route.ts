import payload from 'payload'
import { NextResponse } from 'next/server'

type OriginTotals = {
  origin: string
  count: number
}

export async function GET() {
  try {
    const { docs } = await payload.find({
      collection: 'analytics',
      limit: 500,
    })

    const totals: Record<string, OriginTotals> = {}

    for (const a of docs as any[]) {
      for (const row of a.originRollup || []) {
        const origin = row.origin

        if (!totals[origin]) {
          totals[origin] = {
            origin,
            count: 0,
          }
        }

        totals[origin].count += row.count ?? 0
      }
    }

    return NextResponse.json({
      origins: Object.values(totals).sort((a, b) => b.count - a.count),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
