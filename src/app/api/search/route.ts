// app/api/search/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q) return NextResponse.json([])

  const results = await Promise.all([
    payload.find({ collection: 'articles', where: { title: { contains: q } }, limit: 5 }),
    payload.find({ collection: 'profiles', where: { displayName: { contains: q } }, limit: 5 }),
    payload.find({ collection: 'events', where: { title: { contains: q } }, limit: 5 }),
    payload.find({ collection: 'tracks', where: { title: { contains: q } }, limit: 5 }),
    payload.find({ collection: 'vod', where: { title: { contains: q } }, limit: 5 }),
  ])

  return NextResponse.json({
    query: q,
    articles: results[0].docs,
    profiles: results[1].docs,
    events: results[2].docs,
    music: results[3].docs,
    vod: results[4].docs,
  })
}
