import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, action } = await req.json()

  const updated = await payload.update({
    collection: 'comments',
    id,
    data: {
      status: action === 'approve' ? 'approved' : 'flagged',
    },
  })

  return NextResponse.json({ success: true, updated })
}
