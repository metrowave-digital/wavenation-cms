import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const [
    breakingNews,
    trendingNews,
    latestNews,
    featuredVOD,
    latestVOD,
    featuredPlaylists,
    latestTracks,
    liveChannels,
    radioSchedule,
  ] = await Promise.all([
    // Breaking News
    payload.find({
      collection: 'articles',
      limit: 5,
      sort: '-publishedAt',
      where: { isBreaking: { equals: true }, editorialStatus: { equals: 'published' } },
    }),

    // Trending News
    payload.find({
      collection: 'articles',
      limit: 10,
      sort: ['-viewCount', '-shareCount', '-publishedAt'],
      where: { editorialStatus: { equals: 'published' } },
    }),

    // Latest News
    payload.find({
      collection: 'articles',
      limit: 12,
      sort: '-publishedAt',
      where: { editorialStatus: { equals: 'published' } },
    }),

    // Featured VOD
    payload.find({
      collection: 'vod',
      limit: 10,
      sort: '-featuredPriority',
      where: { status: { equals: 'published' }, isFeatured: { equals: true } },
    }),

    // Latest VOD
    payload.find({
      collection: 'vod',
      limit: 12,
      sort: '-publishedAt',
      where: { status: { equals: 'published' } },
    }),

    // Featured Playlists
    payload.find({
      collection: 'playlists',
      limit: 10,
      sort: '-priority',
      where: { featured: { equals: true }, isActive: { equals: true } },
    }),

    // Latest Tracks
    payload.find({
      collection: 'tracks',
      limit: 15,
      sort: '-releasedAt',
      where: { isActive: { equals: true } },
    }),

    // Live TV Channels
    payload.find({
      collection: 'live-channels',
      limit: 1,
      where: { isActive: { equals: true } },
    }),

    // Radio Schedule (your collection)
    payload.find({
      collection: 'radio-schedule',
      limit: 5,
      where: { isActive: { equals: true } },
    }),
  ])

  return NextResponse.json({
    breakingNews: breakingNews.docs,
    trendingNews: trendingNews.docs,
    latestNews: latestNews.docs,

    featuredVOD: featuredVOD.docs,
    latestVOD: latestVOD.docs,

    featuredPlaylists: featuredPlaylists.docs,
    latestTracks: latestTracks.docs,

    liveChannel: liveChannels.docs?.[0] || null,
    radioSchedule: radioSchedule.docs,
  })
}
