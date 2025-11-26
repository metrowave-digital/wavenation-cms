// app/api/channels/[id]/is-following/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ follows: false })

  const channelId = params.id

  const follow = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: { equals: channelId },
      kind: { equals: 'channel' },
    },
    limit: 1,
  })

  return NextResponse.json({ follows: follow.totalDocs > 0 })
}
