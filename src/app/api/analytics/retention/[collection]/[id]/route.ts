import { NextResponse } from 'next/server'
import payload from 'payload'

type Params = {
  params: {
    collection: string
    id: string
  }
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { collection, id } = params

    const result = await payload.find({
      collection: 'analytics',
      where: {
        'relatedContent.relationTo': { equals: collection },
        'relatedContent.value': { equals: id },
      },
      limit: 1,
    })

    const doc = result.docs[0] as any

    if (!doc) {
      return NextResponse.json(
        { retentionBuckets: [], message: 'no-analytics-found' },
        { status: 200 },
      )
    }

    return NextResponse.json({
      content: { collection, id },
      retentionBuckets: doc.retentionBuckets || [],
      completionRate: doc.completionRate ?? 0,
    })
  } catch (err) {
    console.error('Retention analytics error:', err)
    return NextResponse.json({ error: 'retention-failed' }, { status: 500 })
  }
}
