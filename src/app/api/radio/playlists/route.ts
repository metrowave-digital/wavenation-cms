// src/app/api/radio/playlists/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const playlists = await payload.find({
    collection: 'playlists',
    limit: 200,
    sort: '-updatedAt',
  })

  return NextResponse.json(playlists)
}

export async function POST(req: Request) {
  const data = await req.json()

  const created = await payload.create({
    collection: 'playlists',
    data,
  })

  return NextResponse.json(created)
}
