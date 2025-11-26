// app/api/dashboard/content/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [articles, vod, tracks, episodes, podcasts, shows, users] = await Promise.all([
    payload.count({ collection: 'articles' }),
    payload.count({ collection: 'vod' }),
    payload.count({ collection: 'tracks' }),
    payload.count({ collection: 'episodes' }),
    payload.count({ collection: 'podcasts' }),
    payload.count({ collection: 'shows' }),
    payload.count({ collection: 'users' }),
  ])

  return NextResponse.json({ articles, vod, tracks, episodes, podcasts, shows, users })
}
