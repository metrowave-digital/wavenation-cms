import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [tracks, playlists, albums] = await Promise.all([
    payload.find({ collection: 'tracks', limit: 20, sort: '-publishDate' }),
    payload.find({ collection: 'playlists', limit: 12, sort: '-featuredPriority' }),
    payload.find({ collection: 'albums', limit: 12, sort: '-releaseYear' }),
  ])

  return NextResponse.json({
    tracks: tracks.docs,
    playlists: playlists.docs,
    albums: albums.docs,
  })
}
