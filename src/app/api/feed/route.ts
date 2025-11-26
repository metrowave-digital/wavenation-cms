// app/api/feed/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import type { CollectionSlug } from 'payload'
import { CONTENT_COLLECTIONS, type ContentCollection } from './_constants'

type FeedItem = {
  id: number | string
  type: string
  createdAt: string
  data: any
}

/* --------------------------------------------------------------
 * Helpers: Latest + Trending
 * -------------------------------------------------------------- */
async function getLatest(limit: number): Promise<FeedItem[]> {
  const per = Math.ceil(limit / CONTENT_COLLECTIONS.length)
  const items: FeedItem[] = []

  for (const coll of CONTENT_COLLECTIONS) {
    const res = await payload.find({
      collection: coll as CollectionSlug,
      where: { _status: { equals: 'published' } },
      limit: per,
      sort: '-createdAt',
      depth: 2,
    })

    for (const doc of res.docs as any[]) {
      items.push({
        id: doc.id,
        type: coll.replace(/s$/, ''),
        createdAt: doc.createdAt,
        data: doc,
      })
    }
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return items.slice(0, limit)
}

async function getTrending(limit: number, days = 7): Promise<FeedItem[]> {
  const per = Math.ceil(limit / CONTENT_COLLECTIONS.length)

  const since = new Date()
  since.setDate(since.getDate() - days)
  const sinceISO = since.toISOString()

  const items: FeedItem[] = []

  for (const coll of CONTENT_COLLECTIONS) {
    const res = await payload.find({
      collection: coll as CollectionSlug,
      where: {
        _status: { equals: 'published' },
        createdAt: { greater_than_equal: sinceISO },
      },
      limit: per,
      sort: '-createdAt',
      depth: 2,
    })

    for (const doc of res.docs as any[]) {
      items.push({
        id: doc.id,
        type: coll.replace(/s$/, ''),
        createdAt: doc.createdAt,
        data: doc,
      })
    }
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return items.slice(0, limit)
}

/* --------------------------------------------------------------
 * Helper: Following slice for homepage
 * -------------------------------------------------------------- */
async function getFollowingSlice(userId: string | number, limit: number) {
  const followRes = await payload.find({
    collection: 'follows',
    where: { follower: { equals: userId } },
    depth: 1,
    limit: 200,
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
      depth: 2,
      limit: per,
    })

    for (const doc of res.docs as any[]) {
      items.push({
        id: doc.id,
        type: (map.collection as string).replace(/s$/, ''),
        createdAt: doc.createdAt,
        data: doc,
      })
    }
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return items.slice(0, limit)
}

/* --------------------------------------------------------------
 * Helper: Live section
 * -------------------------------------------------------------- */
async function getLive(limit: number) {
  const now = new Date().toISOString()

  const [liveEvents, liveChannels] = await Promise.all([
    payload.find({
      collection: 'live-events' as CollectionSlug,
      where: {
        and: [
          { startTime: { less_than_equal: now } },
          { endTime: { greater_than_equal: now } },
          { status: { equals: 'live' } },
        ],
      },
      sort: '-startTime',
      limit,
      depth: 2,
    }),
    payload.find({
      collection: 'channels' as CollectionSlug,
      where: { isLive: { equals: true } },
      sort: '-updatedAt',
      limit,
      depth: 2,
    }),
  ])

  return {
    liveEvents: liveEvents.docs.map((doc: any) => ({
      id: doc.id,
      type: 'live-event',
      createdAt: doc.createdAt,
      data: doc,
    })),
    liveChannels: liveChannels.docs.map((doc: any) => ({
      id: doc.id,
      type: 'channel',
      createdAt: doc.updatedAt || doc.createdAt,
      data: doc,
    })),
  }
}

/* --------------------------------------------------------------
 * Handler
 * -------------------------------------------------------------- */
export async function GET(req: Request) {
  const user = (req as any).user

  const [live, latest, trending, following] = await Promise.all([
    getLive(8),
    getLatest(24),
    getTrending(16),
    user ? getFollowingSlice(user.id, 16) : Promise.resolve([]),
  ])

  return NextResponse.json({
    sections: {
      live,
      latest,
      trending,
      following,
    },
  })
}
