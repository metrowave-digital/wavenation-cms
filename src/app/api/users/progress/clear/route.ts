import payload from 'payload'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await payload.find({
    collection: 'playback-progress' as any,
    limit: 500,
    where: { user: { equals: Number(userId) } },
  })

  for (const d of data.docs) {
    await payload.delete({
      collection: 'playback-progress' as any,
      id: d.id,
    })
  }

  return NextResponse.json({ cleared: data.docs.length })
}
