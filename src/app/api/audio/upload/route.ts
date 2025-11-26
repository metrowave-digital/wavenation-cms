import payload from 'payload'
import { NextResponse } from 'next/server'

function detectMediaType(mime: string): 'image' | 'audio' | 'video' | 'document' | 'other' {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf' || mime === 'application/zip' || mime === 'application/json') {
    return 'document'
  }
  return 'other'
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  // Convert browser File → Node Buffer
  const buffer = Buffer.from(await file.arrayBuffer())

  const mediaType = detectMediaType(file.type)

  const upload = await payload.create({
    collection: 'media',

    // REQUIRED: minimal media fields
    data: {
      type: mediaType, // <-- FIXED
      title: file.name, // optional, but helpful
      filename: file.name, // if you have filename field
    },

    draft: false,

    file: {
      data: buffer,
      mimetype: file.type,
      name: file.name,
      size: buffer.byteLength,
    },
  })

  return NextResponse.json(upload)
}
