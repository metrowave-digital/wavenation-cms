// app/api/users/favorites/route.ts
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId, itemType, metadata } = await req.json()

  if (!itemId || !itemType) {
    return NextResponse.json({ error: 'Missing itemId or itemType' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'user-favorites',
    limit: 1,
    where: {
      user: { equals: Number(userId) },
      itemId: { equals: itemId },
      itemType: { equals: itemType },
    },
  })

  if (existing.docs.length > 0) {
    return NextResponse.json(existing.docs[0])
  }

  // FIX: user expects number, not { relationTo, value }
  const created = await payload.create({
    collection: 'user-favorites',
    data: {
      user: Number(userId),
      itemId,
      itemType,
      metadata: metadata ?? null,
    },
  })

  return NextResponse.json(created)
}
