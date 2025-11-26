import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(
  req: Request,
  { params }: { params: { collection: string; id: string } },
) {
  const { collection, id } = params

  const comments = await payload.find({
    collection: 'comments',
    where: {
      'target.relationTo': { equals: collection },
      'target.value': { equals: id },
      status: { equals: 'approved' },
    },
    sort: '-createdAt',
  })

  return NextResponse.json(comments)
}
