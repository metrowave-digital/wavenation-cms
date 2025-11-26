// app/api/events/register/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { eventId, userId } = await req.json()

  if (!eventId || !userId) {
    return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 })
  }

  // Prevent duplicate registration
  const existing = await payload.find({
    collection: 'event-registrations',
    limit: 1,
    where: {
      and: [
        { event: { equals: eventId } },
        { user: { equals: userId } },
        { status: { equals: 'registered' } },
      ],
    },
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json(existing.docs[0])
  }

  const registration = await payload.create({
    collection: 'event-registrations',
    data: {
      event: eventId,
      user: userId,
      status: 'registered',
      source: 'web',
    },
  })

  return NextResponse.json(registration)
}
