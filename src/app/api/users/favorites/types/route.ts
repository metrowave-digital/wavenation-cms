import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    types: [
      'posts',
      'videos',
      'tracks',
      'playlists',
      'albums',
      'artists',
      'vod',
      'shows',
      'episodes',
      'live',
    ],
  })
}
