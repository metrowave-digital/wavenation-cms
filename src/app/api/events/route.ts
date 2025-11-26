// app/api/events/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const type = searchParams.get('type') // 'events' | 'live-events' | 'all'
  const limit = Number(searchParams.get('limit') || 20)
  const upcomingOnly = searchParams.get('upcoming') === 'true'

  const collections: Array<'events' | 'live-events'> =
    type === 'events'
      ? ['events']
      : type === 'live-events'
        ? ['live-events']
        : ['events', 'live-events']

  const now = new Date().toISOString()

  const results = await Promise.all(
    collections.map((collection) =>
      payload.find({
        collection,
        limit,
        sort: 'eventDate' in ({} as any) ? 'eventDate' : 'startDate',
        where: upcomingOnly
          ? {
              or: [
                { eventDate: { greater_than_equal: now } },
                { startDate: { greater_than_equal: now } },
              ],
            }
          : {},
      }),
    ),
  )

  const merged = results.flatMap((r, idx) =>
    r.docs.map((doc) => ({
      ...doc,
      _collection: collections[idx],
    })),
  )

  return NextResponse.json({ results: merged })
}
