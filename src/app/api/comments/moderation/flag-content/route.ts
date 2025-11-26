import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, reason } = await req.json()

  const updated = await payload.update({
    collection: 'comments',
    id,
    data: {
      status: 'flagged',
      moderationNotes: reason || 'Flagged by moderator',
    },
  })

  return NextResponse.json({ success: true, updated })
}
