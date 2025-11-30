import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(req: NextRequest, { params }: any) {
  const payload = await getPayload({ config })
  const pollId = Number(params.id)

  try {
    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    const now = new Date()
    const pollEnded = poll.endAt ? new Date(poll.endAt) < now : false

    const showResults: 'always' | 'after-vote' | 'after-end' | 'admin-only' =
      poll.showResults ?? 'always'

    // Admin override
    const isAdmin = req.headers.get('x-user-role') === 'admin'

    /* --------------------------------------------------------
     * RESULT VISIBILITY LOGIC
     * -------------------------------------------------------- */

    if (!isAdmin) {
      // AFTER POLL ENDS
      if (showResults === 'after-end' && !pollEnded) {
        return NextResponse.json(
          { error: 'Results will be shown after the poll ends.' },
          { status: 403 },
        )
      }

      // AFTER USER VOTES
      if (showResults === 'after-vote') {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0'

        const userId = req.headers.get('x-user-id')

        const hasVoted = await payload.find({
          collection: 'poll-votes',
          where: {
            and: [
              { poll: { equals: pollId } },
              {
                or: [{ ip: { equals: ip } }, { user: { equals: userId ?? '' } }],
              },
            ],
          },
          limit: 1,
        })

        if (hasVoted.docs.length === 0) {
          return NextResponse.json(
            { error: 'Results are shown only after you vote.' },
            { status: 403 },
          )
        }
      }

      // ADMIN-ONLY
      if (showResults === 'admin-only') {
        return NextResponse.json(
          { error: 'Results are visible to administrators only.' },
          { status: 403 },
        )
      }
    }

    /* --------------------------------------------------------
     * BUILD RESULTS
     * -------------------------------------------------------- */

    const totalVotes = poll.totalVotes ?? 0

    const results = poll.options.map((opt: any) => {
      const votes = opt.voteCount ?? 0

      return {
        label: opt.label,
        value: opt.value,
        votes,
        percentage: totalVotes > 0 ? Number((votes / totalVotes) * 100).toFixed(1) : '0.0',
      }
    })

    return NextResponse.json({
      pollId,
      question: poll.question,
      totalVotes,
      results,
    })
  } catch (err) {
    console.error('Poll Results Error:', err)
    return NextResponse.json({ error: 'Failed to fetch poll results' }, { status: 500 })
  }
}
