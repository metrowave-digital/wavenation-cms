// app/api/events/register/check/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get('eventId')
  const userId = searchParams.get('userId')

  if (!eventId || !userId) {
    return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 })
  }

  const result = await payload.find({
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

  return NextResponse.json({
    registered: result.totalDocs > 0,
    registration: result.docs[0] || null,
  })
}
