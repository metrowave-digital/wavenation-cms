import payload from 'payload'
import { NextResponse } from 'next/server'

// Unified editorial feed (homepage)
export async function GET() {
  const articles = await payload.find({
    collection: 'articles',
    limit: 25,
    sort: '-publishedAt',
    where: {
      editorialStatus: { equals: 'published' },
    },
    depth: 2,
  })

  return NextResponse.json(articles)
}
