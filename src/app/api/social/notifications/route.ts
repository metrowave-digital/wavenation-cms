// src/app/api/social/notifications/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const notifications = await payload.find({
    collection: 'notifications',
    where: { user: { equals: userId } },
    sort: '-createdAt',
    limit: 50,
  })

  return NextResponse.json(notifications)
}

export async function PATCH(req: Request) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  const notifications = await payload.find({
    collection: 'notifications',
    where: { user: { equals: userId }, read: { equals: false } },
  })

  await Promise.all(
    notifications.docs.map((n: any) =>
      payload.update({
        collection: 'notifications',
        id: n.id,
        data: { read: true },
      }),
    ),
  )

  return NextResponse.json({ success: true })
}
