import { NextResponse } from 'next/server'
import payload from 'payload'

let cachedEPG: any = null
let cachedAt: number | null = null
const TTL_MS = 5 * 60 * 1000 // 5 minutes

async function buildEPG() {
  const [tv, vod] = await Promise.all([
    payload.find({
      collection: 'tv-schedule',
      depth: 2,
      limit: 500,
      sort: 'startTime',
    }),
    payload.find({
      collection: 'vod',
      depth: 2,
      limit: 300,
      sort: '-releaseDate',
    }),
  ])

  const tvChannel = {
    id: 'wavenation-tv',
    name: 'WaveNation TV',
    schedule: tv.docs,
  }

  const vodChannel = {
    id: 'wavenation-vod',
    name: 'WaveNation On Demand',
    items: vod.docs,
  }

  return {
    channels: [tvChannel, vodChannel],
    generatedAt: new Date().toISOString(),
  }
}

export async function GET() {
  const now = Date.now()

  if (cachedEPG && cachedAt && now - cachedAt < TTL_MS) {
    return NextResponse.json({
      ...cachedEPG,
      cached: true,
      cachedAt: new Date(cachedAt).toISOString(),
    })
  }

  cachedEPG = await buildEPG()
  cachedAt = now

  return NextResponse.json({
    ...cachedEPG,
    cached: false,
    cachedAt: new Date(cachedAt).toISOString(),
  })
}

export async function POST() {
  cachedEPG = await buildEPG()
  cachedAt = Date.now()

  return NextResponse.json({
    ...cachedEPG,
    cached: false,
    cachedAt: new Date(cachedAt).toISOString(),
    forcedRefresh: true,
  })
}
