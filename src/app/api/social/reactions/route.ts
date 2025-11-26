// src/app/api/social/reactions/route.ts
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const { userId, targetCollection, targetId, type } = await req.json()

  if (!userId || !targetCollection || !targetId || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'reactions',
    where: {
      user: { equals: userId },
      'target.relationTo': { equals: targetCollection },
      'target.value': { equals: targetId },
    },
  })

  if (existing.totalDocs > 0) {
    // toggle / change reaction
    const updated = await payload.update({
      collection: 'reactions',
      id: existing.docs[0].id,
      data: { type },
    })

    return NextResponse.json({ success: true, reaction: updated })
  }

  const reaction = await payload.create({
    collection: 'reactions',
    data: {
      user: userId,
      type,
      target: {
        relationTo: targetCollection,
        value: targetId,
      },
    },
  })

  return NextResponse.json({ success: true, reaction })
}

export async function DELETE(req: Request) {
  const { userId, targetCollection, targetId } = await req.json()

  const existing = await payload.find({
    collection: 'reactions',
    where: {
      user: { equals: userId },
      'target.relationTo': { equals: targetCollection },
      'target.value': { equals: targetId },
    },
  })

  await Promise.all(
    existing.docs.map((doc: any) => payload.delete({ collection: 'reactions', id: doc.id })),
  )

  return NextResponse.json({ success: true })
}
