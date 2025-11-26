// src/app/api/vod/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const vod = await payload.find({
    collection: 'vod',
    depth: 2,
    limit: 300,
    sort: '-createdAt',
  })

  return NextResponse.json(vod)
}

export async function POST(req: Request) {
  const body = await req.json()

  const created = await payload.create({
    collection: 'vod',
    data: body,
  })

  return NextResponse.json(created)
}
