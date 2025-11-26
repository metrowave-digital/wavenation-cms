import payload from 'payload'
import sharp from 'sharp'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const idParam = new URL(req.url).searchParams.get('id')

  // Fix #1 — Payload expects id: string | number, never null
  if (!idParam) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const media = await payload.findByID({
    collection: 'media',
    id: idParam, // now guaranteed string
  })

  // Fix #2 — ensure URL exists before fetching
  if (!media.url) {
    return NextResponse.json({ error: 'Media has no URL' }, { status: 400 })
  }

  // Fetch the file
  const res = await fetch(media.url as string)

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 502 })
  }

  // Convert to ArrayBuffer
  const arrayBuffer = await res.arrayBuffer()

  // Fix #3 — sharp requires Node Buffer, NextResponse wants Uint8Array
  const inputBuffer = Buffer.from(arrayBuffer)

  // Generate thumbnail
  const thumbBuffer = await sharp(inputBuffer).resize(400).toBuffer()

  // Convert to Uint8Array (Next.js Response supports this directly)
  const thumbBytes = new Uint8Array(thumbBuffer)

  const mimeType = media.mimeType || 'image/jpeg'

  return new NextResponse(thumbBytes, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
