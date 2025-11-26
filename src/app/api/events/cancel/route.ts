// app/api/events/register/cancel/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { eventId, userId } = await req.json()

  if (!eventId || !userId) {
    return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 })
  }

  const registrations = await payload.find({
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

  if (registrations.totalDocs === 0) {
    return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
  }

  const reg = registrations.docs[0]

  const updated = await payload.update({
    collection: 'event-registrations',
    id: reg.id,
    data: {
      status: 'canceled',
    },
  })

  return NextResponse.json(updated)
}
