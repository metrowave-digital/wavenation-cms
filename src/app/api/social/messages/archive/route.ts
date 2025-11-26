// src/app/api/social/messages/archive/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { messageId } = await req.json()

  if (!messageId) {
    return NextResponse.json({ error: 'Missing messageId' }, { status: 400 })
  }

  await payload.update({
    collection: 'messages',
    id: messageId,
    data: { labels: ['archived'] },
  })

  return NextResponse.json({ success: true })
}
