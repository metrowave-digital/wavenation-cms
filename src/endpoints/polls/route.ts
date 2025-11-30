import { NextResponse } from 'next/server'
import payload from 'payload'

/**
 * GET /api/polls
 * Supports:
 *  - ?limit=10
 *  - ?page=2
 *  - ?sort=-createdAt
 *  - ?status=active
 *  - ?scope=global
 *  - ?contentType=articles
 *  - ?contentId=<id>
 *  - ?activeOnly=true (auto filters by dates + status)
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const limit = Number(searchParams.get('limit')) || 10
    const page = Number(searchParams.get('page')) || 1
    const sort = searchParams.get('sort') || '-createdAt'

    const status = searchParams.get('status') // active, closed, draft
    const scope = searchParams.get('scope')
    const contentType = searchParams.get('contentType')
    const contentId = searchParams.get('contentId')
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const now = new Date()

    const where: any = {}

    /* ---------------------------------------------------------
     * Filter: status
     * --------------------------------------------------------- */
    if (status) {
      where.status = { equals: status }
    }

    /* ---------------------------------------------------------
     * Filter: scope (global, content, event, channel)
     * --------------------------------------------------------- */
    if (scope) {
      where.scope = { equals: scope }
    }

    /* ---------------------------------------------------------
     * Filter: target content (content-based polls)
     * --------------------------------------------------------- */
    if (contentType) {
      where.targetContentType = { equals: contentType }
    }

    if (contentId) {
      where.targetContent = { equals: contentId }
    }

    /* ---------------------------------------------------------
     * Filter: active-only mode
     * ---------------------------------------------------------
     * - status = active
     * - startAt <= now
     * - endAt >= now (or null)
     * --------------------------------------------------------- */
    if (activeOnly) {
      where.and = [
        { status: { equals: 'active' } },
        {
          or: [{ startAt: { less_than_equal: now } }, { startAt: { equals: null } }],
        },
        {
          or: [{ endAt: { greater_than_equal: now } }, { endAt: { equals: null } }],
        },
      ]
    }

    /* ---------------------------------------------------------
     * Execute Payload Query
     * --------------------------------------------------------- */
    const polls = await payload.find({
      collection: 'polls',
      limit,
      page,
      sort,
      where,
    })

    return NextResponse.json(polls)
  } catch (err) {
    console.error('Polls GET error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch polls', details: String(err) },
      { status: 500 },
    )
  }
}
