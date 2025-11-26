import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  // 1. Channels followed by user
  let followingChannels: string[] = []

  if (userId) {
    const follows = await payload.find({
      collection: 'follows',
      where: {
        follower: { equals: userId },
      },
      limit: 500,
    })

    followingChannels = follows.docs.filter((f: any) => f.channel).map((f: any) => f.channel)
  }

  // 2. Posts from followed channels
  const posts = await payload.find({
    collection: 'posts',
    where: {
      channel: { in: followingChannels.length > 0 ? followingChannels : ['none'] },
    },
    sort: '-createdAt',
    limit: 20,
  })

  // 3. Trending channels
  const trending = await payload.find({
    collection: 'creator-channels',
    sort: '-algorithm.trendingBoost',
    limit: 10,
  })

  // 4. New Videos
  const videos = await payload.find({
    collection: 'videos',
    sort: '-createdAt',
    limit: 10,
  })

  // 5. Tracks
  const tracks = await payload.find({
    collection: 'tracks',
    sort: '-createdAt',
    limit: 10,
  })

  // 6. Staff picks
  const staffPicks = await payload.find({
    collection: 'creator-channels',
    where: { 'algorithm.staffPick': { equals: true } },
    limit: 10,
  })

  return NextResponse.json({
    posts: posts.docs,
    trending: trending.docs,
    videos: videos.docs,
    tracks: tracks.docs,
    staffPicks: staffPicks.docs,
  })
}
