import payload from 'payload'
import { NextResponse } from 'next/server'

type Params = {
  params: {
    collection: string
    id: string
  }
}

export async function GET(req: Request, { params }: Params) {
  const { collection, id } = params

  const result = await payload.find({
    collection: 'analytics',
    where: {
      'relatedContent.relationTo': { equals: collection },
      'relatedContent.value': { equals: id },
    },
    limit: 1,
  })

  return NextResponse.json({ analytics: result.docs[0] || null })
}
