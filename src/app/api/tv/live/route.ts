// src/app/api/tv/live/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    streamUrl: process.env.WAVENATION_TV_LIVE_URL,
    status: 'online',
    timestamp: Date.now(),
  })
}
