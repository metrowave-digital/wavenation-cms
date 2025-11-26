// src/app/api/tv/live/metadata/route.ts
import { NextResponse } from 'next/server'

let tvLiveMetadata: any = null

export async function POST(req: Request) {
  const body = await req.json()

  tvLiveMetadata = {
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({ status: 'ok', data: tvLiveMetadata })
}

export async function GET() {
  return NextResponse.json(tvLiveMetadata ?? { status: 'no-data' })
}
