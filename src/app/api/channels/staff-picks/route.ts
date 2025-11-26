import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const results = await payload.find({
    collection: 'creator-channels',
    where: {
      'algorithm.staffPick': { equals: true },
    },
    limit: 20,
  })

  return NextResponse.json(results)
}
