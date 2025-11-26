import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params

  const categoryRes = await payload.find({
    collection: 'categories',
    limit: 1,
    where: { slug: { equals: slug } },
  })

  if (!categoryRes.docs.length) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const category = categoryRes.docs[0]

  // Fetch linked content (articles, tracks, episodes, playlists)
  const [articles, tracks, episodes, playlists] = await Promise.all([
    payload.find({
      collection: 'articles',
      limit: 25,
      where: { categories: { contains: category.id } },
    }),
    payload.find({
      collection: 'tracks',
      limit: 25,
      where: { genre: { equals: category.id } },
    }),
    payload.find({
      collection: 'episodes',
      limit: 25,
      where: { genres: { contains: category.id } },
    }),
    payload.find({
      collection: 'playlists',
      limit: 25,
      where: { genres: { contains: category.id } },
    }),
  ])

  return NextResponse.json({
    category,
    articles: articles.docs,
    tracks: tracks.docs,
    episodes: episodes.docs,
    playlists: playlists.docs,
  })
}
