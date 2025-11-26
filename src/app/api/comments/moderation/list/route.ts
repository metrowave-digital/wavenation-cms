import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const comments = await payload.find({
    collection: 'comments',
    where: {
      status: { in: ['pending', 'flagged'] },
    },
    sort: '-createdAt',
  })

  return NextResponse.json(comments)
}
