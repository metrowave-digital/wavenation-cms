// src/app/api/social/messages/inbox/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const inbox = await payload.find({
    collection: 'messages',
    where: {
      recipient: { equals: userId },
    },
    sort: '-createdAt',
  })

  return NextResponse.json(inbox.docs)
}
