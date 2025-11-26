import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const series = await payload.find({
    collection: 'series',
    limit: 200,
    sort: ['-algorithm.featuredPriority', 'title'],
    depth: 2,
  })

  return NextResponse.json(series.docs)
}
