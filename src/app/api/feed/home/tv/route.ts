import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const trendingVideos = await payload.find({
    collection: 'videos',
    where: {},
    sort: '-views',
    limit: 30,
  })

  const featuredChannels = await payload.find({
    collection: 'creator-channels',
    where: { 'algorithm.featuredPriority': { greater_than: 3 } },
    sort: '-algorithm.featuredPriority',
    limit: 20,
  })

  return NextResponse.json({
    trendingVideos: trendingVideos.docs,
    featuredChannels: featuredChannels.docs,
  })
}
