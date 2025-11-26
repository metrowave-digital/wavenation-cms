// app/api/channels/[id]/unfollow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const channelId = params.id

  const exists = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: { equals: channelId },
      kind: { equals: 'channel' },
    },
    limit: 1,
  })

  if (exists.totalDocs === 0) return NextResponse.json({ success: true, alreadyUnfollowed: true })

  const followId = exists.docs[0].id

  await payload.delete({
    collection: 'follows',
    id: followId,
  })

  const channel = await payload.findByID({
    collection: 'creator-channels',
    id: channelId,
  })

  const count = channel?.metrics?.followers ?? 0
  const newCount = Math.max(0, count - 1)

  await payload.update({
    collection: 'creator-channels',
    id: channelId,
    data: {
      metrics: { ...channel.metrics, followers: newCount },
    },
  })

  return NextResponse.json({ success: true })
}
