import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const { uid, readyToStream, meta } = body

  // find the media item linked to this Cloudflare video
  const mediaItem = await payload.find({
    collection: 'media',
    where: { sourceUrl: { equals: uid } },
  })

  if (!mediaItem?.docs?.[0]) return NextResponse.json({ ok: true })

  const doc = mediaItem.docs[0]

  await payload.update({
    collection: 'media',
    id: doc.id,
    data: {
      videoMetadata: {
        duration: meta.duration,
        width: meta.input.width,
        height: meta.input.height,
        frameRate: meta.input.fps,
      },
    },
  })

  return NextResponse.json({ success: true })
}
