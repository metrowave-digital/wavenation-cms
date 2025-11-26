import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [featured, latest, free] = await Promise.all([
    payload.find({
      collection: 'vod',
      limit: 12,
      sort: '-featuredPriority',
      where: { isFeatured: { equals: true }, status: { equals: 'published' } },
    }),

    payload.find({
      collection: 'vod',
      limit: 20,
      sort: '-publishedAt',
      where: { status: { equals: 'published' } },
    }),

    payload.find({
      collection: 'vod',
      limit: 12,
      where: { isFree: { equals: true }, status: { equals: 'published' } },
    }),
  ])

  return NextResponse.json({
    featured: featured.docs,
    latest: latest.docs,
    free: free.docs,
  })
}
