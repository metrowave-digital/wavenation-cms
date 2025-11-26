// app/api/feed/for-you/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import type { CollectionSlug } from 'payload'
import { CONTENT_COLLECTIONS, type ContentCollection, isContentCollection } from '../_constants'

type FeedItem = {
  id: number | string
  type: string
  createdAt: string
  score: number
  data: any
}

/* --------------------------------------------------------------
 * Global slice (base ranking)
 * -------------------------------------------------------------- */
async function getGlobalSlice(limit: number): Promise<FeedItem[]> {
  const per = Math.max(5, Math.ceil(limit / CONTENT_COLLECTIONS.length))
  const items: FeedItem[] = []

  for (const coll of CONTENT_COLLECTIONS) {
    const res = await payload.find({
      collection: coll as CollectionSlug,
      where: { _status: { equals: 'published' } },
      sort: '-createdAt',
      limit: per,
      depth: 2,
    })

    for (const doc of res.docs as any[]) {
      items.push({
        id: doc.id,
        type: coll.replace(/s$/, ''),
        createdAt: doc.createdAt,
        score: 1,
        data: doc,
      })
    }
  }

  return items
}

/* --------------------------------------------------------------
 * Following slice (stronger score)
 * -------------------------------------------------------------- */
async function getFollowingSlice(userId: number | string, limit: number): Promise<FeedItem[]> {
  const followRes = await payload.find({
    collection: 'follows',
    where: { follower: { equals: userId } },
    depth: 1,
    limit: 500,
  })

  const targets = followRes.docs.map((f: any) => {
    const rel = f.target
    const value = typeof rel.value === 'object' ? rel.value.id : rel.value
    return {
      id: value,
      kind: rel.relationTo as string,
    }
  })

  const mapping: {
    collection: CollectionSlug
    field: string
    matchKind: string
  }[] = [
    { collection: 'posts', field: 'channel', matchKind: 'creator-channels' },
    { collection: 'videos', field: 'channel', matchKind: 'creator-channels' },
    { collection: 'tracks', field: 'channel', matchKind: 'creator-channels' },
    { collection: 'podcast-episodes', field: 'channel', matchKind: 'creator-channels' },
    { collection: 'shows', field: 'show', matchKind: 'shows' },
    { collection: 'podcasts', field: 'podcast', matchKind: 'podcasts' },
    { collection: 'posts', field: 'author', matchKind: 'users' },
  ]

  const per = limit
  const items: FeedItem[] = []

  for (const map of mapping) {
    const ids = targets.filter((t) => t.kind === map.matchKind).map((t) => t.id)
    if (!ids.length) continue

    const res = await payload.find({
      collection: map.collection,
      where: {
        _status: { equals: 'published' },
        [map.field]: { in: ids },
      },
      sort: '-createdAt',
      limit: per,
      depth: 2,
    })

    for (const doc of res.docs as any[]) {
      items.push({
        id: doc.id,
        type: (map.collection as string).replace(/s$/, ''),
        createdAt: doc.createdAt,
        score: 3, // weighted
        data: doc,
      })
    }
  }

  return items
}

/* --------------------------------------------------------------
 * Handler
 * -------------------------------------------------------------- */
export async function GET(req: Request) {
  const user = (req as any).user
  const url = new URL(req.url)
  const limit = Number(url.searchParams.get('limit') || 30)
  const page = Number(url.searchParams.get('page') || 1)

  // If no user → fallback to global feed
  if (!user) {
    const globalItems = await getGlobalSlice(limit * 2)

    globalItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const start = (page - 1) * limit
    return NextResponse.json({
      feed: globalItems.slice(start, start + limit),
      total: globalItems.length,
      page,
      totalPages: Math.ceil(globalItems.length / limit),
    })
  }

  // Logged in → merge following + global
  const [followItems, globalItems] = await Promise.all([
    getFollowingSlice(user.id, limit * 2),
    getGlobalSlice(limit * 2),
  ])

  // merge + keep the higher score
  const merged = new Map<string, FeedItem>()
  const insert = (item: FeedItem) => {
    const key = `${item.type}:${item.id}`
    const exists = merged.get(key)
    if (!exists || item.score > exists.score) merged.set(key, item)
  }

  followItems.forEach(insert)
  globalItems.forEach(insert)

  const all = [...merged.values()]

  // sort by score DESC then recency DESC
  all.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const start = (page - 1) * limit

  return NextResponse.json({
    feed: all.slice(start, start + limit),
    total: all.length,
    page,
    totalPages: Math.ceil(all.length / limit),
  })
}
