// app/api/dashboard/stats/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [users, articles, events, vod, music] = await Promise.all([
    payload.count({ collection: 'users' }),
    payload.count({ collection: 'articles' }),
    payload.count({ collection: 'events' }),
    payload.count({ collection: 'vod' }),
    payload.count({ collection: 'tracks' }),
    payload.count({ collection: 'podcasts' }),
    payload.count({ collection: 'shows' }),
  ])

  return NextResponse.json({
    users,
    articles,
    events,
    vod,
    music,
    timestamp: new Date().toISOString(),
  })
}
