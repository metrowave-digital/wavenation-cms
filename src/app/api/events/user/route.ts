// app/api/events/user/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const registrations = await payload.find({
    collection: 'event-registrations',
    limit: 100,
    where: {
      user: { equals: userId },
      status: { equals: 'registered' },
    },
  })

  return NextResponse.json({
    registrations: registrations.docs,
  })
}
