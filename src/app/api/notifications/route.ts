// app/api/notifications/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const user = (req as any).user
  if (!user) return NextResponse.json({ notifications: [] })

  const result = await payload.find({
    collection: 'notifications',
    where: {
      recipient: { equals: user.id },
    },
    sort: '-createdAt',
    depth: 2,
  })

  return NextResponse.json({
    notifications: result.docs,
  })
}
