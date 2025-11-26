import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const channels = await payload.find({
    collection: 'creator-channels',
    sort: '-algorithm.trendingBoost',
    limit: 20,
  })

  return NextResponse.json(channels)
}
