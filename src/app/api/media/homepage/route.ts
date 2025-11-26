import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const [liveTV, radio, featured] = await Promise.all([
    payload.find({
      collection: 'live-channels', // ✔ FIXED
      limit: 1,
      where: { isActive: { equals: true } },
    }),

    payload.find({
      collection: 'radio-schedule', // ✔ FIXED
      limit: 10,
      where: { isActive: { equals: true } },
    }),

    payload.find({
      collection: 'media',
      limit: 12,
      where: { isFeatured: { equals: true } },
      sort: '-createdAt',
    }),
  ])

  return NextResponse.json({
    liveTV: liveTV.docs?.[0] || null,
    radioStreams: radio.docs,
    featuredMedia: featured.docs,
  })
}
