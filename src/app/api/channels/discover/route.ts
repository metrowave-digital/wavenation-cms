import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const channels = await payload.find({
    collection: 'creator-channels',
    where: {
      status: { equals: 'active' },
    },
    sort: '-metrics.followers',
    limit: 50,
    depth: 1,
  })

  return NextResponse.json(channels)
}
