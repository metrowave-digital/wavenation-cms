import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: NextRequest, { params }: any) {
  const pollId = Number(params.id)
  const payload = await getPayload({ config })

  try {
    const body = await req.json()
    const { optionValue, optionLabel, userId } = body

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0'

    // Load poll
    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    // Prevent duplicate votes
    if (!poll.allowMultipleVotes) {
      const existingVote = await payload.find({
        collection: 'poll-votes',
        where: {
          and: [{ poll: { equals: pollId } }, { ip: { equals: ip } }],
        },
        limit: 1,
      })

      if (existingVote.docs.length > 0) {
        return NextResponse.json({ error: 'You have already voted' }, { status: 400 })
      }
    }

    // Create vote
    await payload.create({
      collection: 'poll-votes',
      data: {
        poll: pollId,
        optionValue,
        optionLabel,
        user: userId ?? null,
        ip,
      },
    })

    // Update vote counts
    const updatedOptions = poll.options.map((opt: any) =>
      opt.value === String(optionValue) ? { ...opt, voteCount: (opt.voteCount || 0) + 1 } : opt,
    )

    const updatedTotal = updatedOptions.reduce((sum: number, o: any) => sum + (o.voteCount || 0), 0)

    const updatedPoll = await payload.update({
      collection: 'polls',
      id: pollId,
      data: {
        options: updatedOptions,
        totalVotes: updatedTotal,
      },
    })

    return NextResponse.json({
      success: true,
      options: updatedPoll.options,
      totalVotes: updatedPoll.totalVotes,
    })
  } catch (err) {
    console.error('Poll Vote Error:', err)
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
  }
}
