// src/app/api/users/offline/route.ts
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
    data: { isOnline: false },
  })

  await pusher.trigger('presence', 'user:offline', { userId })

  return NextResponse.json({ success: true })
}
