// app/api/channels/[id]/follow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const channelId = params.id
  const channelIdNum = Number(channelId)

  // --------------------------------------------
  // 1. Already following?
  // --------------------------------------------
  const existing = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      target: {
        equals: {
          relationTo: 'creator-channels',
          value: channelIdNum,
        },
      },
      kind: { equals: 'channel' },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ success: true, alreadyFollowing: true })
  }

  // --------------------------------------------
  // 2. Create follow
  // --------------------------------------------
  const follow = await payload.create({
    collection: 'follows',
    data: {
      follower: user.id,
      target: {
        relationTo: 'creator-channels',
        value: channelIdNum,
      },
      kind: 'channel',
    },
  })

  // --------------------------------------------
  // 3. Load channel for metrics + owner notif
  // --------------------------------------------
  const channel = await payload.findByID({
    collection: 'creator-channels',
    id: channelIdNum,
  })

  const followerCount = channel?.metrics?.followers ?? 0

  await payload.update({
    collection: 'creator-channels',
    id: channelIdNum,
    data: {
      metrics: {
        ...channel.metrics,
        followers: followerCount + 1,
      },
    },
  })

  // --------------------------------------------
  // 4. Notify channel owner
  // --------------------------------------------
  const ownerId = typeof channel.owner === 'object' ? (channel.owner as any)?.id : channel.owner

  if (ownerId) {
    await payload.create({
      collection: 'notifications',
      data: {
        user: ownerId,
        actor: user.id,
        type: 'follow',
        target: {
          relationTo: 'creator-channels',
          value: channelIdNum,
        },
      },
    })
  }

  return NextResponse.json({ success: true, follow })
}
