// app/api/crawler/refresh/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST() {
  const items = await payload.find({
    collection: 'articles',
    limit: 200,
  })

  for (const article of items.docs) {
    // Queue re-ingestion
  }

  return NextResponse.json({ queued: items.docs.length })
}
