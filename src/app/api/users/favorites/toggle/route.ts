// app/api/users/favorites/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId, itemType } = await req.json()

  const existing = await payload.find({
    collection: 'user-favorites',
    limit: 1,
    where: {
      user: { equals: Number(userId) },
      itemId: { equals: itemId },
      itemType: { equals: itemType },
    },
  })

  // If exists → delete it
  if (existing.docs.length > 0) {
    await payload.delete({
      collection: 'user-favorites',
      id: existing.docs[0].id,
    })

    return NextResponse.json({ favorited: false })
  }

  // Otherwise → create
  const created = await payload.create({
    collection: 'user-favorites',
    data: {
      user: Number(userId), // FIXED
      itemId,
      itemType,
    },
  })

  return NextResponse.json({ favorited: true, favorite: created })
}
