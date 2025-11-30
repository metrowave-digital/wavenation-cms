import { NextResponse, NextRequest } from 'next/server'
import payload from 'payload'

export async function GET(req: NextRequest) {
  try {
    const now = new Date()

    const results = await payload.find({
      collection: 'polls',
      limit: 1,
      sort: '-createdAt',
      where: {
        and: [
          // Must be active
          { status: { equals: 'active' } },

          // Start date condition
          {
            or: [{ startAt: { less_than_equal: now } }, { startAt: { equals: null } }],
          },

          // End date condition
          {
            or: [{ endAt: { greater_than_equal: now } }, { endAt: { equals: null } }],
          },
        ],
      },
    })

    const activePoll = results.docs?.[0] || null

    return NextResponse.json({
      poll: activePoll,
      found: Boolean(activePoll),
    })
  } catch (err) {
    console.error('Active Poll Error:', err)
    return NextResponse.json({ error: 'Failed to load active poll' }, { status: 500 })
  }
}
