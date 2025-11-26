// src/app/api/social/posts/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const body = await req.json()

  const post = await payload.create({
    collection: 'posts',
    data: {
      author: body.authorId,
      text: body.text,
      media: body.mediaId || null,
      status: 'published',
      attachedContent: body.attachedContent || null, // if your Posts collection supports this
    },
  })

  return NextResponse.json({ success: true, post })
}
