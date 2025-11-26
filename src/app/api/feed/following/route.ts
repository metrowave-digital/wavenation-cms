// app/api/feed/following/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import type { CollectionSlug } from 'payload'

export async function GET(req: Request) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ feed: [] })

  const url = new URL(req.url)
  const page = Number(url.searchParams.get('page') || 1)
  const limit = Number(url.searchParams.get('limit') || 20)

  const followRes = await payload.find({
    collection: 'follows',
    where: { follower: { equals: user.id } },
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

  const feedItems: any[] = []

  async function fetchRelated<T extends CollectionSlug>(
    collection: T,
    field: string,
    matchKind: string,
  ) {
    const ids = targets.filter((t) => t.kind === matchKind).map((t) => t.id)
    if (!ids.length) return []

    const res = await payload.find({
      collection,
      where: {
        [field]: {
          in: ids,
        },
        _status: { equals: 'published' },
      },
      depth: 2,
      limit: 100,
    })

    return res.docs.map((doc: any) => ({
      id: doc.id,
      type: (collection as string).replace(/s$/, ''),
      createdAt: doc.createdAt,
      data: doc,
    }))
  }

  feedItems.push(...(await fetchRelated('posts', 'channel', 'creator-channels')))
  feedItems.push(...(await fetchRelated('videos', 'channel', 'creator-channels')))
  feedItems.push(...(await fetchRelated('tracks', 'channel', 'creator-channels')))
  feedItems.push(...(await fetchRelated('podcast-episodes', 'channel', 'creator-channels')))
  feedItems.push(...(await fetchRelated('shows', 'show', 'shows')))
  feedItems.push(...(await fetchRelated('podcasts', 'podcast', 'podcasts')))
  feedItems.push(...(await fetchRelated('posts', 'author', 'users')))

  feedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const start = (page - 1) * limit
  const paginated = feedItems.slice(start, start + limit)

  return NextResponse.json({
    feed: paginated,
    total: feedItems.length,
    page,
    totalPages: Math.ceil(feedItems.length / limit),
  })
}
