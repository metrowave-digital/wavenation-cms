// src/app/api/social/feed/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  // Get following list
  const follows = await payload.find({
    collection: 'follows',
    where: { follower: { equals: userId } },
    limit: 500,
  })

  const followingIds = follows.docs.map((f: any) => f.following).filter(Boolean)

  const posts = await payload.find({
    collection: 'posts',
    where: {
      author: { in: followingIds },
      status: { equals: 'published' },
    },
    sort: '-createdAt',
    limit: 50,
  })

  return NextResponse.json(posts)
}
