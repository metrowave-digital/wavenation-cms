import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const media = await payload.findByID({
    collection: 'media',
    id,
  })

  return NextResponse.json(media.audioMetadata || {})
}
