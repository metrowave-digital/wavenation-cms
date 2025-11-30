import type { Endpoint, PayloadRequest } from 'payload'

type PollVoteBody = {
  pollId?: number | string
  optionId?: number | string
}

export const pollsRoute: Endpoint = {
  path: '/polls',
  method: 'post',

  handler: async (...args: any[]): Promise<any> => {
    // ============================================================
    // Payload v3 passes: (req, res, next, context)
    // But we cannot annotate types or TS rejects it.
    // ============================================================
    const req = args[0] as PayloadRequest
    const res = args[1] as any

    const payload = req.payload

    const { action } = (req.query || {}) as { action?: string }

    const body = (req.body || {}) as PollVoteBody
    const pollId = body.pollId ? Number(body.pollId) : undefined
    const optionId = body.optionId ? Number(body.optionId) : undefined

    // Fetch-API-style headers guaranteed safe
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    /* ---------------------------------------------------------
       1️⃣ CHECK IP
    --------------------------------------------------------- */
    if (action === 'check-ip') {
      if (!pollId) {
        return res.status(400).json({ error: 'pollId is required' })
      }

      const existed = await payload.find({
        collection: 'poll-ip-logs',
        limit: 1,
        where: {
          pollId: { equals: pollId },
          ip: { equals: String(ip) },
        },
      })

      return res.json({ alreadyVoted: existed.totalDocs > 0 })
    }

    /* ---------------------------------------------------------
       2️⃣ VOTE
    --------------------------------------------------------- */
    if (action === 'vote') {
      if (!pollId || !optionId) {
        return res.status(400).json({ error: 'pollId and optionId are required' })
      }

      const poll: any = await payload.findByID({
        collection: 'polls',
        id: pollId,
      })

      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' })
      }

      if (poll.status !== 'active') {
        return res.status(400).json({ error: 'Poll is not active' })
      }

      if (poll.requireAuth && !req.user) {
        return res.status(403).json({ error: 'Login required' })
      }

      if (!poll.allowMultipleVotes) {
        const existed = await payload.find({
          collection: 'poll-ip-logs',
          limit: 1,
          where: {
            pollId: { equals: pollId },
            ip: { equals: String(ip) },
          },
        })

        if (existed.totalDocs > 0) {
          return res.status(403).json({ error: 'Already voted' })
        }
      }

      const updatedOptions = poll.options.map((opt: any) =>
        Number(opt.value) === optionId ? { ...opt, voteCount: (opt.voteCount || 0) + 1 } : opt,
      )

      const updatedPoll = await payload.update({
        collection: 'polls',
        id: pollId,
        data: {
          options: updatedOptions,
          totalVotes: (poll.totalVotes || 0) + 1,
        },
      })

      const votedOption = updatedOptions.find((opt: any) => Number(opt.value) === optionId)

      let targetContentId: string | null = null
      let targetContentType: string | null = null

      if (poll.scope === 'content') {
        targetContentType = poll.targetContentType || null

        const rel = poll.targetContent
        if (typeof rel === 'string' || typeof rel === 'number') {
          targetContentId = String(rel)
        } else if (rel && typeof rel === 'object' && 'value' in rel) {
          targetContentId = String(rel.value)
        }
      }

      await payload.create({
        collection: 'poll-votes',
        data: {
          poll: pollId,
          optionValue: optionId,
          optionLabel: votedOption?.label || '',
          ip: String(ip),
          user: req.user?.id || null,
          userAgent: req.headers.get('user-agent') || null,
          targetContentType,
          targetContentId,
        },
      })

      await payload.create({
        collection: 'poll-ip-logs',
        data: {
          pollId,
          ip: String(ip),
        },
      })

      return res.json(updatedPoll)
    }

    /* ---------------------------------------------------------
       DEFAULT
    --------------------------------------------------------- */
    return res.status(400).json({
      error: 'Invalid action. Use ?action=vote or ?action=check-ip',
    })
  },
}

export default pollsRoute
