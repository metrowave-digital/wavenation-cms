// src/app/api/chat/sessions/list/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const sessions = await payload.find({
    collection: 'chat-sessions',
    where: {
      participants: { contains: userId },
    },
    sort: '-updatedAt',
  })

  return NextResponse.json(sessions.docs)
}
