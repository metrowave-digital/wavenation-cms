import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pollId = Number(params.id)
    const body = await req.json()

    const { optionValue, optionLabel, userId } = body

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '0.0.0.0'

    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
    })

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

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

    const updatedOptions = poll.options.map((opt: any) =>
      opt.value === String(optionValue) ? { ...opt, voteCount: (opt.voteCount || 0) + 1 } : opt,
    )

    const updatedTotal = updatedOptions.reduce((acc: number, o: any) => acc + (o.voteCount || 0), 0)

    const updatedPoll = await payload.update({
      collection: 'polls',
      id: pollId,
      data: {
        options: updatedOptions,
        totalVotes: updatedTotal,
      },
    })

    return NextResponse.json({
      options: updatedPoll.options,
      totalVotes: updatedPoll.totalVotes,
    })
  } catch (err) {
    console.error('Poll Vote Error:', err)
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
  }
}
