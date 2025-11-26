import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Optional user context for personalization later
  const userId = req.headers.get('x-user-id') || undefined

  const [featuredPlaylists, featuredTracks, newTracks, localSpotlight, editorialAlbums] =
    await Promise.all([
      // Editorial / Staff playlists
      payload.find({
        collection: 'playlists',
        limit: 8,
        sort: ['-featuredPriority', '-playCount'],
        where: {
          status: { equals: 'published' },
          visibility: { equals: 'public' },
          staffPick: { equals: true },
        },
      }),

      // Featured tracks
      payload.find({
        collection: 'tracks',
        limit: 16,
        sort: [
          '-featuredPriority',
          '-metrics.popularityScore',
          '-metrics.playCount',
          '-publishDate',
        ],
        where: {
          staffPick: { equals: true },
        },
      }),

      // New releases
      payload.find({
        collection: 'tracks',
        limit: 24,
        sort: '-publishDate',
        where: {
          publishDate: { exists: true },
        },
      }),

      // Local artist spotlight
      payload.find({
        collection: 'tracks',
        limit: 12,
        sort: ['-metrics.popularityScore', '-metrics.playCount', '-publishDate'],
        where: {
          isLocalArtist: { equals: true },
        },
      }),

      // Albums / EPs
      payload.find({
        collection: 'albums',
        limit: 12,
        sort: ['-releaseYear', '-metrics.streams'],
        where: {},
      }),
    ])

  return NextResponse.json({
    userId: userId ?? null,
    featuredPlaylists: featuredPlaylists.docs,
    featuredTracks: featuredTracks.docs,
    newTracks: newTracks.docs,
    localSpotlight: localSpotlight.docs,
    editorialAlbums: editorialAlbums.docs,
  })
}
