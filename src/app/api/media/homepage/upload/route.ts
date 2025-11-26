import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  // Convert Web File → Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Detect media type for required field
  let mediaType: 'image' | 'video' | 'audio' | 'other' = 'other'

  if (file.type.startsWith('image/')) mediaType = 'image'
  else if (file.type.startsWith('video/')) mediaType = 'video'
  else if (file.type.startsWith('audio/')) mediaType = 'audio'

  const payloadFile = {
    data: buffer,
    filename: file.name,
    mimetype: file.type,
    size: buffer.length,
  }

  const upload = await payload.create({
    collection: 'media',

    draft: false, // required for collections with versions enabled

    file: payloadFile as any,

    // REQUIRED FIELDS FOR THE MEDIA COLLECTION
    data: {
      type: mediaType, // <-- FIXES THE ERROR
    },
  })

  return NextResponse.json(upload)
}
