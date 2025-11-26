// app/api/feed/trending/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import type { CollectionSlug } from 'payload'
import { CONTENT_COLLECTIONS, type ContentCollection } from '../_constants'

type FeedItem = {
  id: number | string
  type: string
  createdAt: string
  data: any
}

async function fetchTrending(
  collection: ContentCollection,
  limit: number,
  sinceISO: string,
): Promise<FeedItem[]> {
  const res = await payload.find({
    collection: collection as CollectionSlug,
    where: {
      _status: { equals: 'published' },
      createdAt: { greater_than_equal: sinceISO },
    },
    sort: '-createdAt',
    depth: 2,
    limit,
  })

  return res.docs.map((doc: any) => ({
    id: doc.id,
    type: collection.replace(/s$/, ''),
    createdAt: doc.createdAt,
    data: doc,
  }))
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit') || 30)
  const page = Number(url.searchParams.get('page') || 1)
  const days = Number(url.searchParams.get('days') || 7)

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  let enabled: readonly ContentCollection[] = CONTENT_COLLECTIONS

  const perColl = Math.max(5, Math.ceil(limit / enabled.length))

  const all: FeedItem[] = []

  for (const coll of enabled) {
    all.push(...(await fetchTrending(coll, perColl, sinceISO)))
  }

  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const start = (page - 1) * limit
  const paginated = all.slice(start, start + limit)

  return NextResponse.json({
    feed: paginated,
    total: all.length,
    page,
    totalPages: Math.ceil(all.length / limit),
  })
}
