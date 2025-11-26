// app/api/users/favorites/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const favorites = await payload.find({
    collection: 'user-favorites',
    where: { user: { equals: Number(userId) } },
    limit: 500,
  })

  const results: Record<string, any[]> = {}

  for (const fav of favorites.docs) {
    if (!results[fav.itemType]) results[fav.itemType] = []

    try {
      // FIX: cast itemType to any to satisfy CollectionSlug
      const item = await payload.findByID({
        collection: fav.itemType as any,
        id: fav.itemId,
      })

      results[fav.itemType].push(item)
    } catch (e) {
      // Bad slug or missing entry
      continue
    }
  }

  return NextResponse.json(results)
}
