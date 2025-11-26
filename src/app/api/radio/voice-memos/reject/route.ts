// src/app/api/radio/voice-memos/reject/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { id } = await req.json()

  const updated = await payload.update({
    collection: 'voice-memos',
    id,
    data: { status: 'rejected' },
  })

  return NextResponse.json({ status: 'rejected', updated })
}
