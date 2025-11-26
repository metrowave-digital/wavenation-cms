// src/app/api/chat/messages/mark-read/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  const { sessionId, userId } = await req.json()

  if (!sessionId || !userId) {
    return NextResponse.json({ error: 'Missing sessionId or userId' }, { status: 400 })
  }

  const session: any = await payload.findByID({
    collection: 'chat-sessions',
    id: sessionId,
  })

  const prevCounts: any[] = Array.isArray(session.unreadCounts) ? session.unreadCounts : []

  const updatedCounts = prevCounts.map((u) =>
    String(u.user) === String(userId) ? { ...u, count: 0 } : u,
  )

  await payload.update({
    collection: 'chat-sessions',
    id: sessionId,
    data: { unreadCounts: updatedCounts },
  })

  await payload.update({
    collection: 'chat-messages',
    where: {
      and: [{ session: { equals: sessionId } }, { isRead: { equals: false } }],
    },
    data: { isRead: true },
  })

  await pusher.trigger(`chat-${sessionId}`, 'message:read', { userId })

  return NextResponse.json({ success: true })
}
