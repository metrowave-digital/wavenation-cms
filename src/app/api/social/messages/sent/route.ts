// src/app/api/social/messages/sent/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const sent = await payload.find({
    collection: 'messages',
    where: {
      sender: { equals: userId },
    },
    sort: '-createdAt',
  })

  return NextResponse.json(sent.docs)
}
