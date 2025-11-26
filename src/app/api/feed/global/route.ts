// app/api/feed/global/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import type { CollectionSlug } from 'payload'
import { CONTENT_COLLECTIONS, type ContentCollection, isContentCollection } from '../_constants'

type FeedItem = {
  id: number | string
  type: string
  createdAt: string
  data: any
}

async function fetchFrom(
  collection: ContentCollection,
  limit: number,
  where: Record<string, any> = {},
): Promise<FeedItem[]> {
  const res = await payload.find({
    collection: collection as CollectionSlug,
    where: {
      _status: { equals: 'published' },
      ...where,
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
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 30)

  const typesParam = url.searchParams.get('types')

  let enabled: readonly ContentCollection[] = CONTENT_COLLECTIONS

  if (typesParam) {
    const reqTypes = typesParam
      .split(',')
      .map((x) => x.trim())
      .filter(isContentCollection)

    enabled = CONTENT_COLLECTIONS.filter((c) => reqTypes.includes(c))
  }

  const perColl = Math.max(5, Math.ceil(limit / enabled.length))

  const all: FeedItem[] = []

  for (const coll of enabled) {
    const where: Record<string, any> = {}
    if (coll === 'vod') where.isFree = { equals: true }

    all.push(...(await fetchFrom(coll, perColl, where)))
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
