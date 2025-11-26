import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

// --------------------------------------
// GET PROGRESS LIST
// --------------------------------------
export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const type = new URL(req.url).searchParams.get('type')

  const where: any = {
    user: { equals: Number(userId) },
  }

  if (type) where.itemType = { equals: type }

  const result = await payload.find({
    collection: 'playback-progress' as any,
    limit: 200,
    where,
  })

  return NextResponse.json({ items: result.docs })
}

// --------------------------------------
// POST CREATE / UPDATE PROGRESS
// --------------------------------------
export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { itemId, itemType, progress, lastPositionSeconds } = await req.json()

  if (!itemId || !itemType || progress === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'playback-progress' as any,
    limit: 1,
    where: {
      user: { equals: Number(userId) },
      itemId: { equals: itemId },
      itemType: { equals: itemType },
    },
  })

  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: 'playback-progress' as any,
      id: existing.docs[0].id,
      data: {
        progress,
        lastPositionSeconds,
      },
    })

    return NextResponse.json(updated)
  }

  // Create new progress record
  const created = await payload.create({
    collection: 'playback-progress' as any,
    data: {
      user: Number(userId),
      itemId,
      itemType,
      progress,
      lastPositionSeconds,
    },
  })

  return NextResponse.json(created)
}

// --------------------------------------
// DELETE ONE PROGRESS ENTRY
// --------------------------------------
export async function DELETE(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const itemId = searchParams.get('itemId')
  const itemType = searchParams.get('itemType')

  if (!itemId || !itemType) {
    return NextResponse.json({ error: 'Missing itemId or itemType' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'playback-progress' as any,
    limit: 1,
    where: {
      user: { equals: Number(userId) },
      itemId: { equals: itemId },
      itemType: { equals: itemType },
    },
  })

  if (!existing.docs.length) return NextResponse.json({ ok: true })

  await payload.delete({
    collection: 'playback-progress' as any,
    id: existing.docs[0].id,
  })

  return NextResponse.json({ ok: true })
}
