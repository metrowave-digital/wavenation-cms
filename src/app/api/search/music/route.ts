// app/api/search/music/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  const songs = await payload.find({
    collection: 'tracks',
    where: { title: { contains: q } },
  })
  return NextResponse.json(songs.docs)
}
