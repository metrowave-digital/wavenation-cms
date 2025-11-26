// src/app/api/radio/next-track/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    title: 'Upcoming Track',
    artist: 'Artist Name',
    timestamp: Date.now(),
  })
}
