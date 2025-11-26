// app/api/channels/[id]/followers/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const channelId = params.id

  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 20)

  const follows = await payload.find({
    collection: 'follows',
    where: {
      channel: { equals: channelId },
    },
    page,
    limit,
    depth: 2, // resolve follower user documents
  })

  const followers = follows.docs.map((f: any) => f.follower)

  return NextResponse.json({
    followers,
    page: follows.page,
    totalPages: follows.totalPages,
    totalFollowers: follows.totalDocs,
  })
}
