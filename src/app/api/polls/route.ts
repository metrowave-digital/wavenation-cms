import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const polls = await payload.find({
    collection: 'polls',
    limit: 100,
    where: {
      status: { equals: 'active' },
    },
  })

  return NextResponse.json(polls.docs)
}
