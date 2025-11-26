// app/api/dashboard/feeds/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const latestArticles = await payload.find({
    collection: 'articles',
    sort: '-createdAt',
    limit: 6,
  })

  const trendingProfiles = await payload.find({
    collection: 'profiles',
    sort: '-algorithm.engagementScore',
    limit: 6,
  })

  return NextResponse.json({
    latestArticles: latestArticles.docs,
    trendingProfiles: trendingProfiles.docs,
  })
}
