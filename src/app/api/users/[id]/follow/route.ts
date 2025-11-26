// app/api/users/[id]/follow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const targetUserId = params.id

  if (targetUserId === String(user.id)) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
  }

  // Check existing follow
  const existing = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: user.id },
      kind: { equals: 'user' },
      target: { equals: targetUserId },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ success: true, alreadyFollowing: true })
  }

  // Create follow — target must be relationship object
  const follow = await payload.create({
    collection: 'follows',
    data: {
      follower: user.id,
      kind: 'user',
      target: {
        relationTo: 'users',
        value: Number(targetUserId),
      },
    },
  })

  // Create notification — ONLY target is a union field
  await payload.create({
    collection: 'notifications',
    data: {
      user: Number(targetUserId), // simple relationship
      actor: Number(user.id), // simple relationship
      type: 'follow',

      target: {
        relationTo: 'users',
        value: Number(targetUserId),
      },
    },
  })

  return NextResponse.json({ success: true, follow })
}
