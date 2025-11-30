import { NextResponse } from 'next/server'
import payload from 'payload'
import crypto from 'crypto'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const pollId = Number(params.id)
  const { optionValue, optionLabel, userId, targetContentType, targetContentId } = await req.json()

  const ip = req.headers.get('X-Forwarded-For') || req.headers.get('x-real-ip') || '0.0.0.0'

  const userAgent = req.headers.get('user-agent') || ''
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex')

  try {
    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    /* ------------------------------------------------------------------
     * RULE 1 — STATUS MUST BE ACTIVE
     * ------------------------------------------------------------------ */
    if (poll.status !== 'active') {
      return NextResponse.json({ error: 'Poll is not active.' }, { status: 403 })
    }

    /* ------------------------------------------------------------------
     * RULE 2 — VOTING WINDOW (startAt / endAt)
     * ------------------------------------------------------------------ */
    const now = new Date()
    if (poll.startAt && new Date(poll.startAt) > now) {
      return NextResponse.json({ error: 'Poll has not opened yet.' }, { status: 403 })
    }

    if (poll.endAt && new Date(poll.endAt) < now) {
      return NextResponse.json({ error: 'Poll has ended.' }, { status: 403 })
    }

    /* ------------------------------------------------------------------
     * RULE 3 — REQUIRE AUTH (if enabled)
     * ------------------------------------------------------------------ */
    if (poll.requireAuth && !userId) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    }

    /* ------------------------------------------------------------------
     * RULE 4 — AUDIENCE ROLE RESTRICTIONS
     * ------------------------------------------------------------------ */
    if (Array.isArray(poll.audienceRoles) && poll.audienceRoles.length > 0) {
      if (!userId) {
        return NextResponse.json(
          { error: 'Authentication required for this poll.' },
          { status: 401 },
        )
      }

      const user = await payload.findByID({
        collection: 'users',
        id: userId,
      })

      const userRoles: string[] = user.roles || []

      const allowedRoles = poll.audienceRoles as string[]

      const isAllowed = userRoles.some((role) => allowedRoles.includes(role))

      if (!isAllowed) {
        return NextResponse.json(
          { error: 'You do not have permission to vote in this poll.' },
          { status: 403 },
        )
      }
    }

    /* ------------------------------------------------------------------
     * RULE 5 — MULTIPLE VOTE HANDLING
     * ------------------------------------------------------------------ */
    if (!poll.allowMultipleVotes) {
      const previousVotes = await payload.find({
        collection: 'poll-votes',
        where: {
          and: [
            { poll: { equals: pollId } },
            {
              or: [{ ip: { equals: ipHash } }, userId ? { user: { equals: userId } } : {}],
            },
          ],
        },
      })

      if (previousVotes.docs.length > 0) {
        return NextResponse.json({ error: 'You have already voted.' }, { status: 403 })
      }
    }

    /* ------------------------------------------------------------------
     * UPDATE POLL: increment vote count + totalVotes
     * ------------------------------------------------------------------ */
    const updatedOptions = poll.options.map((opt: any) =>
      Number(opt.value) === Number(optionValue)
        ? { ...opt, voteCount: (opt.voteCount || 0) + 1 }
        : opt,
    )

    const updatedPoll = await payload.update({
      collection: 'polls',
      id: pollId,
      data: {
        options: updatedOptions,
        totalVotes: (poll.totalVotes || 0) + 1,
      },
    })

    /* ------------------------------------------------------------------
     * SAVE INDIVIDUAL VOTE ENTRY
     * ------------------------------------------------------------------ */
    await payload.create({
      collection: 'poll-votes',
      data: {
        poll: pollId,
        optionValue: Number(optionValue),
        optionLabel,
        user: userId || null,
        ip: ipHash,
        userAgent,
        targetContentType: targetContentType || null,
        targetContentId: targetContentId || null,
      },
    })

    return NextResponse.json(updatedPoll)
  } catch (error) {
    console.error('Poll Vote Error:', error)
    return NextResponse.json({ error: 'Server error', details: String(error) }, { status: 500 })
  }
}
