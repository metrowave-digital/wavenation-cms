// app/api/podcasts/[id]/is-following/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ follows: false })

  const podcastId = params.id

  const follow = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: { equals: podcastId },
      kind: { equals: 'podcast' },
    },
    limit: 1,
  })

  return NextResponse.json({ follows: follow.totalDocs > 0 })
}
