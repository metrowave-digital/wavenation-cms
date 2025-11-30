import { NextRequest, NextResponse } from 'next/server'
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
          // Must be "active"
          { status: { equals: 'active' } },

          // Poll has already started OR has no start time
          {
            or: [{ startAt: { less_than_equal: now } }, { startAt: { equals: null } }],
          },

          // Poll hasn't ended OR has no end time
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
  } catch (error) {
    console.error('Active Poll Error:', error)
    return NextResponse.json({ error: 'Failed to load active poll' }, { status: 500 })
  }
}
