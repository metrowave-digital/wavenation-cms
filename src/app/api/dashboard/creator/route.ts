// app/api/dashboard/creator/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Extract actual cookie from next/edge request
  const cookieHeader = req.headers.get('cookie') ?? ''
  const token = cookieHeader.match(/payload-token=([^;]+)/)?.[1] ?? null

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Build a minimally valid PayloadRequest object
  const payloadReq = {
    headers: {
      cookie: `payload-token=${token}`,
    },
    payloadAPI: 'local',
  } as any // <-- SAFE: this is the official workaround

  const { user } = await payload.auth({
    req: payloadReq,
    headers: payloadReq.headers,
  })

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const content = await payload.find({
    collection: 'articles',
    where: { 'author.id': { equals: user.id } },
  })

  const shows = await payload.find({
    collection: 'shows',
    where: { 'hosts.id': { equals: user.id } },
  })

  return NextResponse.json({
    user,
    totalPosts: content.totalDocs,
    totalShows: shows.totalDocs,
  })
}
