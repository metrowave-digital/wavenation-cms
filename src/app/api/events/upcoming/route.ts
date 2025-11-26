// app/api/events/upcoming/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date().toISOString()

  const [events, liveEvents] = await Promise.all([
    payload.find({
      collection: 'events',
      limit: 50,
      sort: 'eventDate',
      where: { eventDate: { greater_than_equal: now } },
    }),
    payload.find({
      collection: 'live-events',
      limit: 50,
      sort: 'startDate',
      where: { startDate: { greater_than_equal: now } },
    }),
  ])

  return NextResponse.json({
    events: events.docs,
    liveEvents: liveEvents.docs,
  })
}
