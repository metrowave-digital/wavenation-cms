import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id') || null

  const [
    breakingNews,
    trendingNews,
    latestNews,
    featuredVOD,
    latestVOD,
    featuredPlaylists,
    latestTracks,
    editorialAlbums,
    liveTV,
    radioStreams,
  ] = await Promise.all([
    payload.find({
      collection: 'articles',
      limit: 6,
      sort: '-publishedAt',
      where: {
        isBreaking: { equals: true },
        editorialStatus: { equals: 'published' },
      },
    }),

    payload.find({
      collection: 'articles',
      limit: 10,
      sort: ['-viewCount', '-shareCount', '-publishedAt'],
      where: { editorialStatus: { equals: 'published' } },
    }),

    payload.find({
      collection: 'articles',
      limit: 12,
      sort: '-publishedAt',
      where: { editorialStatus: { equals: 'published' } },
    }),

    payload.find({
      collection: 'vod',
      limit: 10,
      sort: '-featuredPriority',
      where: { status: { equals: 'published' }, isFeatured: { equals: true } },
    }),

    payload.find({
      collection: 'vod',
      limit: 12,
      sort: '-publishedAt',
      where: { status: { equals: 'published' } },
    }),

    payload.find({
      collection: 'playlists',
      limit: 8,
      sort: ['-featuredPriority', '-playCount'],
      where: { status: { equals: 'published' }, visibility: { equals: 'public' } },
    }),

    payload.find({
      collection: 'tracks',
      limit: 20,
      sort: '-publishDate',
    }),

    payload.find({
      collection: 'albums',
      limit: 8,
      sort: ['-releaseYear', '-metrics.streams'],
    }),

    payload.find({
      collection: 'live-channels',
      limit: 1,
      where: { isActive: { equals: true } },
    }),

    payload.find({
      collection: 'radio-schedule',
      limit: 5,
      where: { isActive: { equals: true } },
    }),
  ])

  return NextResponse.json({
    userId,

    news: {
      breaking: breakingNews.docs,
      trending: trendingNews.docs,
      latest: latestNews.docs,
    },

    vod: {
      featured: featuredVOD.docs,
      latest: latestVOD.docs,
    },

    music: {
      featuredPlaylists: featuredPlaylists.docs,
      latestTracks: latestTracks.docs,
      editorialAlbums: editorialAlbums.docs,
    },

    media: {
      liveTV: liveTV.docs?.[0] || null,
      radioStreams: radioStreams.docs,
    },
  })
}
