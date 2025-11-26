// src/app/api/radio/voice-memos/review/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const pending = await payload.find({
    collection: 'voice-memos',
    where: { status: { equals: 'pending' } },
    sort: '-createdAt',
  })

  return NextResponse.json(pending)
}
