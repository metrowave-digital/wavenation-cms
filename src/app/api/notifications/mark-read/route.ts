import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(req: Request) {
  const user = (req as any).user
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Load all unread notifications for this user
  const unread = await payload.find({
    collection: 'notifications',
    limit: 1000, // adjust as needed
    where: {
      user: { equals: user.id },
      isRead: { equals: false },
    },
  })

  // 2. Update each one individually (update-by-ID)
  for (const note of unread.docs) {
    await payload.update({
      collection: 'notifications',
      id: note.id,
      data: { isRead: true },
    })
  }

  return NextResponse.json({ success: true })
}
