// src/app/api/radio/current-track/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  // This will later connect to your automation system API or VM.
  return NextResponse.json({
    title: 'Unknown Track',
    artist: 'Unknown Artist',
    timestamp: Date.now(),
  })
}
