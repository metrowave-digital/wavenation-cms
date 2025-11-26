import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET() {
  const categories = await payload.find({
    collection: 'categories',
    limit: 500,
    sort: 'priority',
  })

  return NextResponse.json(categories.docs)
}
