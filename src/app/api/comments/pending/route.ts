import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  const result = await payload.find({
    collection: 'comments',
    where: { status: { equals: 'pending' } },
    sort: '-createdAt',
  })

  return NextResponse.json(result)
}
