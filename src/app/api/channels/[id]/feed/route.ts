import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const channelId = params.id

  const channel = await payload.findByID({
    collection: 'creator-channels',
    id: channelId,
    depth: 2,
  })

  // Normalize everything to arrays
  const posts = Array.isArray(channel.posts) ? channel.posts : []
  const videos = Array.isArray(channel.videos) ? channel.videos : []
  const tracks = Array.isArray(channel.tracks) ? channel.tracks : []
  const podcastEpisodes = Array.isArray(channel.podcastEpisodes) ? channel.podcastEpisodes : []
  const series = Array.isArray(channel.series) ? channel.series : []

  // Flatten + annotate
  const items = [
    ...posts.map((p: any) => ({ ...p, _type: 'post' })),
    ...videos.map((v: any) => ({ ...v, _type: 'video' })),
    ...tracks.map((t: any) => ({ ...t, _type: 'track' })),
    ...podcastEpisodes.map((e: any) => ({ ...e, _type: 'podcast' })),
    ...series.map((s: any) => ({ ...s, _type: 'series' })),
  ]

  // Sort by newest first
  items.sort((a: any, b: any) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return NextResponse.json({ feed: items })
}
