import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const latest = await payload.find({
    collection: 'articles',
    limit: 20,
    sort: ['-isBreaking', '-isPinned', '-publishedAt'],
    where: {
      editorialStatus: { equals: 'published' },
    },
    depth: 1,
  })

  return NextResponse.json(latest)
}
