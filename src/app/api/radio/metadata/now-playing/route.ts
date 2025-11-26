// src/app/api/radio/metadata/now-playing/route.ts
import { NextResponse } from 'next/server'

let nowPlayingCache: any = null

export async function POST(req: Request) {
  const body = await req.json()
  nowPlayingCache = {
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ status: 'ok', data: nowPlayingCache })
}

export async function GET() {
  return NextResponse.json(nowPlayingCache ?? { status: 'no-data' })
}
