// src/app/api/social/messages/send/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { senderId, recipientId, cc, bcc, subject, body, attachments } = await req.json()

  if (!senderId || !recipientId || !subject || !body) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const msg = await payload.create({
    collection: 'messages',
    data: {
      sender: senderId,
      recipient: recipientId,
      cc,
      bcc,
      subject,
      body,
      attachments,
      isRead: false,
      labels: ['inbox'],
    },
  })

  return NextResponse.json({ success: true, message: msg })
}
