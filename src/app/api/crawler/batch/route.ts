// app/api/crawler/batch/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const items = await req.json()

  const results = []
  for (const item of items) {
    const created = await payload.create({
      collection: item.collection,
      data: item.data,
    })
    results.push(created)
  }

  return NextResponse.json(results)
}
