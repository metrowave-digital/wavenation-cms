import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pull recent progress
  const { docs } = await payload.find({
    collection: 'playback-progress' as any,
    limit: 50,
    sort: '-updatedAt',
    where: {
      user: { equals: Number(userId) },
      progress: { less_than: 95 },
    },
  })

  const items: any[] = []

  for (const entry of docs) {
    try {
      // Load associated content
      const media = await payload.findByID({
        collection: entry.itemType as any,
        id: entry.itemId,
      })

      items.push({
        id: entry.id,
        itemId: entry.itemId,
        itemType: entry.itemType,
        progress: entry.progress,
        lastPositionSeconds: entry.lastPositionSeconds,
        updatedAt: entry.updatedAt,
        media,
      })
    } catch (e) {
      // If content was deleted — skip
      continue
    }
  }

  return NextResponse.json({
    items,
  })
}
