// src/app/api/social/messages/delete/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { messageId } = await req.json()

  if (!messageId) {
    return NextResponse.json({ error: 'Missing messageId' }, { status: 400 })
  }

  await payload.delete({
    collection: 'messages',
    id: messageId,
  })

  return NextResponse.json({ success: true })
}
