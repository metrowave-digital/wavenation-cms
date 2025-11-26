// src/app/api/users/online/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  await payload.update({
    collection: 'users',
    id: userId,
    data: { isOnline: true },
  })

  await pusher.trigger('presence', 'user:online', { userId })

  return NextResponse.json({ success: true })
}
