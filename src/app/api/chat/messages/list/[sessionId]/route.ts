// src/app/api/chat/messages/list/[sessionId]/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = { params: { sessionId: string } }

export async function GET(_req: Request, { params }: Params) {
  const { sessionId } = params

  const msgs = await payload.find({
    collection: 'chat-messages',
    where: { session: { equals: sessionId } },
    sort: '-createdAt',
    limit: 50,
  })

  return NextResponse.json(msgs.docs)
}
