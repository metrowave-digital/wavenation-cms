// app/api/events/featured/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [events, liveEvents] = await Promise.all([
    payload.find({
      collection: 'events',
      limit: 20,
      sort: '-featuredPriority',
      where: {
        or: [{ staffPick: { equals: true } }, { featuredPriority: { greater_than: 0 } }],
      },
    }),
    payload.find({
      collection: 'live-events',
      limit: 20,
      sort: '-createdAt',
      where: {
        featured: { equals: true },
      },
    }),
  ])

  return NextResponse.json({
    events: events.docs,
    liveEvents: liveEvents.docs,
  })
}
