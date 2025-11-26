// app/api/events/calendar/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const events = await payload.find({
    collection: 'events',
    sort: 'startDate',
    limit: 500,
  })

  return NextResponse.json(
    events.docs.map((e: any) => ({
      title: e.title,
      start: e.startDate,
      end: e.endDate,
      location: e.location,
      type: e.type,
      slug: e.slug,
    })),
  )
}
