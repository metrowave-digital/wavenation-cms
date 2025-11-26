// app/api/podcasts/[id]/followers/grid/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const podcastId = params.id
  const url = new URL(req.url)

  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 24)

  const follows = await payload.find({
    collection: 'follows',
    where: {
      target: { equals: podcastId },
      kind: { equals: 'podcast' },
    },
    depth: 2,
    page,
    limit,
  })

  const followers = follows.docs.map((f) => f.follower)

  return NextResponse.json({
    followers,
    page: follows.page,
    totalPages: follows.totalPages,
    totalFollowers: follows.totalDocs,
  })
}
