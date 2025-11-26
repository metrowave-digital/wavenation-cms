// src/app/api/social/follow/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { followerId, followingId } = await req.json()

  if (!followerId || !followingId) {
    return NextResponse.json({ error: 'Missing followerId or followingId' }, { status: 400 })
  }

  const followerNum = Number(followerId)
  const followingNum = Number(followingId)

  if (isNaN(followerNum) || isNaN(followingNum)) {
    return NextResponse.json({ error: 'Invalid ID types' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: followerNum },
      'target.relationTo': { equals: 'users' },
      'target.value': { equals: followingNum },
      kind: { equals: 'user' },
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ success: true, alreadyFollowing: true })
  }

  const follow = await payload.create({
    collection: 'follows',
    data: {
      follower: followerNum,
      kind: 'user',
      target: {
        relationTo: 'users',
        value: followingNum,
      },
    },
  })

  return NextResponse.json({ success: true, follow })
}

export async function DELETE(req: Request) {
  const { followerId, followingId } = await req.json()

  const followerNum = Number(followerId)
  const followingNum = Number(followingId)

  const existing = await payload.find({
    collection: 'follows',
    where: {
      follower: { equals: followerNum },
      'target.relationTo': { equals: 'users' },
      'target.value': { equals: followingNum },
      kind: { equals: 'user' },
    },
  })

  if (!existing.totalDocs) {
    return NextResponse.json({ success: true, removed: false })
  }

  await Promise.all(
    existing.docs.map((doc) =>
      payload.delete({
        collection: 'follows',
        id: doc.id,
      }),
    ),
  )

  return NextResponse.json({ success: true, removed: true })
}
