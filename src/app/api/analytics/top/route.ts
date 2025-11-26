import { NextResponse } from 'next/server'
import payload from 'payload'

const ALLOWED_METRICS = ['plays', 'views', 'likes', 'engagementScore', 'trendScore'] as const
type Metric = (typeof ALLOWED_METRICS)[number]

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const metric = (url.searchParams.get('metric') as Metric) || 'trendScore'
    const limit = Number(url.searchParams.get('limit') || '10')
    const contentType = url.searchParams.get('contentType') // optional

    if (!ALLOWED_METRICS.includes(metric)) {
      return NextResponse.json({ error: 'invalid-metric' }, { status: 400 })
    }

    const where: any = {}

    if (contentType) {
      where['relatedContent.relationTo'] = { equals: contentType }
    }

    const result = await payload.find({
      collection: 'analytics',
      where,
      sort: `-${metric}`,
      limit,
    })

    return NextResponse.json({
      metric,
      items: result.docs,
    })
  } catch (err) {
    console.error('Top analytics error:', err)
    return NextResponse.json({ error: 'top-failed' }, { status: 500 })
  }
}
