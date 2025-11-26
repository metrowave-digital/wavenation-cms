// app/api/events/[slug]/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: any) {
  const result = await payload.find({
    collection: 'events',
    where: { slug: { equals: params.slug } },
    limit: 1,
  })

  return NextResponse.json(result.docs[0] || null)
}
