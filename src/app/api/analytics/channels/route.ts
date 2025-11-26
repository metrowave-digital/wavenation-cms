import payload from 'payload'
import { NextResponse } from 'next/server'

type ChannelTotals = {
  channel: string
  plays: number
  views: number
  likes: number
  engagementScore: number
  trendScore: number
}

export async function GET() {
  try {
    const { docs } = await payload.find({
      collection: 'analytics',
      limit: 500,
    })

    const totals: Record<string, ChannelTotals> = {}

    for (const a of docs as any[]) {
      for (const row of a.channelRollup || []) {
        const channel = row.channel

        if (!totals[channel]) {
          totals[channel] = {
            channel,
            plays: 0,
            views: 0,
            likes: 0,
            engagementScore: 0,
            trendScore: 0,
          }
        }

        totals[channel].plays += row.plays ?? 0
        totals[channel].views += row.views ?? 0
        totals[channel].likes += row.likes ?? 0
        totals[channel].engagementScore += row.engagementScore ?? 0

        // sum the trendScore of the parent analytics doc
        totals[channel].trendScore += a.trendScore ?? 0
      }
    }

    return NextResponse.json({
      channels: Object.values(totals).sort((a, b) => b.trendScore - a.trendScore),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
