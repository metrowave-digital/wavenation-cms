// app/api/feed/live/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import type { CollectionSlug } from 'payload'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit') || 20)

  const now = new Date().toISOString()

  const [liveEvents, liveChannels] = await Promise.all([
    payload.find({
      collection: 'live-events' as CollectionSlug,
      where: {
        and: [
          { startTime: { less_than_equal: now } },
          { endTime: { greater_than_equal: now } },
          { status: { equals: 'live' } },
        ],
      },
      sort: '-startTime',
      depth: 2,
      limit,
    }),

    payload.find({
      collection: 'channels' as CollectionSlug,
      where: {
        isLive: { equals: true },
      },
      sort: '-updatedAt',
      depth: 2,
      limit,
    }),
  ])

  const events = (liveEvents.docs as any[]).map((doc) => ({
    id: doc.id,
    type: 'live-event',
    createdAt: doc.createdAt,
    data: doc,
  }))

  const channels = (liveChannels.docs as any[]).map((doc) => ({
    id: doc.id,
    type: 'channel',
    createdAt: doc.updatedAt || doc.createdAt,
    data: doc,
  }))

  return NextResponse.json({
    liveEvents: events,
    liveChannels: channels,
    total: events.length + channels.length,
  })
}
