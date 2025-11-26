import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const idParam = new URL(req.url).searchParams.get('id')

  // Fix 1: id cannot be null
  if (!idParam) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Fix 2: findByID now receives guaranteed string
  const media = await payload.findByID({
    collection: 'media',
    id: idParam,
  })

  // Fix 3: safely return only videoMetadata
  return NextResponse.json(media.videoMetadata ?? {})
}
