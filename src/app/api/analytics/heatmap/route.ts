import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const contentType = url.searchParams.get('contentType') // optional

    const where: any = {}
    if (contentType) {
      where['relatedContent.relationTo'] = { equals: contentType }
    }

    const result = await payload.find({
      collection: 'analytics',
      where,
      limit: 1000,
    })

    const hourly = Array(24).fill(0)
    const dow = Array(7).fill(0)

    for (const doc of result.docs as any[]) {
      for (const h of doc.hourlyDistribution || []) {
        if (typeof h.hour === 'number' && h.hour >= 0 && h.hour < 24) {
          hourly[h.hour] += h.count || 0
        }
      }
      for (const d of doc.dowDistribution || []) {
        if (typeof d.day === 'number' && d.day >= 0 && d.day < 7) {
          dow[d.day] += d.count || 0
        }
      }
    }

    return NextResponse.json({
      contentType: contentType || 'all',
      hourly: hourly.map((count, hour) => ({ hour, count })),
      dow: dow.map((count, day) => ({ day, count })),
    })
  } catch (err) {
    console.error('Heatmap analytics error:', err)
    return NextResponse.json({ error: 'heatmap-failed' }, { status: 500 })
  }
}
