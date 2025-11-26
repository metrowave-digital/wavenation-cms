import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug

  const track = await payload.find({
    collection: 'tracks',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 2,
  })

  if (track.docs.length) return NextResponse.json(track.docs[0])

  const album = await payload.find({
    collection: 'albums',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 2,
  })

  if (album.docs.length) return NextResponse.json(album.docs[0])

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
