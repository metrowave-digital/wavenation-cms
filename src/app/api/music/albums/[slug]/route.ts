import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params

  const result = await payload.find({
    collection: 'albums',
    limit: 1,
    where: { slug: { equals: slug } },
    depth: 2, // pulls tracks + artist + media
  })

  if (!result.docs.length) {
    return NextResponse.json({ error: 'Album not found' }, { status: 404 })
  }

  return NextResponse.json(result.docs[0])
}
