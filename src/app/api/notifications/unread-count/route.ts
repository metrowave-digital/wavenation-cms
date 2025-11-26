// app/api/notifications/unread-count/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ unread: 0 })

  const result = await payload.find({
    collection: 'notifications',
    where: {
      recipient: { equals: user.id },
      read: { equals: false },
    },
  })

  return NextResponse.json({ unread: result.totalDocs })
}
