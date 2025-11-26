// src/app/api/chat/messages/send/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  const { sessionId, senderId, content, attachments } = await req.json()

  if (!sessionId || !senderId) {
    return NextResponse.json({ error: 'Missing sessionId or senderId' }, { status: 400 })
  }

  const message = await payload.create({
    collection: 'chat-messages',
    data: {
      session: sessionId,
      sender: senderId,
      content,
      attachments,
      isRead: false,
    },
  })

  const session: any = await payload.findByID({
    collection: 'chat-sessions',
    id: sessionId,
  })

  const prevCounts: any[] = Array.isArray(session.unreadCounts) ? session.unreadCounts : []

  const updatedCounts = prevCounts.map((u) =>
    String(u.user) === String(senderId) ? u : { ...u, count: (u.count ?? 0) + 1 },
  )

  await payload.update({
    collection: 'chat-sessions',
    id: sessionId,
    data: {
      lastMessage: message.id,
      unreadCounts: updatedCounts,
    },
  })

  await pusher.trigger(`chat-${sessionId}`, 'message:new', {
    message,
  })

  return NextResponse.json({ success: true, message })
}
