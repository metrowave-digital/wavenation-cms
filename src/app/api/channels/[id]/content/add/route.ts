import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()

  const { type, contentId } = body

  const fields = {
    post: 'posts',
    video: 'videos',
    track: 'tracks',
    episode: 'podcastEpisodes',
    series: 'series',
  } as const

  const fieldName = fields[type as keyof typeof fields]

  if (!fieldName) {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  }

  const updated = await payload.update({
    collection: 'creator-channels',
    id: params.id,
    data: {
      [fieldName]: {
        create: false,
        value: contentId,
      },
    },
  })

  return NextResponse.json({ success: true, channel: updated })
}
