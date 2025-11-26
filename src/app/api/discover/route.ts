// app/api/discover/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [articles, vod, tracks, podcasts, shows] = await Promise.all([
    payload.find({
      collection: 'articles',
      limit: 10,
      sort: '-publishedAt',
      where: { editorialStatus: { equals: 'published' } },
    }),

    payload.find({
      collection: 'vod',
      limit: 10,
      sort: '-publishedAt',
    }),

    payload.find({
      collection: 'tracks',
      limit: 10,
      sort: '-publishedAt',
    }),

    payload.find({
      collection: 'podcasts',
      limit: 10,
      sort: '-publishedAt',
    }),

    payload.find({
      collection: 'shows',
      limit: 10,
      sort: '-publishedAt',
    }),
  ])

  return NextResponse.json({
    articles: articles.docs,
    vod: vod.docs,
    tracks: tracks.docs,
    podcasts: podcasts.docs,
    shows: shows.docs,
  })
}
