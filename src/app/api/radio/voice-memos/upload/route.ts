// src/app/api/radio/voice-memos/upload/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  // Convert File → Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploaded = await payload.create({
    collection: 'voice-memos',

    // Upload file as required by Payload v3
    file: {
      data: buffer,
      name: file.name,
      mimetype: file.type, // NOTE: lowercase required
      size: file.size,
    },

    // Must match your collection fields
    data: {
      filename: file.name,
      status: 'pending',
    },
  })

  return NextResponse.json(uploaded)
}
