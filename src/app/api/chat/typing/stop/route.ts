// src/app/api/chat/typing/stop/route.ts
import { NextResponse } from 'next/server'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  const { sessionId, userId } = await req.json()

  if (!sessionId || !userId) {
    return NextResponse.json({ error: 'Missing sessionId or userId' }, { status: 400 })
  }

  await pusher.trigger(`chat-${sessionId}`, 'typing:stop', { userId })

  return NextResponse.json({ success: true })
}
