// src/app/api/radio/voice-memos/approve/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { id } = await req.json()

  const updated = await payload.update({
    collection: 'voice-memos',
    id,
    data: { status: 'approved' },
  })

  return NextResponse.json({ status: 'approved', updated })
}
