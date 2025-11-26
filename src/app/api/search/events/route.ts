// app/api/search/events/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  const events = await payload.find({
    collection: 'events',
    where: { title: { contains: q } },
  })
  return NextResponse.json(events.docs)
}
