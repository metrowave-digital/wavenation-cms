import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const articles = await payload.find({
    collection: 'articles',
    limit: 20,
    sort: ['-algorithm.featuredPriority', '-viewCount', '-shareCount', '-publishedAt'],
    where: {
      editorialStatus: { equals: 'published' },
    },
    depth: 1,
  })

  return NextResponse.json(articles)
}
