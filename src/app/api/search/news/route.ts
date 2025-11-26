// app/api/search/news/route.ts
import payload from 'payload'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')
  const news = await payload.find({
    collection: 'articles',
    where: { title: { contains: q } },
  })
  return NextResponse.json(news.docs)
}
